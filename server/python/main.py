import os
from dotenv import load_dotenv
load_dotenv()

import json
import requests
from io import BytesIO
from pypdf import PdfReader

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import tiktoken
from groq import Groq
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
import os
from dotenv import load_dotenv
from tenacity import retry, wait_random_exponential, stop_after_attempt

load_dotenv()

PORT = int(os.getenv("PORT", 5000))
# --- clients ---
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
embedder = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1")

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# tiktoken — free, no gating, close enough for estimating any model's tokens
encoding = tiktoken.encoding_for_model("gpt-4o-mini")



# --- shared retry wrapper ---
@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))
def call_groq(messages, temperature=0.2, max_tokens=1000):
    return client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )


# ---------- /process ----------
class ProcessRequest(BaseModel):
    file_url: str
    namespace: str

class ProcessResponse(BaseModel):
    status: str
    chunks: int

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunks.append(" ".join(words[i:i + chunk_size]))
        i += chunk_size - overlap
    return chunks

@app.post("/process", response_model=ProcessResponse)
async def process_pdf(req: ProcessRequest):
    resp = requests.get(req.file_url)
    resp.raise_for_status()

    reader = PdfReader(BytesIO(resp.content))
    full_text = ""
    for page in reader.pages:
        full_text += (page.extract_text() or "") + "\n"

    chunks = chunk_text(full_text)
    if not chunks:
        return ProcessResponse(status="no_text_found", chunks=0)

    embeddings = embedder.encode(chunks).tolist()

    vectors = [
        {"id": f"{req.namespace}-{i}", "values": embeddings[i], "metadata": {"text": chunks[i]}}
        for i in range(len(chunks))
    ]
    index.upsert(vectors=vectors, namespace=req.namespace)



    requests.post(f"http://localhost:{PORT}/api/documents/status",
     json={"namespace": req.namespace, "status": "ready"})

    return ProcessResponse(status="done", chunks=len(chunks))


# ---------- /chat ----------
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    namespace: str
    history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        query_vector = embedder.encode([req.query]).tolist()[0]

        results = index.query(
            vector=query_vector,
            namespace=req.namespace,
            top_k=4,
            include_metadata=True,
        )

        matches = [r for r in results["matches"] if r["score"] > 0.45]
        if len(matches) == 0:
             matches = results["matches"][:2]

        context = "\n\n---\n\n".join([r["metadata"]["text"] for r in matches])

        system_prompt = (
            "You are a helpful assistant that answers questions based on the provided document context.\n\n"
            "Rules:\n"
            "- Quote the relevant sentence directly from the context\n"
            "- Then explain it in simple terms\n"
            "- If the user talks with you generally like greeting, answer also with a greeting and say what you can help them with today\n"
            "- If the answer is NOT in the context, say ONLY: 'This is not covered in the provided document'\n"
            "- Never answer from your own knowledge, only from the context\n"
            "- If multiple parts are relevant, mention ALL of them\n"
            "- If a question has multiple scenarios, explain each one separately\n\n"
            f"Context:\n{context}"
        )

        messages = [{"role": "system", "content": system_prompt}]
        for h in req.history:
            messages.append({"role": h.role, "content": h.content})
        messages.append({"role": "user", "content": req.query})





        full_prompt = " ".join([m["content"] for m in messages])
        num_tokens = len(encoding.encode(full_prompt))

        if num_tokens > 6000:
            return ChatResponse(response="Your message and history are too long, please start a new conversation.")


        response = call_groq(messages)
        return ChatResponse(response=response.choices[0].message.content)

    except Exception as e:
        return ChatResponse(response=f"An error occurred: {e}")


# ---------- /quiz ----------
class QuizResponse(BaseModel):
    questions: list

@app.post("/quiz")
async def generate_quiz(req: dict):
    namespace = req.get("namespace")

    dummy_vector = embedder.encode(["generate a quiz"]).tolist()[0]
    results = index.query(
        vector=dummy_vector,
        namespace=namespace,
        top_k=8,
        include_metadata=True
    )

    context = "\n\n".join([m["metadata"]["text"] for m in results.get("matches", [])])

    prompt = f"""Based on this document content, generate 5 unique multiple choice questions.
Return ONLY a JSON array, no explanation, no markdown, like this:
[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }}
]

Document content:
{context}"""

    response = call_groq(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1500
    )

    raw = response.choices[0].message.content.strip()
    questions = json.loads(raw)

    return {"questions": questions}







class DeleteNamespaceRequest(BaseModel):
    namespace: str

@app.delete("/delete-namespace")
async def delete_namespace(req: DeleteNamespaceRequest):
    index.delete(delete_all=True, namespace=req.namespace)
    return {"status": "deleted"}




class CompleteRequest(BaseModel):
    namespace: str
    status: str  # "ready" or "failed"

@app.post("/process-complete")
async def process_complete(req: CompleteRequest):
    return {"status": req.status}