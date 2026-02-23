// const UserHeader = () => {
//   return (
//     <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 rounded-2xl mb-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold text-[#0f3d3e]">
//           User Dashboard
//         </h1>

//         <span className="text-sm text-gray-500">
//           Welcome Back 👋
//         </span>
//       </div>
//     </div>
//   );
// };

// export default UserHeader;





import { useAuth } from "../../context/AuthContext"; // Path check karein

const UserHeader = () => {
  const { user } = useAuth(); // Global state se user data nikalna

  // Current Date format karne ke liye (Optional but looks professional)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('en-US', options);

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-6 rounded-2xl mb-6 border border-white/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        {/* Left Side: Name & Role */}
        <div>
          <h1 className="text-2xl font-bold text-[#0f3d3e] flex items-center gap-2">
            Hello, {user?.name || "User"} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            You are logged in as <span className="text-indigo-600 font-medium capitalize">{user?.role || "Staff"}</span>
          </p>
        </div>

        {/* Right Side: Date & Status */}
        <div className="text-left md:text-right">
          <p className="text-sm font-semibold text-gray-700">{today}</p>
          <div className="flex items-center md:justify-end gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">System Online</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserHeader;