import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Copy, User, Mail, Phone, Lock } from "lucide-react";
import { authAPI } from "../services/api";

const UserRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null); // { employeeId, name }
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", mobile: "", password: "", confirmPassword: ""
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const getStrength = () => {
        const p = formData.password;
        if (p.length > 8 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
        if (p.length > 5) return { label: "Medium", color: "bg-yellow-500", text: "text-yellow-400" };
        if (p.length > 0) return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
        return null;
    };

    const strength = getStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match"); return;
        }
        if (formData.mobile && !/^\d{7,15}$/.test(formData.mobile)) {
            setError("Enter a valid mobile number"); return;
        }
        setLoading(true);
        try {
            const res = await authAPI.register({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                role: "user"
            });
            setSuccess({ employeeId: res.employeeId, name: formData.name });
        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const copyId = () => {
        navigator.clipboard.writeText(success.employeeId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── SUCCESS SCREEN ──
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f172a] to-black px-4">
                <div className="bg-[#111] border border-gray-800 p-10 rounded-2xl w-full max-w-md shadow-2xl text-white text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Account Created! 🎉</h2>
                    <p className="text-gray-400 text-sm mb-8">Welcome, <strong className="text-white">{success.name}</strong></p>

                    <div className="bg-[#1a1a1a] border border-emerald-500/30 rounded-2xl p-6 mb-8">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Your Employee ID</p>
                        <p className="text-3xl font-black text-emerald-400 tracking-widest mb-3">{success.employeeId}</p>
                        <button onClick={copyId}
                            className="flex items-center gap-2 mx-auto text-xs text-gray-400 hover:text-emerald-400 transition">
                            <Copy size={14} />
                            {copied ? "Copied!" : "Copy ID"}
                        </button>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 text-left">
                        <p className="text-amber-400 text-xs font-bold mb-1">⚠️ Save this ID!</p>
                        <p className="text-gray-400 text-xs">Please note down your Employee ID. You may need it for HR purposes.</p>
                    </div>

                    <button onClick={() => navigate("/login")}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition">
                        Go to Login →
                    </button>
                </div>
            </div>
        );
    }

    // ── REGISTRATION FORM ──
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f172a] to-black px-4 py-8">
            <div className="bg-[#111] border border-gray-800 p-10 rounded-2xl w-full max-w-md shadow-2xl text-white">
                <h2 className="text-3xl font-bold mb-1">Create Account</h2>
                <p className="text-gray-400 mb-8 text-sm">Join us and start your journey 🚀</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input type="text" name="name" placeholder="Full Name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input type="email" name="email" placeholder="Email Address" required
                            value={formData.email} onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" />
                    </div>

                    {/* Mobile */}
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input type="tel" name="mobile" placeholder="Contact Number" required
                            value={formData.mobile} onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required
                            value={formData.password} onChange={handleChange}
                            className="w-full pl-9 pr-10 py-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-white">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Password strength */}
                    {strength && (
                        <div className="flex items-center gap-2 ml-1">
                            <div className="flex gap-1">
                                {["Weak", "Medium", "Strong"].map((lvl, i) => (
                                    <div key={lvl} className={`h-1 w-8 rounded-full transition-all ${(strength.label === "Weak" && i === 0) ||
                                            (strength.label === "Medium" && i <= 1) ||
                                            (strength.label === "Strong")
                                            ? strength.color : "bg-gray-700"
                                        }`} />
                                ))}
                            </div>
                            <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" required
                            value={formData.confirmPassword} onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 outline-none transition text-sm" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? "Creating Account..." : "Create Account →"}
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-6 text-center">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="text-emerald-400 cursor-pointer font-bold">Login</span>
                </p>
            </div>
        </div>
    );
};

export default UserRegister;