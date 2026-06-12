import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # adjust to your frontend's port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Message]] = []


class ChatResponse(BaseModel):
    response: str


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        messages = [{"role": "system", "content": "You are a helpful assistant."}]
        for h in req.history:
            messages.append({"role": h.role, "content": h.content})
        messages.append({"role": "user", "content": req.query})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
        )

        return ChatResponse(response=response.choices[0].message.content)

    except Exception as e:
        return ChatResponse(response=f"An error occurred: {e}")