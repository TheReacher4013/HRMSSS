const UserHeader = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 rounded-2xl mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#0f3d3e]">
          User Dashboard
        </h1>

        <span className="text-sm text-gray-500">
          Welcome Back 👋
        </span>
      </div>
    </div>
  );
};

export default UserHeader;