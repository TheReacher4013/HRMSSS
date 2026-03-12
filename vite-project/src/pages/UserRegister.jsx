import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const UserRegister = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const strength = () => {
        const l = form.password.length;
        if (l > 8) return { label: "Strong", color: "text-emerald-400", w: "w-full", bg: "bg-emerald-500" };
        if (l > 5) return { label: "Medium", color: "text-yellow-400", w: "w-2/3", bg: "bg-yellow-400" };
        if (l > 0) return { label: "Weak", color: "text-red-400", w: "w-1/3", bg: "bg-red-500" };
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
        if (form.password.length < 6) { setError("Password must be at least 6 chars."); return; }
        setLoading(true);
        try {
            const res = await fetch(`${BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, role: "user" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed.");
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const s = strength();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f172a] to-black px-4">
            <div className="bg-[#111] border border-gray-800 p-10 rounded-[2rem] w-full max-w-md shadow-2xl text-white">
                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-1">Create Account</h2>
                    <p className="text-gray-500 text-sm">Register and access your workspace</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-emerald-400" size={36} />
                        </div>
                        <h3 className="text-xl font-black text-emerald-400">Registration Successful!</h3>
                        <p className="text-gray-400 text-sm">Redirecting to login…</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold">
                                <AlertCircle size={14} />{error}
                            </div>
                        )}
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-1.5">Full Name</label>
                            <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required
                                className="w-full p-3.5 rounded-2xl bg-[#1a1a1a] border border-gray-800 focus:border-emerald-500/60 outline-none transition text-sm placeholder:text-gray-700" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-1.5">Email Address</label>
                            <input type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required
                                className="w-full p-3.5 rounded-2xl bg-[#1a1a1a] border border-gray-800 focus:border-emerald-500/60 outline-none transition text-sm placeholder:text-gray-700" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPw ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required
                                    className="w-full p-3.5 rounded-2xl bg-[#1a1a1a] border border-gray-800 focus:border-emerald-500/60 outline-none transition text-sm placeholder:text-gray-700 pr-12" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {s && (
                                <div className="mt-2">
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${s.w} ${s.bg}`} />
                                    </div>
                                    <p className={`text-[10px] font-bold mt-1 ${s.color}`}>Strength: {s.label}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-1.5">Confirm Password</label>
                            <input type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required
                                className={`w-full p-3.5 rounded-2xl bg-[#1a1a1a] border outline-none transition text-sm placeholder:text-gray-700
                                    ${form.confirm && form.confirm !== form.password ? "border-red-500/50" : "border-gray-800 focus:border-emerald-500/60"}`} />
                            {form.confirm && form.confirm !== form.password && (
                                <p className="text-[10px] text-red-400 font-bold mt-1">Passwords don't match</p>
                            )}
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-white text-black font-black py-4 rounded-2xl mt-2 hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading ? <><Loader2 size={15} className="animate-spin" />Creating Account…</> : "Create Account"}
                        </button>
                    </form>
                )}

                {!success && (
                    <p className="text-gray-600 text-xs mt-6 text-center">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")} className="text-emerald-400 cursor-pointer hover:underline font-bold">Login Here</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserRegister;