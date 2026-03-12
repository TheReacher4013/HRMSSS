import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, Copy, Check, ArrowLeft, KeyRound } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginType, setLoginType] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // forgot password
  const [view, setView] = useState("login");
  const [fpEmail, setFpEmail] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, role: loginType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid email or password");
      localStorage.setItem("token", data.token);
      login(data.user.role, data.user);
      navigate(data.user.role === "admin" ? "/dashboard" : "/user/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!fpEmail.trim()) { setFpError("Email is required."); return; }
    setFpLoading(true);
    setFpError("");
    try {
      const res = await fetch(`${BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setNewPassword(data.newPassword);
      setView("result");
    } catch (e) {
      setFpError(e.message);
    } finally {
      setFpLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(newPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const useNewPassword = () => {
    setPassword(newPassword);
    setEmail(fpEmail);
    setView("login");
  };

  const inp = "w-full bg-[#161616] border border-white/5 px-4 py-4 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-gray-700";

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[1000px] min-h-[600px] bg-[#111] rounded-none sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">

        {/* Left panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0f2e2e] via-[#0a1a1a] to-[#050505] p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {view === "forgot" || view === "result" ? <>Reset<br />Password</> : <>Get Started<br />with Us</>}
            </h1>
            <p className="text-gray-400 text-sm max-w-[250px]">
              {view === "result"
                ? "Password reset. Copy and use it to log in."
                : view === "forgot"
                  ? "Enter your email to get a new password instantly."
                  : "Access your HRMS workspace securely."}
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 bg-[#0d0d0d] p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-[360px] mx-auto w-full">

            {/* ── FORGOT EMAIL ── */}
            {view === "forgot" && (
              <>
                <button onClick={() => setView("login")} className="flex items-center gap-1.5 text-gray-500 text-xs mb-8 hover:text-white transition">
                  <ArrowLeft size={13} /> Back to login
                </button>
                <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
                <p className="text-gray-500 text-xs mb-8">Enter your email — a new password will appear here instantly.</p>
                <form onSubmit={handleForgot} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Email Address</label>
                    <input type="email" placeholder="name@example.com" value={fpEmail}
                      onChange={e => setFpEmail(e.target.value)} className={inp} required />
                  </div>
                  {fpError && <p className="text-red-400 text-xs font-bold px-1">{fpError}</p>}
                  <button type="submit" disabled={fpLoading}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest disabled:opacity-60 flex items-center justify-center gap-2">
                    {fpLoading ? <><Loader2 size={14} className="animate-spin" />Resetting…</> : "Reset My Password"}
                  </button>
                </form>
              </>
            )}

            {/* ── FORGOT RESULT ── */}
            {view === "result" && (
              <>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <KeyRound className="text-emerald-400" size={22} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Password Reset!</h2>
                <p className="text-gray-500 text-xs mb-6">Your new password is below. Copy it and log in.</p>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 mb-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</p>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-mono text-xl font-black tracking-[4px] flex-1">{newPassword}</p>
                    <button onClick={copyPassword}
                      className={`p-2.5 rounded-xl transition-all ${copied ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copied && <p className="text-emerald-400 text-[10px] font-bold mt-2">✓ Copied!</p>}
                </div>
                <button onClick={useNewPassword}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest">
                  Use This Password to Login
                </button>
                <button onClick={() => setView("login")} className="w-full text-gray-600 text-xs mt-3 hover:text-white transition py-2">
                  Go to Login →
                </button>
              </>
            )}

            {/* ── LOGIN ── */}
            {view === "login" && (
              <>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Login Account</h2>
                <p className="text-gray-500 text-xs mb-8">Select your role and enter credentials.</p>

                <div className="flex bg-[#1a1a1a] p-1.5 rounded-2xl mb-8 border border-white/5">
                  {["admin", "user"].map(r => (
                    <button key={r} type="button" onClick={() => { setLoginType(r); setError(""); }}
                      className={`flex-1 py-3 text-[11px] font-extrabold rounded-xl transition-all tracking-widest uppercase ${loginType === r ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-gray-300"}`}>
                      {r}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Email Address</label>
                    <input type="email" placeholder="name@example.com" value={email}
                      onChange={e => setEmail(e.target.value)} className={inp} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                        onChange={e => setPassword(e.target.value)} className={`${inp} pr-12`} required />
                      <button type="button" onClick={() => setShowPw(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-bold">
                      {error}
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl mt-2 hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={14} className="animate-spin" />Signing in…</> : "Login to Dashboard"}
                  </button>
                </form>

                {loginType === "user" && (
                  <p className="text-gray-400 text-xs mt-6 text-center">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")} className="text-emerald-400 cursor-pointer font-bold">Register Here</span>
                  </p>
                )}

                <div className="mt-6 flex justify-between items-center px-1">
                  <button onClick={() => { setFpEmail(""); setFpError(""); setView("forgot"); }}
                    className="text-[10px] text-gray-600 hover:text-emerald-400 transition font-bold">
                    Forgot Password?
                  </button>
                  <span className="text-[10px] text-gray-700 font-bold">HRMS v2.0</span>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;