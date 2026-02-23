import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4f1] to-[#f8fbfa]">

      <Navbar onMenuClick={() => setOpen((p) => !p)} />
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      <main
        className={`pt-20 px-6 pb-6 transition-all duration-300
        ${open ? "lg:ml-[260px]" : "lg:ml-0"}`}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[80vh]">
          <Outlet />
        </div>
      </main>

      <Footer isSidebarOpen={open} />
    </div>
  );
};

export default Layout;