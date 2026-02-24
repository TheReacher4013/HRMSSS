import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { attendanceAPI } from "../../utils/api";

const MonthlyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [month, setMonth] = useState(String(today.getMonth()+1).padStart(2,"0"));
  const [year, setYear] = useState(String(today.getFullYear()));

  const load = async () => {
    setLoading(true);
    try { const r = await attendanceAPI.getMonthly(`month=${month}&year=${year}`); setRecords(r.data); } catch(e){console.error(e);}
    setLoading(false);
  };
  useEffect(()=>{load();},[month,year]);

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
          <div className="flex gap-4 mb-6">
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Month</label>
              <select value={month} onChange={e=>setMonth(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none">
                {Array.from({length:12},(_,i)=><option key={i+1} value={String(i+1).padStart(2,"0")}>{new Date(2000,i).toLocaleString("default",{month:"long"})}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Year</label>
              <select value={year} onChange={e=>setYear(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none">
                {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          {loading ? <p className="text-center text-slate-400 py-10">Loading...</p> : (
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-slate-50 border-b">
                {["#","Employee","Date & Time","Type","Status"].map(h=><th key={h} className="px-4 py-3 text-[11px] font-black uppercase text-slate-400">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {records.length===0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No records for this month</td></tr>
                : records.map((r,i)=>(
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-400">{i+1}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{r.employee?.name}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(r.dateTime).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-lg">{r.type}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-lg ${r.status==="Present"?"bg-emerald-50 text-emerald-600":"bg-red-50 text-red-500"}`}>{r.status}</span></td>
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
export default MonthlyAttendance;
