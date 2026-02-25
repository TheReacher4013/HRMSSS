import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition duration-200 ${isActive
      ? "bg-white text-[#0f3d3e] font-medium"
      : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* ===== Top Header (Mobile) ===== */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40
        flex items-center gap-3
        bg-[#0f3d3e] text-white px-4 py-3 shadow-lg"
      >
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>

        <h1 className="font-semibold text-lg tracking-wide">
          User Panel
        </h1>
      </header>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50
        w-64 h-screen p-6
        bg-gradient-to-b from-[#0f3d3e] to-[#062b2c]
        text-white shadow-2xl
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">User Panel</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <NavLink to="/user/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/user/attendance" className={linkClass} onClick={() => setOpen(false)}>Attendance</NavLink>
          <NavLink to="/user/leaves" className={linkClass} onClick={() => setOpen(false)}>Leaves</NavLink>
          <NavLink to="/user/projects" className={linkClass} onClick={() => setOpen(false)}>Projects</NavLink>
          <NavLink to="/user/notice" className={linkClass} onClick={() => setOpen(false)}>Notice</NavLink>
          <NavLink to="/user/achivement" className={linkClass} onClick={() => setOpen(false)}>Achievement</NavLink>
          <NavLink to="/user/calendar" className={linkClass} onClick={() => setOpen(false)}>Calendar</NavLink>
          <NavLink to="/user/meeting" className={linkClass} onClick={() => setOpen(false)}>Meeting</NavLink>
          <NavLink to="/user/salary" className={linkClass} onClick={() => setOpen(false)}>My Salary</NavLink>
          {/* <NavLink to="/user/meeting" className={linkClass} onClick={()=> setOpen(false)}>MeetingAttendees</NavLink> */}

        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600
          text-white py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </aside>

      {/* Spacer for mobile header */}
      <div className="h-14 md:hidden" />
    </>
  );
};

export default UserSidebar;