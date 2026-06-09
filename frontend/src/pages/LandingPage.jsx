
import Navbar from "../components/Navbar";



import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Floating particle background ───────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,210,180,${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── Feature card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="group relative rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-teal-500/40 hover:bg-white/8 transition-all duration-300 cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left, rgba(20,184,166,0.08) 0%, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── How-it-works step ───────────────────────────────────────────────────────
function Step({ num, title, desc }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-9 h-9 rounded-full border border-teal-500/50 bg-teal-500/10 flex items-center justify-center">
        <span className="text-teal-400 text-sm font-bold">{num}</span>
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: "📄",
      title: "Upload Any Document",
      desc: "PDFs, lecture notes, research papers — your assistant reads everything so you don't have to re-read it.",
    },
    {
      icon: "🧠",
      title: "Instant AI Understanding",
      desc: "Ask anything about your materials. Get precise answers grounded in your own sources, not generic web results.",
    },
    {
      icon: "💬",
      title: "Contextual Chat",
      desc: "A persistent conversation that remembers your documents, your questions, and your learning history.",
    },
    {
      icon: "🔍",
      title: "Source-Grounded Answers",
      desc: "Every response is backed by your uploaded content. No hallucinations, no guessing — just your material.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast RAG",
      desc: "Powered by a vector search pipeline that retrieves the most relevant chunks from your documents in milliseconds.",
    },
    {
      icon: "🔒",
      title: "Your Data, Private",
      desc: "Documents stay in your workspace. Nothing is shared or used to train external models.",
    },
  ];

  const steps = [
    { num: "01", title: "Upload your documents", desc: "Drop in PDFs, notes, or any text-based files you want to study." },
    { num: "02", title: "Your assistant processes them", desc: "The RAG pipeline chunks, embeds, and indexes everything instantly." },
    { num: "03", title: "Start asking questions", desc: "Chat naturally. Get answers pulled directly from your material." },
  ];

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <ParticleCanvas />

      {/* ── NAVBAR ── */}
      <Navbar />
      

      {/* ── HERO ── */}
      <section className="relative z-10 pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-teal-300 text-xs font-medium tracking-wide uppercase">
              AI-Powered Learning
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Your documents.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #2dd4bf 0%, #34d399 50%, #6ee7b7 100%)",
              }}
            >
              Fully understood.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Upload your PDFs and lecture notes, then ask anything. Get answers
            grounded in your own material — not the entire internet.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="group px-7 py-3.5 rounded-xl font-semibold text-base bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all duration-200 shadow-xl shadow-teal-500/30 flex items-center gap-2"
            >
              Start for free
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/home")}
              className="px-7 py-3.5 rounded-xl font-semibold text-base border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 backdrop-blur-sm"
            >
              See a demo
            </button>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-slate-500 text-sm">
            No credit card required &nbsp;·&nbsp; Built for students &amp; researchers
          </p>
        </div>

        {/* ── App preview mockup ── */}
        <div className="relative max-w-4xl mx-auto mt-20">
          {/* Glow behind */}
          <div
            className="absolute inset-x-20 top-8 h-40 blur-3xl opacity-30 rounded-full pointer-events-none"
            style={{ background: "linear-gradient(90deg, #14b8a6, #6366f1)" }}
          />
          {/* Browser chrome */}
          <div className="relative rounded-2xl border border-white/10 bg-[#161b22] overflow-hidden shadow-2xl shadow-black/60">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#0d1117]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="flex-1 mx-4 px-4 py-1 rounded-md bg-[#21262d] text-slate-500 text-xs text-center">
                learning-ai-assistant.app
              </div>
            </div>

            {/* App layout */}
            <div className="flex h-64 md:h-80">
              {/* Sidebar */}
              <div className="w-52 flex-shrink-0 border-r border-white/8 bg-[#0d1117] p-4 hidden sm:flex flex-col gap-3">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Your Documents</p>
                {["Lecture 01 — Intro to ML", "Research Paper — NLP", "Chapter 4 Notes"].map((d, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${i === 0 ? "bg-teal-500/15 border border-teal-500/30" : "hover:bg-white/5"} transition-colors`}>
                    <span className="text-xs">📄</span>
                    <span className={`text-xs truncate ${i === 0 ? "text-teal-300" : "text-slate-400"}`}>{d}</span>
                  </div>
                ))}
                <button className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/15 hover:border-teal-500/40 transition-colors">
                  <span className="text-slate-500 text-xs">+ Upload PDF</span>
                </button>
              </div>

              {/* Chat area */}
              <div className="flex-1 flex flex-col p-5 gap-3 overflow-hidden">
                {/* AI message */}
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">AI</span>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl rounded-tl-none px-4 py-2.5 text-slate-300 text-xs leading-relaxed max-w-md">
                    I've processed your lecture notes. The document covers supervised learning, gradient descent, and the bias-variance tradeoff. What would you like to explore?
                  </div>
                </div>
                {/* User message */}
                <div className="flex gap-3 items-start justify-end">
                  <div className="bg-teal-500/15 border border-teal-500/25 rounded-xl rounded-tr-none px-4 py-2.5 text-teal-100 text-xs leading-relaxed max-w-sm">
                    Explain the bias-variance tradeoff in simple terms
                  </div>
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300">K</div>
                </div>
                {/* AI typing */}
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">AI</span>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl rounded-tl-none px-4 py-2.5 text-slate-300 text-xs leading-relaxed max-w-md">
                    According to your lecture notes (slide 14): bias is the error from overly simple models, variance is sensitivity to training data fluctuations. The tradeoff means...
                    <span className="inline-block w-1 h-3 bg-teal-400 ml-1 animate-pulse rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to learn faster
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              A focused set of tools built around one idea: your documents, deeply understood.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left — steps */}
              <div className="p-10 border-b md:border-b-0 md:border-r border-white/10">
                <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">How it works</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                  Three steps to understand anything
                </h2>
                <div className="flex flex-col gap-7">
                  {steps.map((s, i) => (
                    <Step key={i} {...s} />
                  ))}
                </div>
              </div>

              {/* Right — visual stack */}
              <div className="p-10 flex flex-col justify-center gap-4">
                {[
                  { emoji: "📖", label: "Introduction to Neural Networks.pdf", size: "2.4 MB", status: "indexed", color: "teal" },
                  { emoji: "🧪", label: "Transformer Architecture Paper.pdf", size: "1.8 MB", status: "indexed", color: "teal" },
                  { emoji: "📝", label: "Week 5 Lecture Notes.pdf", size: "840 KB", status: "processing", color: "amber" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <span className="text-base">{doc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{doc.label}</p>
                      <p className="text-slate-500 text-xs">{doc.size}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.color === "teal"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
                <div className="mt-2 px-4 py-3 rounded-xl bg-teal-500/8 border border-teal-500/20">
                  <p className="text-teal-300 text-xs font-medium mb-1">AI ready to answer</p>
                  <p className="text-slate-500 text-xs">3 documents · 312 chunks indexed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="relative rounded-3xl border border-teal-500/25 overflow-hidden p-12"
            style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(99,102,241,0.08) 100%)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(20,184,166,0.12) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to learn smarter?
              </h2>
              <p className="text-slate-400 mb-8 text-base leading-relaxed">
                Upload your first document and ask your first question in under a minute.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all duration-200 shadow-xl shadow-teal-500/30"
              >
                Get started for free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/8 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-slate-400 text-sm">Learning AI Assistant</span>
          </div>
          <p className="text-slate-600 text-xs">
            Built with React · Vite · Tailwind · Node.js · MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
}