// import { Menu, Trash2, ChevronDown, LogOut, User, X } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import con from "../../assets/contact.jpg";

// const Navbar = ({ onMenuClick }) => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const dropdownRef = useRef(null);

//   /* Close dropdown outside click */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* Logout */
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md flex items-center justify-between px-4 sm:px-6 z-50">

//         {/* LEFT SECTION */}
//         <div className="flex items-center gap-4 text-white">
//           <Menu
//             className="cursor-pointer hover:scale-110 transition"
//             size={26}
//             onClick={onMenuClick}
//           />

//           <button className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition">
//             <Trash2 size={16} />
//             Cache Clear
//           </button>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="relative" ref={dropdownRef}>
//           <div
//             className="flex items-center gap-3 cursor-pointer text-white"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             <img
//               src={con}
//               alt="admin"
//               className="w-9 h-9 rounded-full border-2 border-white shadow"
//             />
//             <div className="hidden sm:block text-sm">
//               <p className="font-medium flex items-center gap-1">
//                 Admin <ChevronDown size={14} />
//               </p>
//               <p className="text-xs text-white/80">Administrator</p>
//             </div>
//           </div>

//           {/* DROPDOWN */}
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">
//               <button
//                 onClick={() => {
//                   setShowProfile(true);
//                   setDropdownOpen(false);
//                 }}
//                 className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-indigo-50 transition"
//               >
//                 <User size={16} /> Profile
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
//               >
//                 <LogOut size={16} /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* PROFILE MODAL */}
//       {showProfile && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-scaleIn">

//             <button
//               onClick={() => setShowProfile(false)}
//               className="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition"
//             >
//               <X />
//             </button>

//             <div className="flex flex-col items-center mb-6">
//               <img
//                 src={con}
//                 alt="admin"
//                 className="w-20 h-20 rounded-full shadow-md border-4 border-indigo-100"
//               />
//               <h2 className="mt-3 text-xl font-semibold text-indigo-600">
//                 Admin Profile
//               </h2>
//               <p className="text-sm text-gray-500">Administrator</p>
//             </div>

//             <div className="space-y-4 text-sm">
//               <div>
//                 <p className="text-gray-500">Email</p>
//                 <p className="font-medium">admin@gmail.com</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Password</p>
//                 <p className="font-medium">********</p>
//               </div>

//               <button className="text-indigo-600 text-sm hover:underline">
//                 Forgot Password?
//               </button>
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={() => setShowProfile(false)}
//                 className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
//               >
//                 Close
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;





import { Menu, Trash2, ChevronDown, LogOut, User, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Apna sahi path check karein
import con from "../../assets/contact.jpg";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Context se data nikalna
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

  const handleLogoutClick = () => {
    logout(); // Context wala logout call karein
    navigate("/login");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md flex items-center justify-between px-4 sm:px-6 z-50">
        <div className="flex items-center gap-4 text-white">
          <Menu className="cursor-pointer hover:scale-110 transition" size={26} onClick={onMenuClick} />
          <h1 className="font-bold text-lg hidden md:block">HRM Portal</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-3 cursor-pointer text-white" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={con} alt="user" className="w-9 h-9 rounded-full border-2 border-white" />
            <div className="hidden sm:block text-sm">
              <p className="font-medium flex items-center gap-1">
                {user?.name || "User"} <ChevronDown size={14} />
              </p>
              <p className="text-xs text-white/80 capitalize">{user?.role || "Staff"}</p>
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl overflow-hidden">
              <button onClick={() => { setShowProfile(true); setDropdownOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-indigo-50 transition">
                <User size={16} /> Profile
              </button>
              <button onClick={handleLogoutClick} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
            <button onClick={() => setShowProfile(false)} className="absolute right-4 top-4 text-gray-500 hover:text-red-500"><X /></button>
            <div className="flex flex-col items-center mb-6">
              <img src={con} className="w-20 h-20 rounded-full border-4 border-indigo-100" alt="profile" />
              <h2 className="mt-3 text-xl font-semibold text-indigo-600">{user?.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => setShowProfile(false)} className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-xl">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;