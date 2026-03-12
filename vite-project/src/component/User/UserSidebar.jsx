import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Wallet, Gift, Video, LayoutDashboard, Clock, Calendar, Briefcase, Bell, Trophy, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const close = () => setOpen(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${isActive
      ? "bg-white text-[#0f2e2e] font-bold shadow-sm"
      : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  const links = [
    { to: "/user/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { to: "/user/attendance", label: "Attendance", icon: <Clock size={16} /> },
    { to: "/user/leaves", label: "Leaves", icon: <Calendar size={16} /> },
    { to: "/user/projects", label: "Projects", icon: <Briefcase size={16} /> },
    { to: "/user/notice", label: "Notice", icon: <Bell size={16} /> },
    { to: "/user/achivement", label: "Achievement", icon: <Trophy size={16} /> },
    { to: "/user/calendar", label: "Calendar", icon: <Calendar size={16} /> },
    { to: "/user/meeting", label: "Meeting", icon: <Video size={16} /> },
    { to: "/user/holidays", label: "Holidays", icon: <Gift size={16} /> },
    { to: "/user/loans", label: "My Loans", icon: <Wallet size={16} /> },
  ];

  return (
    <>
      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-[#0f2e2e] text-white px-4 py-3 shadow-lg">
        <button onClick={() => setOpen(true)}><Menu size={26} /></button>
        <h1 className="font-bold text-lg tracking-wide">User Panel</h1>
      </header>

      {/* Overlay */}
      {open && <div onClick={close} className="fixed inset-0 bg-black/40 z-30 md:hidden" />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen flex flex-col
        bg-gradient-to-b from-[#0f2e2e] to-[#062b2c]
        text-white shadow-2xl px-4 py-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-black tracking-tight">User Panel</h2>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={close}>
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={close}>
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 border border-red-500/30 text-red-300 hover:text-white py-2.5 rounded-xl transition-all duration-200 text-sm font-bold"
        >
          <LogOut size={15} /> Logout
        </button>
      </aside>

      {/* Mobile spacer */}
      <div className="h-14 md:hidden" />
    </>
  );
};

export default UserSidebar;