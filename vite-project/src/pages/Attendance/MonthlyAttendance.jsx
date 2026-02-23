// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// const MonthlyAttendance = () => {
//   const [formData, setFormData] = useState({
//     employee: "",
//     year: "",
//     month: "",
//     fromDate: "",
//     toDate: "",
//     reason: "",
//   });

//   const location = useLocation();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Monthly Attendance Submitted");
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* Page Heading */}
//         <div>
//           <h1 className="text-2xl font-bold text-indigo-700 text-center sm:text-left">
//             Attendance Management
//           </h1>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-col sm:flex-row gap-2">
//           <Tab label="Attendance Form" to="/attendance/form" active={location.pathname === "/attendance/form"} />
//           <Tab label="Monthly Attendance" to="/attendance/monthly" active={location.pathname === "/attendance/monthly"} />
//           <Tab label="Missing Attendance" to="/attendance/missing" active={location.pathname === "/attendance/missing"} />
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
//           <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
//             <h2 className="text-white text-md font-semibold text-center sm:text-left">
//               Monthly Attendance Report
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4">
//             {/* Grid Layout for Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label className="text-xs font-medium mb-1 text-slate-600">Employee *</label>
//                 <select name="employee" value={formData.employee} onChange={handleChange} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none" required>
//                   <option value="">Select employee</option>
//                   <option value="emp1">Employee 1</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 <div className="flex flex-col">
//                   <label className="text-xs font-medium mb-1 text-slate-600">Year *</label>
//                   <select name="year" value={formData.year} onChange={handleChange} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none" required>
//                     <option value="">Year</option>
//                     <option value="2026">2026</option>
//                   </select>
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-xs font-medium mb-1 text-slate-600">Month *</label>
//                   <select name="month" value={formData.month} onChange={handleChange} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none" required>
//                     <option value="">Month</option>
//                     <option value="Jan">January</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label className="text-xs font-medium mb-1 text-slate-600">From Date *</label>
//                 <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none" required />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-xs font-medium mb-1 text-slate-600">To Date *</label>
//                 <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none" required />
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <label className="text-xs font-medium mb-1 text-slate-600">Reason *</label>
//               <textarea name="reason" value={formData.reason} onChange={handleChange} rows="2" className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none" required />
//             </div>

//             {/* Compact Submit Button */}
//             <div className="flex pt-2">
//               <button
//                 type="submit"
//                 className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition w-full sm:w-auto sm:ml-auto shadow-sm"
//               >
//                 Submit Monthly Report
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Tab = ({ label, to, active }) => (
//   <Link to={to} className={`text-center px-4 py-2 rounded-xl text-xs font-medium transition w-full sm:w-auto ${active ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50"}`}>
//     {label}
//   </Link>
// );

// export default MonthlyAttendance;





import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Calendar, FileText, Loader2, Download } from "lucide-react";

const MonthlyAttendance = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    year: "2026",
    month: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const location = useLocation();

  // --- 1. Load Employees for Selection ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };
    if (token) fetchEmployees();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. Handle Report Generation/Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/attendance/monthly-report", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Monthly Report Request Submitted Successfully");
      setFormData({ ...formData, reason: "", employee: "" });
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Submission failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-700">Attendance Management</h1>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-100">
            <Download size={14} /> Export All Reports
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Tab label="Attendance Form" to="/attendance/form" active={location.pathname === "/attendance/form"} />
          <Tab label="Monthly Attendance" to="/attendance/monthly" active={location.pathname === "/attendance/monthly"} />
          <Tab label="Missing Attendance" to="/attendance/missing" active={location.pathname === "/attendance/missing"} />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border-none overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">Monthly Report Generation</h2>
              <p className="text-indigo-100 text-xs">Request or log bulk attendance data</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col">
                <label className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">Employee Selection</label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  className="border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  required
                >
                  <option value="">Choose an employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">Year</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm bg-slate-50 outline-none focus:border-indigo-400">
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">Month</label>
                  <select name="month" value={formData.month} onChange={handleChange} className="border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm bg-slate-50 outline-none focus:border-indigo-400" required>
                    <option value="">Month</option>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">Period From</label>
                <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm bg-slate-50 outline-none focus:border-indigo-400" required />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">Period To</label>
                <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} className="border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm bg-slate-50 outline-none focus:border-indigo-400" required />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">Remarks / Reason</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Additional notes for HR..." className="border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm bg-slate-50 outline-none focus:border-indigo-400 resize-none" required />
            </div>

            <div className="flex pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all w-full sm:w-auto sm:ml-auto shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><FileText size={18} /> Process Report</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Tab = ({ label, to, active }) => (
  <Link to={to} className={`text-center px-6 py-3 rounded-2xl text-xs font-bold transition-all w-full sm:w-auto border-2 ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-white text-slate-400 border-transparent hover:border-indigo-100 hover:text-indigo-500"}`}>
    {label}
  </Link>
);

export default MonthlyAttendance;