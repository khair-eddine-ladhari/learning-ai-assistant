import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
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
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
  );
}

function InputField({ label, type, placeholder, value, onChange, icon }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{icon}</span>
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-teal-500/60 focus:bg-white/8 transition-all duration-200"
          style={{ paddingLeft: icon ? "2.5rem" : undefined, paddingRight: isPassword ? "2.75rem" : undefined }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const set = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (!form.name.trim()) return setError("Please enter your name.");
  if (form.password !== form.confirm) return setError("Passwords don't match.");
  if (form.password.length < 6) return setError("Password must be at least 6 characters.");

  setLoading(true);
  try {
    console.log(API_URL);
    const res = await axios.post(`${API_URL}/api/auth/register`, form);
    sessionStorage.setItem("token", res.data.token);
    navigate("/homepage");
  }catch (err) {
  console.log(err); // full error object
  console.log(err.response); // backend response
  setError(err.response?.data?.message || err.message || "Something went wrong.");
}finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white overflow-x-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <ParticleCanvas />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-white font-semibold text-base">Learning AI Assistant</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-x-8 -top-4 h-20 blur-3xl opacity-20 rounded-full pointer-events-none"
          style={{ background: "linear-gradient(90deg, #14b8a6, #6366f1)" }} />

        <div className="relative rounded-2xl border border-white/10 bg-[#161b22] overflow-hidden shadow-2xl shadow-black/60 p-8">
          {/* Badge + heading */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-300 text-xs font-medium tracking-wide uppercase">Get started free</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create your workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Upload documents. Ask anything. Learn faster.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField label="Full Name" type="text" placeholder="Your name" value={form.name} onChange={set("name")} icon="👤" />
            <InputField label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} icon="✉️" />
            <InputField label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={set("password")} icon="🔒" />
            <InputField label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")} icon="🔒" />

            <button
              type="submit"
              disabled={loading}
              className="group mt-1 w-full px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all duration-200 shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Sign in
            </button>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-5">
          No credit card required · Your data stays private
        </p>
      </div>
    </div>
  );
}