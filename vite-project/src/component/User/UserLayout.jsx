import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

const UserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#e6f4f1] to-[#f8fbfa]">

      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto
        pt-16 md:pt-0
        p-4 md:p-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default UserLayout;