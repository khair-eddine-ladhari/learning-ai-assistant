import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function InputField({ label, type, placeholder, value, onChange, icon }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12px", fontWeight: "500", color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#bbb" }}>
            {icon}
          </span>
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            border: `1px solid ${focused ? "#111" : "#e5e5e5"}`,
            borderRadius: "10px",
            padding: "11px 14px",
            paddingLeft: icon ? "36px" : "14px",
            paddingRight: isPassword ? "52px" : "14px",
            fontSize: "14px",
            color: "#111",
            background: "white",
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "12px", color: "#aaa", cursor: "pointer" }}
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
  const { login } = useContext(GlobalContext);

  const set = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.name.trim()) return setError("Please enter your name.");
  if (form.name.trim().length < 3) return setError("Name must be at least 3 characters.");
  if (form.password !== form.confirm) return setError("Passwords don't match.");
  if (form.password.length < 6) return setError("Password must be at least 6 characters.");
  if (!form.email.includes('@')) return setError("Invalid email.");

  setLoading(true);
  try {
    const res = await axios.post(`${API_URL}/api/auth/register`, form);
    sessionStorage.setItem("token", res.data.token);
    login(res.data);
    navigate("/homepage");
  } catch (err) {
    console.log(err);
    setError(err.response?.data?.message || err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page" style={{ background: "white", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", paddingTop: "76px", paddingBottom: "48px", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media (max-width: 640px) {
          .auth-page { padding: 20px 16px 32px !important; padding-top: 76px !important; }
          .auth-nav { padding: 0 16px !important; }
          .auth-card { padding: 28px 20px !important; }
          .auth-card h1 { font-size: 22px !important; }
        }
      `}</style>

      {/* Subtle grid bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: "linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      {/* Soft blobs */}
      <div style={{ position: "fixed", top: "-120px", left: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,#f0f0f0 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle,#f5f5f5 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Navbar */}
      <nav className="auth-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, height: "52px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", padding: "0 2rem", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M9 13h6M9 17h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#111", letterSpacing: "-0.3px" }}>DocChat</span>
        </div>
      </nav>

      {/* Card area */}
      <div style={{ position: "relative", width: "100%", maxWidth: "420px", animation: "fadeUp 0.6s ease both" }}>

        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", borderRadius: "100px", border: "1px solid #e5e5e5", background: "#fafafa" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "blink 2s infinite" }} />
            <span style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>Get started free</span>
          </div>
        </div>

        {/* Card */}
        <div className="auth-card" style={{ background: "white", border: "1px solid #ebebeb", borderRadius: "20px", padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#0a0a0a", letterSpacing: "-0.8px", marginBottom: "6px" }}>
            Create your workspace
          </h1>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: "28px", lineHeight: "1.5" }}>
            Upload documents. Ask anything. Learn faster.
          </p>

          {error && (
            <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "10px", background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField label="Full Name" type="text" placeholder="Your name" value={form.name} onChange={set("name")} icon="👤" />
            <InputField label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} icon="✉️" />
            <InputField label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={set("password")} icon="🔒" />
            <InputField label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")} icon="🔒" />

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: loading ? "#555" : "#111", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.15s", marginTop: "4px" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "#333"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? "#555" : "#111"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite", width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
            <span style={{ fontSize: "12px", color: "#ccc" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#888" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: "#111", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
            >
              Sign in
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#ccc", marginTop: "16px" }}>
          No credit card required · Your data stays private
        </p>
      </div>
    </div>
  );
}