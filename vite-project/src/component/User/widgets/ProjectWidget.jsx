// const ProjectWidget = () => {
//   const updateProject = () => {
//     alert("Project Updated Successfully");
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 w-full">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Project Updates
//         </h2>
//         <span className="text-sm text-gray-500">
//           Manage Progress
//         </span>
//       </div>

//       {/* Form Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

//         <select
//           className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//           p-3 rounded-xl outline-none transition"
//         >
//           <option>Select Project</option>
//           <option>CRM</option>
//           <option>HRMS</option>
//         </select>

//         <select
//           className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//           p-3 rounded-xl outline-none transition"
//         >
//           <option>Status</option>
//           <option>In Progress</option>
//           <option>Completed</option>
//         </select>

//         <input
//           type="date"
//           className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//           p-3 rounded-xl outline-none transition"
//         />

//       </div>

//       {/* Work Update */}
//       <textarea
//         placeholder="Work Update"
//         rows="4"
//         className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//         p-3 rounded-xl w-full mb-6 outline-none transition resize-none"
//       />

//       {/* Button */}
//       <button
//         onClick={updateProject}
//         className="bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
//         hover:from-[#145e63] hover:to-[#0f3d3e]
//         text-white px-6 py-3 rounded-xl font-medium
//         shadow-md hover:shadow-lg transition duration-300"
//       >
//         Update Project
//       </button>

//     </div>
//   );
// };

// export default ProjectWidget;




import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Path check karein

const ProjectWidget = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]); // Backend se aane wali list
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    status: "",
    updateDate: "",
    description: ""
  });

  // --- 1. Fetch Projects from Backend ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Projects load nahi ho paye", err);
      }
    };
    if (token) fetchProjects();
  }, [token]);

  // Handle Input Changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- 2. Submit Update to Backend ---
  const updateProject = async () => {
    if (!form.projectId || !form.status || !form.description) {
      alert("Please fill all mandatory fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects/update",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Project Updated Successfully");
      setForm({ projectId: "", status: "", updateDate: "", description: "" }); // Reset
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full border border-gray-100">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Project Updates</h2>
          <p className="text-xs text-gray-400">Track and log progress</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
          Live Tracking
        </span>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

        <select
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
          className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-3 rounded-xl outline-none transition bg-white"
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
          {/* Fallback agar projects na ho */}
          <option value="crm">CRM System</option>
          <option value="hrms">HRMS Portal</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-3 rounded-xl outline-none transition bg-white"
        >
          <option value="">Set Status</option>
          <option value="On Hold">On Hold</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          name="updateDate"
          value={form.updateDate}
          onChange={handleChange}
          className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-3 rounded-xl outline-none transition"
        />

      </div>

      {/* Work Update */}
      <div className="space-y-1 mb-6">
        <label className="text-xs font-semibold text-gray-400 ml-1 uppercase">Work Summary</label>
        <textarea
          name="description"
          placeholder="What tasks were completed today?"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-3 rounded-xl w-full outline-none transition resize-none"
        />
      </div>

      {/* Button */}
      <button
        onClick={updateProject}
        disabled={loading}
        className="w-full md:w-auto bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
        hover:shadow-lg hover:shadow-emerald-900/30
        text-white px-8 py-3 rounded-xl font-semibold
        transition duration-300 active:scale-95 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Push Update"}
      </button>

    </div>
  );
};

export default ProjectWidget;