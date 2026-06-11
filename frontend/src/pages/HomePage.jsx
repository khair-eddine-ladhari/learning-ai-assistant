import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext } from "react"
import { GlobalContext } from "../context/AuthContext"

const API_URL = import.meta.env.VITE_API_URL

// ── Helpers ───────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── Document Card ─────────────────────────────────────────────────
const DocumentCard = ({ doc, onDelete, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onClick(doc._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? '#fafafa' : 'white',
        border: `1px solid ${hovered ? '#d4d4d4' : '#ebebeb'}`,
        borderRadius: '14px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: hovered ? '#111' : '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease', flexShrink: 0,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
            stroke={hovered ? 'white' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2v6h6M9 13h6M9 17h4" stroke={hovered ? 'white' : '#666'} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Name + date */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '13px', fontWeight: '600', color: '#111',
          lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {doc.originalName}
        </p>
        <p style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>{formatDate(doc.createdAt)}</p>
      </div>

      {/* Three-dot menu */}
      <div
        style={{ position: 'absolute', top: '12px', right: '12px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#ccc', padding: '4px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#666'}
          onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: '28px', right: 0,
            background: 'white', border: '1px solid #ebebeb',
            borderRadius: '10px', padding: '4px', minWidth: '130px',
            zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            <button
              onClick={() => { onDelete(doc._id); setMenuOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', background: 'none', border: 'none',
                borderRadius: '7px', color: '#ef4444', fontSize: '13px',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  const [uploading, setUploading] = useState(false)

  const handleFile = (f) => {
    if (f?.type === 'application/pdf') setFile(f)
  }

  const addDocument = async () => {
    const data = new FormData()
    data.append("pdf", file)
    setUploading(true)
    try {
      const res = await axios.post(`${API_URL}/api/documents`, data, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      })
      onUploaded(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 50, padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white', borderRadius: '20px', padding: '32px',
          width: '100%', maxWidth: '440px', border: '1px solid #ebebeb',
          boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>Upload a PDF</h2>
            <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Max 10 MB · PDF only</p>
          </div>
          <button onClick={onClose}
            style={{ background: '#f5f5f5', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', fontSize: '18px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
            onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
          >×</button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('pdf-input').click()}
          style={{
            border: `2px dashed ${dragging ? '#111' : file ? '#22c55e' : '#e5e5e5'}`,
            borderRadius: '14px', padding: '40px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
            background: dragging ? '#f5f5f5' : file ? '#f0fdf4' : '#fafafa',
          }}
        >
          <input id="pdf-input" type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])} />
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>{file ? '📄' : '📁'}</div>
          {file ? (
            <>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>{file.name}</p>
              <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>{(file.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>Drop your PDF here</p>
              <p style={{ fontSize: '12px', color: '#bbb', marginTop: '4px' }}>or click to browse</p>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #e5e5e5', background: 'white', fontSize: '13px', fontWeight: '500', color: '#666', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >Cancel</button>
          <button
            onClick={addDocument}
            disabled={!file || uploading}
            style={{
              flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
              background: file && !uploading ? '#111' : '#f0f0f0',
              fontSize: '13px', fontWeight: '600',
              color: file && !uploading ? 'white' : '#bbb',
              cursor: file && !uploading ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {uploading ? (
              <>
                <div style={{ width: '14px', height: '14px', border: '2px solid #ffffff40', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Uploading…
              </>
            ) : 'Upload PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── HomePage ──────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useContext(GlobalContext)

  const [documents, setDocuments] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    console.log("👤 user changed:", user)
  }, [user])

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (!token) { setFetching(false); return }
    axios.get(`${API_URL}/api/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setDocuments(res.data))
      .catch((err) => console.error("Failed to fetch documents:", err))
      .finally(() => setFetching(false))
  }, [])

  const signOutfunction = () => {
    logout()
    navigate("/")
  }

  const handleDelete = (id) => setDocuments((prev) => prev.filter((d) => d._id !== id))

  const filtered = documents.filter((d) =>
    d.originalName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} } * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0f0f0',
        height: '52px', display: 'flex', alignItems: 'center',
        padding: '0 32px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => navigate("/")}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M9 13h6M9 17h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#111', letterSpacing: '-0.3px' }}>DocChat</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#555' }}>
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', color: '#666', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email}
              </span>
            </div>
          )}
          <button onClick={signOutfunction}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', background: 'white', fontSize: '12px', fontWeight: '500', color: '#666', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#111'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#666'; }}
          >Sign out</button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', animation: 'fadeUp 0.5s ease both' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', letterSpacing: '-0.5px' }}>My Documents</h1>
            <p style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>
              {fetching ? 'Loading…' : `${documents.length} ${documents.length === 1 ? 'document' : 'documents'}`}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#111', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Upload PDF
          </button>
        </div>

        {/* Search */}
        {documents.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '28px', animation: 'fadeUp 0.5s 0.1s ease both' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              style={{
                width: '100%', background: 'white', border: '1px solid #ebebeb',
                borderRadius: '10px', padding: '10px 14px 10px 38px',
                fontSize: '13px', color: '#111', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#aaa'}
              onBlur={e => e.target.style.borderColor = '#ebebeb'}
            />
          </div>
        )}

        {/* Loading skeleton */}
        {fetching && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: '140px', borderRadius: '14px', background: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {/* Content */}
        {!fetching && (
          filtered.length === 0 && search ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeUp 0.4s ease both' }}>
              <p style={{ fontSize: '14px', color: '#aaa' }}>No documents match "{search}"</p>
              <button onClick={() => setSearch('')}
                style={{ marginTop: '12px', background: 'none', border: 'none', color: '#111', fontSize: '13px', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Clear search
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 24px', animation: 'fadeUp 0.4s ease both' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>📂</div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '6px' }}>No documents yet</h2>
              <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '24px' }}>Upload a PDF to start chatting with it</p>
              <button
                onClick={() => setShowUpload(true)}
                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#111', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#111'}
              >
                Upload your first PDF
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', animation: 'fadeUp 0.4s ease both' }}>
              {filtered.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  doc={doc}
                  onDelete={handleDelete}
                  onClick={(id) => navigate(`/chat/${id}`)}
                />
              ))}
            </div>
          )
        )}
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={(newDoc) => {
            setDocuments((prev) => [...prev, newDoc])
            setShowUpload(false)
          }}
        />
      )}
    </div>
  )
}