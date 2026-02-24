import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { attendanceAPI } from "../../utils/api";

const MissingAttendance = () => {
  const [missing, setMissing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    attendanceAPI.getMissing().then(r=>setMissing(r.data)).catch(console.error).finally(()=>setLoading(false));
  },[]);

  return (
    <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700">Attendance Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          {[{label:"Attendance Form",to:"/attendance/form"},{label:"Monthly Attendance",to:"/attendance/monthly"},{label:"Missing Attendance",to:"/attendance/missing"}].map(t=>(
            <Link key={t.to} to={t.to} className={`text-center px-6 py-3 rounded-xl text-sm font-bold transition-all w-full sm:w-auto border ${window.location.pathname===t.to?"bg-indigo-600 text-white border-indigo-600":"bg-white text-slate-600 border-slate-200"}`}>{t.label}</Link>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Missing Attendance - Today</h2>
          <p className="text-slate-400 text-sm mb-6">Employees who have not marked attendance today</p>
          {loading ? <p className="text-center text-slate-400 py-10">Loading...</p> : (
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-slate-50 border-b">
                {["#","Employee ID","Name","Email","Mobile"].map(h=><th key={h} className="px-4 py-3 text-[11px] font-black uppercase text-slate-400">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {missing.length===0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-emerald-600 font-bold">All employees present today! 🎉</td></tr>
                : missing.map((emp,i)=>(
                  <tr key={emp._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 font-bold">{i+1}</td>
                    <td className="px-4 py-3 text-slate-500 font-bold">#{emp.employeeId}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{emp.name}</td>
                    <td className="px-4 py-3 text-slate-500">{emp.email}</td>
                    <td className="px-4 py-3 text-slate-500">{emp.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default MissingAttendance;
