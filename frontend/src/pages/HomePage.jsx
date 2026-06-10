import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
// ── Hard data ─────────────────────────────────────────────────────


// ── Helpers ───────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── Document Card ─────────────────────────────────────────────────
const DocumentCard = ({ doc, onDelete, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onClick={() => onClick(doc._id)}
      className="relative bg-[#1a1a2e] border border-[#2a2a45] rounded-xl p-5 cursor-pointer
                 hover:border-violet-500 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400
                      flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2v6h6M9 13h6M9 17h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Name + date */}
      <div>
        <p className="text-[#e2e2f0] font-semibold text-sm leading-snug line-clamp-2">
          {doc.originalName}
        </p>
        <p className="text-[#6b6b8a] text-xs mt-1">{formatDate(doc.createdAt)}</p>
      </div>

      {/* Three-dot menu */}
      <div
        className="absolute top-3 right-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-[#6b6b8a] hover:text-[#e2e2f0] p-1 rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute top-7 right-0 bg-[#252540] border border-[#2a2a45]
                          rounded-lg py-1 min-w-[120px] z-10 shadow-xl">
            <button
              onClick={() => { onDelete(doc._id); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-400
                         hover:bg-[#2a2a45] text-sm transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Upload Modal ──────────────────────────────────────────────────
const UploadModal = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (f?.type === 'application/pdf') setFile(f)
  }



const addDocument = async () => {
  const data = new FormData();
  data.append("pdf", file);
  try {
    const res = await axios.post(`${API_URL}/api/documents`, data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
   
    onUploaded(res.data);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center
                 justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a2e] border border-[#2a2a45] rounded-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#e2e2f0] font-semibold text-lg">Upload a PDF</h2>
          <button onClick={onClose} className="text-[#6b6b8a] hover:text-[#e2e2f0] text-xl leading-none">×</button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('pdf-input').click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
            ${dragging ? 'border-violet-500 bg-violet-500/5' : file ? 'border-green-500' : 'border-[#2a2a45] hover:border-violet-500/50'}`}
        >
          <input id="pdf-input" type="file" accept=".pdf" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          <div className="text-4xl mb-3">{file ? '📄' : '📁'}</div>
          {file ? (
            <>
              <p className="text-green-400 font-semibold text-sm">{file.name}</p>
              <p className="text-[#6b6b8a] text-xs mt-1">{(file.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <p className="text-[#e2e2f0] font-medium text-sm">Drop your PDF here</p>
              <p className="text-[#6b6b8a] text-xs mt-1">or click to browse — max 10 MB</p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#2a2a45] text-[#6b6b8a]
                       hover:border-violet-500/50 hover:text-[#e2e2f0] text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addDocument}
            disabled={!file}
            className={`flex-[2] py-2.5 rounded-lg text-sm font-semibold transition-all
              ${file
                ? 'bg-gradient-to-r from-violet-600 to-violet-400 text-white hover:opacity-90'
                : 'bg-[#2a2a45] text-[#6b6b8a] cursor-not-allowed'}`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

// ── HomePage ──────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()





  const [documents, setDocuments] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')
  const [fetching, setFetching] = useState(true)
  
useEffect(() => {
  const token = sessionStorage.getItem("token");

  if (!token) { setFetching(false); return; }

  axios.get(`${API_URL}/api/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
  
      setDocuments(res.data);
    })
    .catch((err) => console.error("Failed to fetch documents:", err))
    .finally(() => setFetching(false));
}, []);








  const handleDelete = (id) => setDocuments((prev) => prev.filter((d) => d._id !== id))

  const filtered = documents.filter((d) =>
    d.originalName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0f0f1a] font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0f0f1a] border-b border-[#1a1a2e]
                      px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400
                          flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[#e2e2f0] font-bold text-sm tracking-wide">DocChat</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#6b6b8a] text-sm hidden sm:block">user@email.com</span>
          <button className="text-sm text-[#6b6b8a] border border-[#2a2a45] px-3 py-1.5
                             rounded-lg hover:border-violet-500/50 hover:text-[#e2e2f0] transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="flex items-start justify-between mb-9">
          <div>
            <h1 className="text-[#e2e2f0] text-2xl font-bold">My Documents</h1>
            <p className="text-[#6b6b8a] text-sm mt-1">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-400
                       text-white text-sm font-semibold px-4 py-2.5 rounded-xl
                       hover:opacity-90 transition-opacity"
          >
            <span className="text-lg leading-none">+</span>
            Upload PDF
          </button>
        </div>

        {/* Search */}
        {documents.length > 0 && (
          <div className="relative mb-7">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b8a]"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full bg-[#1a1a2e] border border-[#2a2a45] rounded-xl
                         pl-10 pr-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#6b6b8a]
                         outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}

        {/* Content */}
        {filtered.length === 0 && search ? (
          <div className="text-center py-24">
            <p className="text-[#6b6b8a] text-sm">No documents match "{search}"</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-violet-400 text-sm hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-[#e2e2f0] font-semibold text-lg mb-2">No documents yet</h2>
            <p className="text-[#6b6b8a] text-sm mb-6">Upload a PDF to start chatting with it</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-violet-600 to-violet-400 text-white
                         text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Upload your first PDF
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc._id}
                doc={doc}
                onDelete={handleDelete}
                onClick={(id) => navigate(`/chat/${id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {showUpload && (
  <UploadModal
    onClose={() => setShowUpload(false)}
    onUploaded={(newDoc) => {
      setDocuments((prev) => [...prev, newDoc]); // ← add to list instantly
      setShowUpload(false); // ← close modal
    }}
  />
)}
    </div>
  )
}