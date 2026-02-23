// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Plus, CheckCircle, AlertCircle } from "lucide-react";

// const AttendanceForm = () => {
//   const [employee, setEmployee] = useState("");
//   const [dateTime, setDateTime] = useState("");
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const location = useLocation();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!employee || !dateTime) {
//       setMessage({ text: "Please fill all required fields", type: "error" });
//       return;
//     }
//     console.log({ employee, dateTime });
//     setMessage({ text: "Attendance Submitted Successfully!", type: "success" });
//     setEmployee("");
//     setDateTime("");
//     setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8 w-full">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* Page Heading */}
//         <div className="text-center sm:text-left">
//           <h1 className="text-2xl font-bold text-indigo-700">Attendance Management</h1>
//           <p className="text-slate-500 text-sm mt-1">Manage daily and missing records</p>
//         </div>

//         {/* Tabs - Stacked on Mobile */}
//         <div className="flex flex-col sm:flex-row gap-2">
//           <TabLink
//             label="Attendance Form"
//             to="/attendance/form"
//             active={location.pathname === "/attendance/form"}
//           />
//           <TabLink
//             label="Monthly Attendance"
//             to="/attendance/monthly"
//             active={location.pathname === "/attendance/monthly"}
//           />
//           <TabLink
//             label="Missing Attendance"
//             to="/attendance/missing"
//             active={location.pathname === "/attendance/missing"}
//           />
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//           {/* Indigo Header */}
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 bg-indigo-600 text-white">
//             <h2 className="text-lg font-semibold">Take Attendance</h2>
//             <button
//               type="button"
//               className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto"
//             >
//               <Plus size={16} /> Bulk Insert
//             </button>
//           </div>

//           {/* Alert Message */}
//           {message.text && (
//             <div className={`m-5 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
//               }`}>
//               {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
//               {message.text}
//             </div>
//           )}

//           {/* Form Content */}
//           <form onSubmit={handleSubmit} className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col">
//               <label className="text-sm font-bold mb-2 text-slate-600">Employee *</label>
//               <select
//                 value={employee}
//                 onChange={(e) => setEmployee(e.target.value)}
//                 className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
//               >
//                 <option value="">Select employee</option>
//                 <option value="1">John Doe</option>
//                 <option value="2">Jane Smith</option>
//               </select>
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-bold mb-2 text-slate-600">Date & Time *</label>
//               <input
//                 type="datetime-local"
//                 value={dateTime}
//                 onChange={(e) => setDateTime(e.target.value)}
//                 className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
//               />
//             </div>

//             <div className="md:col-span-2 flex pt-2">
//               <button
//                 type="submit"
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all w-full sm:w-auto sm:ml-auto active:scale-95"
//               >
//                 Submit Attendance
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Internal Tab Component - Defined outside or inside doesn't matter as long as it's not accessed before initialization
// const TabLink = ({ label, to, active }) => (
//   <Link
//     to={to}
//     className={`text-center px-6 py-3 rounded-xl text-sm font-bold transition-all w-full sm:w-auto border
//       ${active
//         ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
//         : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
//       }`}
//   >
//     {label}
//   </Link>
// );

// export default AttendanceForm;







import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Plus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Path check karein

const AttendanceForm = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]); // Real employee list
  const [employeeId, setEmployeeId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const location = useLocation();

  // --- 1. Fetch Employees for Dropdown ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Employee list load nahi ho saki", err);
      }
    };
    if (token) fetchEmployees();
  }, [token]);

  // --- 2. Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !dateTime) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/attendance/manual",
        { userId: employeeId, timestamp: dateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ text: "Attendance Submitted Successfully!", type: "success" });
      setEmployeeId("");
      setDateTime("");
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to submit attendance",
        type: "error"
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Heading */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-indigo-700">Attendance Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage daily and missing records</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2">
          <TabLink label="Attendance Form" to="/attendance/form" active={location.pathname === "/attendance/form"} />
          <TabLink label="Monthly Attendance" to="/attendance/monthly" active={location.pathname === "/attendance/monthly"} />
          <TabLink label="Missing Attendance" to="/attendance/missing" active={location.pathname === "/attendance/missing"} />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 bg-indigo-600 text-white">
            <h2 className="text-lg font-semibold">Take Attendance</h2>
            <button type="button" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto">
              <Plus size={16} /> Bulk Insert
            </button>
          </div>

          {message.text && (
            <div className={`m-5 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
              {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2 text-slate-600">Employee *</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 transition-all"
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2 text-slate-600">Date & Time *</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              />
            </div>

            <div className="md:col-span-2 flex pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-10 py-3 rounded-xl font-bold shadow-lg transition-all w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Attendance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TabLink = ({ label, to, active }) => (
  <Link to={to} className={`text-center px-6 py-3 rounded-xl text-sm font-bold transition-all w-full sm:w-auto border ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
    }`}>
    {label}
  </Link>
);

export default AttendanceForm;