import { useState } from "react";

const LeaveWidget = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    type: "",
    reason: "",
  });

  const submitLeave = () => {
    alert("Leave Applied Successfully");
    setForm({ from: "", to: "", type: "", reason: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Apply Leave
        </h2>
        <span className="text-sm text-gray-500">
          Leave Request Form
        </span>
      </div>

      {/* Date + Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

        <input
          type="date"
          className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
          p-3 rounded-xl outline-none transition"
        />

        <input
          type="date"
          className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
          p-3 rounded-xl outline-none transition"
        />

        <select
          className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
          p-3 rounded-xl outline-none transition"
        >
          <option>Leave Type</option>
          <option>Casual</option>
          <option>Sick</option>
        </select>

      </div>

      {/* Reason */}
      <textarea
        placeholder="Reason"
        className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100
        p-3 rounded-xl w-full mb-6 outline-none transition resize-none"
        rows="4"
      />

      {/* Button */}
      <button
        onClick={submitLeave}
        className="bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
        hover:from-[#145e63] hover:to-[#0f3d3e]
        text-white px-6 py-3 rounded-xl font-medium
        shadow-md hover:shadow-lg transition duration-300"
      >
        Apply Leave
      </button>

    </div>
  );
};

export default LeaveWidget;