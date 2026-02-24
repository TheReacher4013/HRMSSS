import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { attendanceAPI } from "../../../utils/api";

const UserAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await attendanceAPI.getAll(); setRecords(res.data); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Calendar className="text-emerald-600" size={28} /> My Attendance</h1>

        {loading ? <div className="bg-white rounded-3xl p-20 text-center text-slate-400">Loading...</div> : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50 border-b text-[11px] font-black uppercase text-slate-400">
                <th className="px-6 py-4">Date & Time</th><th className="px-6 py-4">Type</th><th className="px-6 py-4 text-center">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {records.length === 0 ? <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400">No attendance records</td></tr>
                : records.slice(0,20).map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 flex items-center gap-2"><Clock size={14} className="text-slate-400" />{new Date(r.dateTime).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{r.type}</td>
                    <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${r.status==="Present"?"bg-emerald-100 text-emerald-600":"bg-red-100 text-red-600"}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserAttendance;
