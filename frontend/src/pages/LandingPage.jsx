import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react"
import { GlobalContext } from "../context/AuthContext";


// ── useInView hook ─────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Animated section wrapper ───────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────
function Navbar({ navigate }) {


  const { user } = useContext(GlobalContext);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "52px",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #f0f0f0" : "1px solid transparent",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center",
        padding: "0 2rem",
        justifyContent: "space-between",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        onClick={() => navigate("/")}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2v6h6M9 13h6M9 17h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#111", letterSpacing: "-0.3px" }}>DocChat</span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {!user ? <button onClick={() => navigate("/login")}
          style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid #e5e5e5", background: "transparent", fontSize: "13px", fontWeight: "500", color: "#555", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.target.style.background = "#f5f5f5"; e.target.style.color = "#111"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#555"; }}
        >
          Sign in
        </button>:""}

       
        <button onClick={() => navigate("/register")}
          style={{ padding: "7px 16px", borderRadius: "8px", border: "none", background: "#111", fontSize: "13px", fontWeight: "500", color: "white", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.target.style.background = "#333"; }}
          onMouseLeave={e => { e.target.style.background = "#111"; }}
        >
          Get started
        </button>
      </div>
    </nav>
  );
}

// ── Feature card ───────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#fafafa" : "white",
          border: `1px solid ${hovered ? "#d4d4d4" : "#ebebeb"}`,
          borderRadius: "16px", padding: "24px",
          cursor: "default",
          transition: "all 0.2s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: hovered ? "#111" : "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          transition: "all 0.2s ease",
          fontSize: "18px",
        }}>
          {typeof icon === "string"
            ? <span style={{ filter: hovered ? "brightness(10)" : "none", transition: "filter 0.2s" }}>{icon}</span>
            : icon}
        </div>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "6px" }}>{title}</p>
        <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>{desc}</p>
      </div>
    </Reveal>
  );
}

// ── Step ───────────────────────────────────────────────────────────
function Step({ num, title, desc, delay, active }) {
  return (
    <Reveal delay={delay}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: active ? "#111" : "#f5f5f5",
          border: `1px solid ${active ? "#111" : "#e5e5e5"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.3s",
        }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: active ? "white" : "#999" }}>{num}</span>
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "4px" }}>{title}</p>
          <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ── Animated counter ───────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Mock chat UI ───────────────────────────────────────────────────
function MockChat() {
  const messages = [
    { role: "ai", text: "I've read your document. It covers gradient descent, backpropagation, and the bias-variance tradeoff. What would you like to explore?" },
    { role: "user", text: "Explain the bias-variance tradeoff simply" },
    { role: "ai", text: "From slide 14: bias = error from oversimplified models, variance = sensitivity to training data. High bias underfits, high variance overfits..." },
  ];
  return (
    <div style={{
      background: "white", borderRadius: "16px", border: "1px solid #ebebeb",
      overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      {/* Chrome bar */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", padding: "10px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
        <div style={{ flex: 1, marginLeft: "8px", background: "#ebebeb", borderRadius: "6px", padding: "3px 12px", fontSize: "11px", color: "#aaa", textAlign: "center" }}>
          docchat.app/chat
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", height: "280px" }}>
        {/* Sidebar */}
        <div style={{ width: "180px", borderRight: "1px solid #ebebeb", padding: "16px 12px", flexShrink: 0, background: "#fafafa" }}>
          <p style={{ fontSize: "10px", fontWeight: "600", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Documents</p>
          {["Lecture 01 — ML Intro", "Research Paper", "Chapter 4 Notes"].map((d, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 8px", borderRadius: "8px", marginBottom: "2px",
              background: i === 0 ? "#111" : "transparent",
              cursor: "pointer",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "white" : "#bbb"} strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /><path d="M14 2v6h6" />
              </svg>
              <span style={{ fontSize: "11px", color: i === 0 ? "white" : "#999", truncate: true, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d}</span>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px", gap: "12px", overflow: "hidden" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "ai" && (
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "8px", color: "white", fontWeight: "700" }}>AI</span>
                </div>
              )}
              <div style={{
                maxWidth: "75%", padding: "8px 12px", borderRadius: "12px",
                background: m.role === "user" ? "#111" : "white",
                border: m.role === "user" ? "none" : "1px solid #ebebeb",
                fontSize: "11px", color: m.role === "user" ? "white" : "#333",
                lineHeight: "1.5",
              }}>
                {m.text}
                {i === 2 && <span style={{ display: "inline-block", width: "2px", height: "11px", background: "#111", marginLeft: "3px", animation: "blink 1s infinite", verticalAlign: "middle" }} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid #ebebeb", padding: "12px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
        <div style={{ flex: 1, background: "#f5f5f5", borderRadius: "10px", padding: "8px 12px", fontSize: "11px", color: "#bbb" }}>
          Ask anything about this document…
        </div>
        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" /></svg>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 3), 2000);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: "📄", title: "Upload any PDF", desc: "Drag and drop your lecture notes, papers, or any PDF. Processed and indexed in seconds.", delay: 0 },
    { icon: "🧠", title: "RAG-powered answers", desc: "Every answer is grounded in your document. No hallucinations — just your content, understood.", delay: 80 },
    { icon: "💬", title: "Natural conversation", desc: "Ask follow-up questions, dig deeper, or ask for simpler explanations. It remembers context.", delay: 160 },
    { icon: "📋", title: "Auto-summaries", desc: "One click to get a concise overview of any document. Save time, get the big picture fast.", delay: 240 },
    { icon: "🎯", title: "Smart quizzes", desc: "Test your understanding with AI-generated questions based on exactly what you uploaded.", delay: 320 },
    { icon: "🔒", title: "Private by default", desc: "Your documents stay in your workspace. Nothing is shared or used to train external models.", delay: 400 },
  ];

  const steps = [
    { num: "1", title: "Upload your documents", desc: "Drop in PDFs — lecture notes, papers, textbooks." },
    { num: "2", title: "AI indexes everything", desc: "The RAG pipeline chunks, embeds, and indexes in seconds." },
    { num: "3", title: "Start asking questions", desc: "Chat naturally. Get answers from your own material." },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Documents processed" },
    { value: 98, suffix: "%", label: "Answer accuracy" },
    { value: 2, suffix: "s", label: "Average response time" },
    { value: 500, suffix: "+", label: "Active students" },
  ];

  return (
    <div style={{ background: "white", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#111", overflowX: "hidden" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <Navbar navigate={navigate} />

      {/* ── HERO ── */}
      <section style={{ paddingTop: "140px", paddingBottom: "100px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center", maxWidth: "960px", margin: "0 auto" }}>
        {/* Badge */}
        <div style={{ animation: "fadeUp 0.6s ease both", display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", borderRadius: "100px", border: "1px solid #e5e5e5", background: "#fafafa", marginBottom: "28px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "blink 2s infinite" }} />
          <span style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>RAG-powered document chat</span>
        </div>

        {/* Headline */}
        <h1 style={{ animation: "fadeUp 0.6s 0.1s ease both", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: "700", lineHeight: "1.08", letterSpacing: "-2px", color: "#0a0a0a", marginBottom: "20px" }}>
          Chat with your<br />
          <span style={{ color: "#0a0a0a", position: "relative", display: "inline-block" }}>
            documents.
            <svg style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "8px" }} viewBox="0 0 200 8" preserveAspectRatio="none">
              <path d="M0 6 Q50 1 100 5 Q150 9 200 4" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Sub */}
        <p style={{ animation: "fadeUp 0.6s 0.2s ease both", fontSize: "18px", color: "#666", lineHeight: "1.65", maxWidth: "520px", margin: "0 auto 36px" }}>
          Upload a PDF, ask anything. Get answers grounded in your own material — not the entire internet.
        </p>

        {/* CTAs */}
        <div style={{ animation: "fadeUp 0.6s 0.3s ease both", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "13px 28px", borderRadius: "12px", border: "none", background: "#111", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#333"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start for free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "13px 28px", borderRadius: "12px", border: "1px solid #e5e5e5", background: "white", color: "#555", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#555"; }}
          >
            Sign in
          </button>
        </div>

        <p style={{ animation: "fadeUp 0.6s 0.4s ease both", fontSize: "12px", color: "#bbb", marginTop: "16px" }}>
          No credit card required · Free to start
        </p>

        {/* Mock UI */}
        <div style={{ marginTop: "64px", animation: "fadeUp 0.8s 0.5s ease both" }}>
          <MockChat />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", background: "#fafafa", padding: "48px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px", textAlign: "center" }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div>
                <p style={{ fontSize: "32px", fontWeight: "700", color: "#111", letterSpacing: "-1px" }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "96px 24px", maxWidth: "1040px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Features</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "700", letterSpacing: "-1px", color: "#111", marginBottom: "12px" }}>
              Everything you need to learn faster
            </h2>
            <p style={{ fontSize: "15px", color: "#888", maxWidth: "440px", margin: "0 auto", lineHeight: "1.6" }}>
              A focused toolkit built around one idea: your documents, deeply understood.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "96px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

          {/* Left */}
          <div>
            <Reveal>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>How it works</p>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "700", letterSpacing: "-0.8px", color: "#111", marginBottom: "40px", lineHeight: "1.2" }}>
                Three steps to understand anything
              </h2>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {steps.map((s, i) => <Step key={i} {...s} delay={i * 120} active={activeStep === i} />)}
            </div>
          </div>

          {/* Right — document stack */}
          <Reveal delay={200}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { name: "Introduction to Neural Networks.pdf", size: "2.4 MB", status: "indexed", color: "#111" },
                { name: "Transformer Architecture Paper.pdf", size: "1.8 MB", status: "indexed", color: "#111" },
                { name: "Week 5 Lecture Notes.pdf", size: "840 KB", status: "processing", color: "#f59e0b" },
              ].map((doc, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px", borderRadius: "12px",
                  background: "white", border: "1px solid #ebebeb",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#d4d4d4"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /><path d="M14 2v6h6M9 13h6M9 17h4" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                    <p style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>{doc.size}</p>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "100px",
                    background: doc.status === "indexed" ? "#f0fdf4" : "#fffbeb",
                    color: doc.status === "indexed" ? "#16a34a" : "#d97706",
                    border: `1px solid ${doc.status === "indexed" ? "#bbf7d0" : "#fde68a"}`,
                    flexShrink: 0,
                  }}>
                    {doc.status}
                  </span>
                </div>
              ))}

              <div style={{ padding: "14px 16px", borderRadius: "12px", background: "#111", display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, animation: "blink 2s infinite" }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: "white" }}>AI ready to answer</p>
                  <p style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>3 documents · 312 chunks indexed</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TOOLS SECTION ── */}
      <section style={{ padding: "96px 24px", maxWidth: "960px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Built-in tools</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "700", letterSpacing: "-1px", color: "#111" }}>
              More than just chat
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#ebebeb", borderRadius: "16px", overflow: "hidden" }}>
          {[
            { label: "Chat", desc: "Ask anything, get grounded answers", icon: "💬" },
            { label: "Summary", desc: "One-click document overview", icon: "📋" },
            { label: "Quiz", desc: "Test yourself on your material", icon: "🎯" },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: "white", padding: "32px 28px", textAlign: "center", cursor: "default", transition: "background 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{t.icon}</div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#111", marginBottom: "6px" }}>{t.label}</p>
                <p style={{ fontSize: "13px", color: "#888" }}>{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 24px 96px", maxWidth: "720px", margin: "0 auto" }}>
        <Reveal>
          <div style={{
            background: "#0a0a0a", borderRadius: "24px", padding: "64px 48px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* subtle grid pattern */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "700", color: "white", letterSpacing: "-1px", marginBottom: "14px", lineHeight: "1.15" }}>
                Ready to learn smarter?
              </h2>
              <p style={{ fontSize: "15px", color: "#888", marginBottom: "32px", lineHeight: "1.6" }}>
                Upload your first document and ask your first question in under a minute.
              </p>
              <button
                onClick={() => navigate("/register")}
                style={{ padding: "13px 32px", borderRadius: "12px", border: "none", background: "white", color: "#111", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0f0f0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Get started for free →
              </button>
              <p style={{ fontSize: "12px", color: "#555", marginTop: "14px" }}>No credit card required</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "960px", margin: "0 auto", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: "13px", color: "#888" }}>DocChat</span>
        </div>
        <p style={{ fontSize: "12px", color: "#ccc" }}>Built with React · Vite · Tailwind · Node.js · MongoDB</p>
      </footer>
    </div>
  );
}