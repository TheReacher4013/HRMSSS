// import { Outlet } from "react-router-dom";
// import UserSidebar from "./UserSidebar";

// const UserLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-[#e6f4f1] to-[#f8fbfa]">

//       <UserSidebar />

//       <div className="flex-1 p-8">
//         <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[85vh]">
//           <Outlet />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default UserLayout;





import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../component/layouts/Sidebar"; // Aapka Sidebar file
import Navbar from "../layouts/Navbar";   // Aapka Navbar file

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e6f4f1] to-[#f8fbfa] overflow-hidden">

      {/* 1. SIDEBAR: Mobile ke liye state pass ki hai */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* 2. NAVBAR: Toggle button handle karne ke liye function pass kiya */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* 3. MAIN CONTENT AREA: Yahan padding-top 16 (h-16 navbar ki wajah se) di hai */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-4 md:p-8 min-h-[calc(100vh-120px)] transition-all">
              {/* Saare Dashboard Widgets (Attendance, Leave etc.) yahan render honge */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>

    </div>
  );
};

export default UserLayout;