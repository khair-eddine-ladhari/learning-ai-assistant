






import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ── Icons ─────────────────────────────────────────────────────────
const Icon = {
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  doc: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /><path d="M14 2v6h6M9 13h6M9 17h4" />
    </svg>
  ),
  chat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  summary: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  quiz: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
  note: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  bot: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 15h.01M16 15h.01" />
    </svg>
  ),
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  copy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  loader: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  ),
  trash: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  ),
  add: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  edit: (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
),
x: (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
),
};

// ── Tab Button ─────────────────────────────────────────────────────
const TabBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 w-full
      ${active
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
  >
    <span className={active ? "text-gray-700" : "text-gray-400"}>{icon}</span>
    {label}
  </button>
);

// ── Message Bubble ─────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const [copied, setCopied] = useState(false);
  const isAI = msg.role === "assistant";

  const copy = () => {
    navigator.clipboard.writeText(msg.content);


    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 group ${isAI ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
        ${isAI ? "bg-gray-900 text-white" : "bg-blue-500 text-white"}`}>
        {isAI ? Icon.bot : Icon.user}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] relative ${isAI ? "" : ""}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isAI
            ? "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
            : "bg-gray-900 text-white rounded-tr-sm"
          }`}>
          {msg.content}
        </div>

        {/* Copy button */}
        {isAI && (
          <button
            onClick={copy}
            className="absolute -bottom-5 left-0 opacity-0 group-hover:opacity-100 transition-opacity
                       flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            {copied ? Icon.check : Icon.copy}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Typing Indicator ───────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex gap-3">
    <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0">
      {Icon.bot}
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1 items-center h-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Quiz Component ─────────────────────────────────────────────────
const QuizPanel = ({ docId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setRevealed({});
    try {
      const res = await axios.post(`${API_URL}/api/quiz/${docId}`, {}, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setQuestions(res.data.questions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
      <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full" />
      <p className="text-sm">Generating quiz…</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center h-48 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
        {Icon.quiz}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Test your understanding</p>
        <p className="text-xs text-gray-400 mt-1">AI will generate questions from this document</p>
      </div>
      <button
        onClick={generate}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        Generate Quiz
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 bg-white">
          <p className="text-sm font-medium text-gray-800 mb-3">
            <span className="text-gray-400 mr-2">{i + 1}.</span>{q.question}
          </p>
          <div className="space-y-2">
            {q.options?.map((opt, j) => {
              const letter = ["A", "B", "C", "D"][j];
              const isSelected = answers[i] === letter;
             const isCorrect = revealed[i] && opt === q.answer;
              const isWrong = revealed[i] && isSelected && opt !== q.answer;
              return (
                <button
                  key={j}
                  onClick={() => !revealed[i] && setAnswers(a => ({ ...a, [i]: letter }))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all border
                    ${isCorrect ? "bg-green-50 border-green-300 text-green-800"
                      : isWrong ? "bg-red-50 border-red-300 text-red-700"
                      : isSelected ? "border-gray-900 bg-gray-50 text-gray-900"
                      : "border-gray-100 hover:border-gray-300 text-gray-600"}`}
                >
                  <span className="font-medium mr-2">{letter}.</span>{opt}
                </button>
              );
            })}
          </div>
          {answers[i] && !revealed[i] && (
            <button
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              className="mt-3 text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2"
            >
              Check answer
            </button>
          )}
          {revealed[i] && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-medium text-gray-700">Explanation: </span>{q.explanation}
            </p>
          )}
        </div>
      ))}
      <button
        onClick={generate}
        className="w-full py-2.5 border border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 rounded-xl transition-colors"
      >
        Regenerate quiz
      </button>
    </div>
  );
};

// ── Notes Component ────────────────────────────────────────────────
const NotesPanel = ({ docId }) => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const token = sessionStorage.getItem("token");

  const getNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notes/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getNotes();
  }, [docId]);

  const add = async () => {
    if (!input.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/api/notes/${docId}`,
        { text: input.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([response.data, ...notes]);
      setInput("");
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notes/${docId}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const fmt = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });




  const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");

const startEdit = (n) => {
  setEditingId(n._id);
  setEditText(n.text);
};

const saveEdit = async (id) => {
  if (!editText.trim()) return;
  try {
    const response = await axios.put(
      `${API_URL}/api/notes/${docId}/${id}`,
      { text: editText.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotes(notes.map((n) => (n._id === id ? response.data : n)));
    setEditingId(null);
  } catch (e) {
    console.error(e);
  }
};
  return (
    <div className="flex flex-col gap-3">
      {/* Input */}
      <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-400 transition-colors">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.metaKey && add()}
          placeholder="Write a note about this document…"
          rows={3}
          className="w-full px-3 py-3 text-sm text-gray-800 placeholder-gray-300 resize-none outline-none bg-white"
        />
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
          <span className="text-xs text-gray-300">⌘ Enter to save</span>
          <button
            onClick={add}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg
                       hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {Icon.add} Add note
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-300 text-sm">No notes yet</div>
      ) : (
        <div className="space-y-2">
        {notes.map(n => (
  <div key={n._id} className="group bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-colors">
    {editingId === n._id ? (
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
        rows={3}
        autoFocus
      />
    ) : (
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{n.text}</p>
    )}
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs text-gray-300">{fmt(n.createdAt)}</span>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
        {editingId === n._id ? (
          <>
            <button onClick={() => saveEdit(n._id)} className="text-gray-300 hover:text-green-500">
              {Icon.check}
            </button>
            <button onClick={() => setEditingId(null)} className="text-gray-300 hover:text-gray-500">
              {Icon.x}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => startEdit(n)} className="text-gray-300 hover:text-blue-400">
              {Icon.edit}
            </button>
            <button onClick={() => del(n._id)} className="text-gray-300 hover:text-red-400">
              {Icon.trash}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  );
};

// ── Summary Panel ──────────────────────────────────────────────────
const SummaryPanel = ({ docId }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true); // true initially, since we're fetching
  const token = sessionStorage.getItem("token");

  // Fetch existing summary on mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/${docId}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data.summary || "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [docId]);

  // Generate a new summary
  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/chat/${docId}`,
        { message: "Please provide a comprehensive summary of this document. Include the main topics, key points, and important conclusions." },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newSummary = res.data.response || "";
      setSummary(newSummary);

      // save it so it persists
      await axios.put(`${API_URL}/api/chat/${docId}/summary`,
        { summary: newSummary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
      <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full" />
      <p className="text-sm">Summarizing document…</p>
    </div>
  );

  if (!summary) return (
    <div className="flex flex-col items-center justify-center h-48 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
        {Icon.summary}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Document summary</p>
        <p className="text-xs text-gray-400 mt-1">Get a concise overview of this document</p>
      </div>
      <button
        onClick={generate}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        Summarize
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-4 shadow-sm">
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      </div>
      <button
        onClick={generate}
        className="w-full py-2.5 border border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 rounded-xl transition-colors"
      >
        Regenerate summary
      </button>
    </div>
  );
};

// ── Main ChatPage ──────────────────────────────────────────────────
export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("chat");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);

useEffect(() => {
  axios.get(`${API_URL}/api/chat/${id}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  }).then(res => {
    if (res.data.messages.length > 0) {
      setMessages(res.data.messages);
    } else {
      setMessages([
        { role: "assistant", content: "Hi! I've read this document and I'm ready to answer your questions. What would you like to know?" }
      ]);
    }
  }).catch(console.error);
}, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    axios.get(`${API_URL}/api/documents/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }).then(res => setDoc(res.data)).catch(console.error);
  }, [id]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/chat/${id}`,
        { message: userMsg.content },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      setMessages(m => [...m, { role: "assistant", content: res.data.response }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestions = [
    "What are the main topics?",
    "Explain the key concepts",
    "What conclusions does it draw?",
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Top bar ── */}
      <header className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 z-10">
        <button
          onClick={() => navigate("/homepage")}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm"
        >
          {Icon.back}
          <span className="hidden sm:inline">Documents</span>
        </button>

        <div className="w-px h-4 bg-gray-200" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-300 shrink-0">{Icon.doc}</span>
          <span className="text-sm font-medium text-gray-700 truncate">
            {doc?.originalName || "Loading…"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-400 hidden sm:inline">Ready</span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ── */}
        <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-3 px-2 shrink-0 hidden md:flex">
          <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider px-2 mb-2">Tools</p>
          <nav className="flex flex-col gap-0.5">
            <TabBtn icon={Icon.chat} label="Chat" active={tab === "chat"} onClick={() => setTab("chat")} />
            <TabBtn icon={Icon.summary} label="Summary" active={tab === "summary"} onClick={() => setTab("summary")} />
            <TabBtn icon={Icon.quiz} label="Quiz" active={tab === "quiz"} onClick={() => setTab("quiz")} />
            <TabBtn icon={Icon.note} label="Notes" active={tab === "notes"} onClick={() => setTab("notes")} />
          </nav>
        </aside>

        {/* ── Center: chat ── */}
        <main className={`flex flex-col flex-1 overflow-hidden ${tab !== "chat" ? "hidden md:flex" : "flex"}`}>

          {/* Mobile tab bar */}
          <div className="md:hidden flex border-b border-gray-100 bg-white px-2 py-1.5 gap-1 shrink-0">
            {[
              { id: "chat", icon: Icon.chat, label: "Chat" },
              { id: "summary", icon: Icon.summary, label: "Summary" },
              { id: "quiz", icon: Icon.quiz, label: "Quiz" },
              { id: "notes", icon: Icon.note, label: "Notes" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs transition-colors
                  ${tab === t.id ? "bg-gray-100 text-gray-800" : "text-gray-400"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && <TypingIndicator />}

            {/* Suggestions (only when 1 message) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pl-10">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full
                               hover:border-gray-400 hover:text-gray-800 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-end bg-white border border-gray-200 rounded-2xl px-4 py-3
                            focus-within:border-gray-400 transition-colors shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything about this document…"
                rows={1}
                className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-300 leading-relaxed bg-transparent"
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-xl
                           hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
              >
                {loading ? Icon.loader : Icon.send}
              </button>
            </div>
            <p className="text-center text-xs text-gray-300 mt-2">
              Answers are generated from this document · Always verify important information
            </p>
          </div>
        </main>

        {/* ── Right panel: tools ── */}
        <aside className={`w-80 bg-white border-l border-gray-100 flex flex-col overflow-hidden
          ${tab === "chat" ? "hidden md:flex" : "flex flex-1 md:flex-none md:w-80"}`}>

          {/* Panel header */}
          <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
            <span className="text-gray-400">
              {tab === "summary" ? Icon.summary : tab === "quiz" ? Icon.quiz : Icon.note}
            </span>
            <span className="text-sm font-medium text-gray-700 capitalize">{tab}</span>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {tab === "summary" && <SummaryPanel docId={id} />}
            {tab === "quiz" && <QuizPanel docId={id} />}
            {tab === "notes" && <NotesPanel docId={id} />}
            {tab === "chat" && (
              <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                <p className="text-sm">Select a tool from the sidebar</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}