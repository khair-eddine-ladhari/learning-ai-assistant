import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useContext(GlobalContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-white text-sm tracking-wide" onClick={() => navigate("/")}>
              Learning AI Assistant
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            {loading ? null : user ? (
              <button onClick={logout} className="text-slate-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer">
                Sign out
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="text-slate-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer">
                Sign in
              </button>
            )}

            <button
              onClick={() => navigate("/homepage")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all duration-200 shadow-lg shadow-teal-500/25 cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
