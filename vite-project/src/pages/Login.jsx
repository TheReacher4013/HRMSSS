import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginType, setLoginType] = useState("admin");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password, role: loginType });
      login(data.user.role, data.user, data.token);
      navigate(data.user.role === "admin" ? "/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[1000px] min-h-[600px] bg-[#111] rounded-none sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">

        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0f2e2e] via-[#0a1a1a] to-[#050505] p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Get Started <br /> with Us
            </h1>
            <p className="text-gray-400 text-sm max-w-[250px] mb-12">
              Complete these easy steps to register and access your workspace.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-[#0d0d0d] p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-[360px] mx-auto w-full">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Login Account</h2>
            <p className="text-gray-500 text-xs mb-10">Select your role and enter credentials.</p>

            {/* Role Switcher */}
            <div className="flex bg-[#1a1a1a] p-1.5 rounded-2xl mb-8 border border-white/5">
              {["admin", "user"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setLoginType(role)}
                  className={`flex-1 py-3 text-[11px] font-extrabold rounded-xl transition-all tracking-widest uppercase ${
                    loginType === role ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-[#161616] border border-white/5 px-4 py-4 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#161616] border border-white/5 px-4 py-4 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black py-4 rounded-2xl mt-4 hover:bg-emerald-400 transition-all active:scale-[0.97] text-xs uppercase tracking-widest shadow-lg shadow-white/5 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            {loginType === "user" && (
              <p className="text-gray-400 text-xs mt-6 text-center">
                Don't have an account?{" "}
                <span onClick={() => navigate("/register")} className="text-emerald-400 cursor-pointer font-bold">
                  Register Here
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
