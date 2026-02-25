
// import { useEffect, useState } from "react";

// const UserAttendance = () => {
//   const [rows, setRows] = useState([]);

//   const loadAttendance = () => {
//     const stored = JSON.parse(localStorage.getItem("attendance")) || [];
//     setRows([...stored]);
//   };

//   useEffect(() => {
//     loadAttendance();
//     window.addEventListener("attendanceUpdated", loadAttendance);
//     return () => window.removeEventListener("attendanceUpdated", loadAttendance);
//   }, []);

//   return (
//     <div className="pt-6 p-4 sm:p-8 bg-[#f0f4f4] min-h-screen w-full">
//       <div className="max-w-7xl mx-auto flex flex-col gap-6">

//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2e2e]">My Attendance</h1>
//             <p className="text-gray-500 text-sm mt-1">Detailed log of your work hours</p>
//           </div>
//           <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Records</span>
//             <span className="text-lg font-bold text-[#0f2e2e]">{rows.length} Days</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 overflow-hidden">

//           <div className="hidden sm:block overflow-x-auto">
//             <table className="w-full text-left border-separate border-spacing-y-2">
//               <thead>
//                 <tr className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
//                   <th className="pb-4 pl-4">Work Date</th>
//                   <th className="pb-4">Punch In Time</th>
//                   <th className="pb-4">Punch Out Time</th>
//                   <th className="pb-4 text-right pr-4">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="space-y-4">
//                 {rows.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="py-20 text-center text-gray-400 text-sm font-medium italic bg-gray-50/50 rounded-2xl">
//                       No attendance data found yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   rows.map((r, i) => (
//                     <tr key={i} className="group hover:bg-gray-50/80 transition-all">
//                       <td className="py-4 pl-4 text-xs font-bold text-[#0f2e2e] bg-gray-50/30 rounded-l-2xl border-y border-l border-transparent group-hover:border-gray-100">
//                         {r.date}
//                       </td>
//                       <td className="py-4 text-xs font-medium text-emerald-600 bg-gray-50/30 border-y border-transparent group-hover:border-gray-100">
//                         {r.punchIn}
//                       </td>
//                       <td className="py-4 text-xs font-medium text-rose-500 bg-gray-50/30 border-y border-transparent group-hover:border-gray-100">
//                         {r.punchOut || "--:--:--"}
//                       </td>
//                       <td className="py-4 pr-4 text-right bg-gray-50/30 rounded-r-2xl border-y border-r border-transparent group-hover:border-gray-100">
//                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${r.punchOut ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
//                           {r.punchOut ? "Completed" : "On Duty"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="sm:hidden flex flex-col gap-4">
//             {rows.length === 0 ? (
//               <div className="py-12 text-center text-gray-400 text-xs italic">No attendance data</div>
//             ) : (
//               rows.map((r, i) => (
//                 <div key={i} className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 space-y-4">
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs font-bold text-[#0f2e2e]">{r.date}</p>
//                     <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase ${r.punchOut ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
//                       {r.punchOut ? "Completed" : "On Duty"}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/50">
//                     <div>
//                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Punch In</p>
//                       <p className="text-xs font-bold text-emerald-600">{r.punchIn}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Punch Out</p>
//                       <p className="text-xs font-bold text-rose-500">{r.punchOut || "--:--"}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserAttendance;


import { useEffect, useState } from "react";
import { attendanceAPI } from "../../../services/api";
import { Loader2 } from "lucide-react";

const UserAttendance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await attendanceAPI.getAll();
        setRows(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const totalPresent = rows.filter(r => r.status === "Present" || r.checkIn).length;
  const totalCompleted = rows.filter(r => r.checkOut).length;

  return (
    <div className="pt-6 p-4 sm:p-8 bg-[#f0f4f4] min-h-screen w-full">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2e2e]">My Attendance</h1>
            <p className="text-gray-500 text-sm mt-1">Detailed log of your work hours</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Days</span>
              <span className="text-lg font-bold text-[#0f2e2e]">{rows.length}</span>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm text-center">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Present</span>
              <span className="text-lg font-bold text-emerald-700">{totalPresent}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" size={36} />
            </div>
          ) : (
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                    <th className="pb-4 pl-4">Date</th>
                    <th className="pb-4">Punch In</th>
                    <th className="pb-4">Punch Out</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right pr-4">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-gray-400 text-sm italic bg-gray-50/50 rounded-2xl">
                        No attendance records found
                      </td>
                    </tr>
                  ) : rows.map((r) => {
                    // Calculate duration
                    let duration = "--";
                    if (r.checkIn && r.checkOut) {
                      const [inH, inM] = r.checkIn.split(":").map(Number);
                      const [outH, outM] = r.checkOut.split(":").map(Number);
                      const mins = (outH * 60 + outM) - (inH * 60 + inM);
                      if (mins > 0) duration = `${Math.floor(mins / 60)}h ${mins % 60}m`;
                    }
                    return (
                      <tr key={r._id} className="group hover:bg-gray-50/80 transition-all">
                        <td className="py-4 pl-4 text-xs font-bold text-[#0f2e2e] bg-gray-50/30 rounded-l-2xl">
                          {new Date(r.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-4 text-xs font-medium text-emerald-600 bg-gray-50/30">{r.checkIn || "--"}</td>
                        <td className="py-4 text-xs font-medium text-rose-500 bg-gray-50/30">{r.checkOut || "--:--:--"}</td>
                        <td className="py-4 bg-gray-50/30">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${r.status === "Present" ? "bg-emerald-100 text-emerald-700" :
                              r.status === "Late" ? "bg-orange-100 text-orange-700" :
                                r.status === "Absent" ? "bg-red-100 text-red-700" :
                                  "bg-gray-100 text-gray-700"}`}>{r.status}</span>
                        </td>
                        <td className="py-4 pr-4 text-right text-xs text-gray-500 bg-gray-50/30 rounded-r-2xl">{duration}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile view */}
          <div className="sm:hidden flex flex-col gap-4">
            {rows.map((r) => (
              <div key={r._id} className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#0f2e2e]">{new Date(r.date).toLocaleDateString()}</p>
                  <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase ${r.checkOut ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    {r.checkOut ? "Completed" : "On Duty"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/50">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Punch In</p>
                    <p className="text-xs font-bold text-emerald-600">{r.checkIn || "--"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Punch Out</p>
                    <p className="text-xs font-bold text-rose-500">{r.checkOut || "--:--"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAttendance;
