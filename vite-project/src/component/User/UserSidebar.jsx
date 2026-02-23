// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; // path check kar lena

// const UserSidebar = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();   // ✅ context logout

//   const handleLogout = () => {
//     logout();                     // ✅ state + localStorage dono clear karega
//     navigate("/login");           // direct login page bhejo
//   };

//   const linkClass = ({ isActive }) =>
//     `block px-4 py-2 rounded-lg transition duration-200 ${isActive
//       ? "bg-white text-[#0f3d3e] font-medium"
//       : "text-gray-300 hover:bg-white/10 hover:text-white"
//     }`;

//   return (
//     <aside className="w-64 bg-gradient-to-b from-[#0f3d3e] to-[#062b2c] text-white shadow-2xl min-h-screen p-6">

//       <h2 className="text-2xl font-bold mb-8 text-center tracking-wide">
//         User Panel
//       </h2>

//       <nav className="space-y-3">
//         <NavLink to="/user/dashboard" className={linkClass}>
//           Dashboard
//         </NavLink>

//         <NavLink to="/user/attendance" className={linkClass}>
//           Attendance
//         </NavLink>

//         <NavLink to="/user/leaves" className={linkClass}>
//           Leaves
//         </NavLink>

//         <NavLink to="/user/projects" className={linkClass}>
//           Projects
//         </NavLink>
//       </nav>

//       <button
//         onClick={handleLogout}
//         className="mt-10 w-full bg-red-500 hover:bg-red-600
//         text-white py-2 rounded-lg transition duration-300"
//       >
//         Logout
//       </button>

//     </aside>
//   );
// };

// export default UserSidebar;



import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  FolderKanban,
  LogOut
} from "lucide-react"; // Icons add kiye hain professional look ke liye

const UserSidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Context se user info bhi le li

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
      ? "bg-white text-[#0f3d3e] font-bold shadow-lg transform scale-105"
      : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-[#0f3d3e] to-[#062b2c] text-white shadow-2xl min-h-screen p-6 sticky top-0">

      {/* Brand Logo/Name */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tighter text-white">
          BIZZFLY
        </h2>
        <div className="h-1 w-12 bg-emerald-400 mx-auto mt-1 rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        <p className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold mb-2 ml-2">Main Menu</p>

        <NavLink to="/user/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/user/attendance" className={linkClass}>
          <UserCheck size={20} />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/user/leaves" className={linkClass}>
          <CalendarDays size={20} />
          <span>My Leaves</span>
        </NavLink>

        <NavLink to="/user/projects" className={linkClass}>
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
      </nav>

      {/* Footer Info & Logout */}
      <div className="mt-auto border-t border-white/10 pt-6">
        <div className="bg-white/5 p-4 rounded-2xl mb-4">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-medium truncate">{user?.email || "Employee"}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500 
          text-red-500 hover:text-white py-3 rounded-xl transition-all duration-300 font-semibold group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default UserSidebar;