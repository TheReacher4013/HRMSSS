import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, CheckCircle, AlertCircle } from "lucide-react";

const AttendanceForm = () => {
  const [employee, setEmployee] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employee || !dateTime) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      return;
    }
    console.log({ employee, dateTime });
    setMessage({ text: "Attendance Submitted Successfully!", type: "success" });
    setEmployee("");
    setDateTime("");
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-6xl mx-auto space-y-6">

        
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-indigo-700">Attendance Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage daily and missing records</p>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-2">
          <TabLink
            label="Attendance Form"
            to="/attendance/form"
            active={location.pathname === "/attendance/form"}
          />
          <TabLink
            label="Monthly Attendance"
            to="/attendance/monthly"
            active={location.pathname === "/attendance/monthly"}
          />
          <TabLink
            label="Missing Attendance"
            to="/attendance/missing"
            active={location.pathname === "/attendance/missing"}
          />
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 bg-indigo-600 text-white">
            <h2 className="text-lg font-semibold">Take Attendance</h2>
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto"
            >
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
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              >
                <option value="">Select employee</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all w-full sm:w-auto sm:ml-auto active:scale-95"
              >
                Submit Attendance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const TabLink = ({ label, to, active }) => (
  <Link
    to={to}
    className={`text-center px-6 py-3 rounded-xl text-sm font-bold transition-all w-full sm:w-auto border
      ${active
        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      }`}
  >
    {label}
  </Link>
);

export default AttendanceForm;