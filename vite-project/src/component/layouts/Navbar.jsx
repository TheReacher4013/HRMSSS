import { Menu, ChevronDown, LogOut, User, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import con from "../../assets/contact.jpg";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fix: useAuth logout use karo, localStorage.clear() nahi
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md flex items-center justify-between px-4 sm:px-6 z-50">

        <div className="flex items-center gap-4 text-white">
          <Menu
            className="cursor-pointer hover:scale-110 transition"
            size={26}
            onClick={onMenuClick}
          />
          <span className="hidden sm:block text-sm font-semibold opacity-80">HRMS Admin</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer text-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={con}
              alt="admin"
              className="w-9 h-9 rounded-full border-2 border-white shadow"
            />
            <div className="hidden sm:block text-sm">
              <p className="font-medium flex items-center gap-1">
                {user?.name || "Admin"} <ChevronDown size={14} />
              </p>
              <p className="text-xs text-white/80">Administrator</p>
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl overflow-hidden">
              <button
                onClick={() => { setShowProfile(true); setDropdownOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-indigo-50 transition"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition"
            >
              <X />
            </button>

            <div className="flex flex-col items-center mb-6">
              <img src={con} alt="admin" className="w-20 h-20 rounded-full shadow-md border-4 border-indigo-100" />
              <h2 className="mt-3 text-xl font-semibold text-indigo-600">{user?.name || "Admin"}</h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Name</p>
                <p className="font-medium mt-0.5">{user?.name || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Email</p>
                <p className="font-medium mt-0.5">{user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Role</p>
                <p className="font-medium mt-0.5 capitalize">{user?.role || "admin"}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 border border-red-200 text-red-600 py-2 rounded-xl text-sm hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
              <button
                onClick={() => setShowProfile(false)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;