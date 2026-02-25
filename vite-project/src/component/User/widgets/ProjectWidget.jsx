const ProjectWidget = () => {
  const updateProject = () => {
    alert("Project Updated Successfully");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Project Updates
        </h2>
        <span className="text-sm text-gray-500">
          Manage Progress
        </span>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

        <select
          className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
          p-3 rounded-xl outline-none transition"
        >
          <option>Select Project</option>
          <option>CRM</option>
          <option>HRMS</option>
        </select>

        <select
          className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
          p-3 rounded-xl outline-none transition"
        >
          <option>Status</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input
          type="date"
          className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
          p-3 rounded-xl outline-none transition"
        />

      </div>

      {/* Work Update */}
      <textarea
        placeholder="Work Update"
        rows="4"
        className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
        p-3 rounded-xl w-full mb-6 outline-none transition resize-none"
      />

      {/* Button */}
      <button
        onClick={updateProject}
        className="bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
        hover:from-[#145e63] hover:to-[#0f3d3e]
        text-white px-6 py-3 rounded-xl font-medium
        shadow-md hover:shadow-lg transition duration-300"
      >
        Update Project
      </button>

    </div>
  );
};

export default ProjectWidget;