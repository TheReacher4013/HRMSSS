import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "../utils/api";

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = () => {
    if (formData.password.length > 8) return "Strong";
    if (formData.password.length > 5) return "Medium";
    if (formData.password.length > 0) return "Weak";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ name: formData.name, email: formData.email, password: formData.password, role: "user" });
      alert("Registration Successful ✅");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = { Strong: "text-emerald-400", Medium: "text-yellow-400", Weak: "text-red-400" };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f172a] to-black px-4">
      <div className="bg-[#111] border border-gray-800 p-10 rounded-2xl w-full max-w-md shadow-2xl text-white">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-400 mb-6 text-sm">Join us and start your journey 🚀</p>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" onChange={handleChange} required />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" onChange={handleChange} required />
            <div className="absolute right-3 top-3 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {formData.password && (
            <p className={`text-sm ${strengthColor[getPasswordStrength()]}`}>
              Strength: {getPasswordStrength()}
            </p>
          )}

          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" onChange={handleChange} required />

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 py-3 rounded-xl font-bold text-black hover:scale-[1.02] transition duration-200 disabled:opacity-60">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-emerald-400 cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
