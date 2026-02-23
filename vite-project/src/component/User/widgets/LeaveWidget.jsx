// import { useState } from "react";

// const LeaveWidget = () => {
//   const [form, setForm] = useState({
//     from: "",
//     to: "",
//     type: "",
//     reason: "",
//   });

//   const submitLeave = () => {
//     alert("Leave Applied Successfully");
//     setForm({ from: "", to: "", type: "", reason: "" });
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 w-full">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Apply Leave
//         </h2>
//         <span className="text-sm text-gray-500">
//           Leave Request Form
//         </span>
//       </div>

//       {/* Date + Type */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

//         <input
//           type="date"
//           className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//           p-3 rounded-xl outline-none transition"
//         />

//         <input
//           type="date"
//           className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//           p-3 rounded-xl outline-none transition"
//         />

//         <select
//           className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//           p-3 rounded-xl outline-none transition"
//         >
//           <option>Leave Type</option>
//           <option>Casual</option>
//           <option>Sick</option>
//         </select>

//       </div>

//       {/* Reason */}
//       <textarea
//         placeholder="Reason"
//         className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
//         p-3 rounded-xl w-full mb-6 outline-none transition resize-none"
//         rows="4"
//       />

//       {/* Button */}
//       <button
//         onClick={submitLeave}
//         className="bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
//         hover:from-[#145e63] hover:to-[#0f3d3e]
//         text-white px-6 py-3 rounded-xl font-medium
//         shadow-md hover:shadow-lg transition duration-300"
//       >
//         Apply Leave
//       </button>

//     </div>
//   );
// };

// export default LeaveWidget;






import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Path check karein

const LeaveWidget = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    type: "",
    reason: "",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLeave = async () => {
    // Basic Validation
    if (!form.startDate || !form.endDate || !form.type || !form.reason) {
      alert("Please fill all fields");
      return;
    }

    if (!user?._id) return alert("User not found!");

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/leave/apply",
        {
          employeeId: user._id,
          ...form
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(response.data.message || "Leave Applied Successfully");

      // Reset Form
      setForm({ startDate: "", endDate: "", type: "", reason: "" });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Apply Leave</h2>
        <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
          Leave Request Form
        </span>
      </div>

      {/* Date + Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 ml-1">From</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 rounded-xl outline-none transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 ml-1">To</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 rounded-xl outline-none transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 ml-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 rounded-xl outline-none transition bg-white"
          >
            <option value="">Select Type</option>
            <option value="Casual">Casual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Annual">Annual Leave</option>
          </select>
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-1 mb-6">
        <label className="text-xs font-medium text-gray-500 ml-1">Reason for Absence</label>
        <textarea
          name="reason"
          placeholder="Write your reason here..."
          value={form.reason}
          onChange={handleChange}
          className="border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 rounded-xl w-full outline-none transition resize-none"
          rows="4"
        />
      </div>

      {/* Button */}
      <button
        onClick={submitLeave}
        disabled={loading}
        className={`w-full md:w-auto bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
        hover:shadow-lg hover:shadow-emerald-900/20
        text-white px-10 py-3 rounded-xl font-semibold
        transition duration-300 active:scale-95 disabled:opacity-50`}
      >
        {loading ? "Applying..." : "Submit Application"}
      </button>
    </div>
  );
};

export default LeaveWidget;