// import { useState, useEffect, useCallback } from "react";
// import { Plus, BarChart3, Users, Award, Briefcase, Calendar, Clock, StickyNote, X, TrendingUp, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
// import { employeeAPI, attendanceAPI, awardAPI, leaveAPI } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// // Widget localStorage 
// const WIDGETS_KEY = "dashboard_widgets";
// const NOTES_KEY = "dashboard_notepad";
// const loadWidgets = () => { try { return JSON.parse(localStorage.getItem(WIDGETS_KEY) || "[]"); } catch { return []; } };
// const saveWidgets = (w) => localStorage.setItem(WIDGETS_KEY, JSON.stringify(w));
// const loadNote = () => localStorage.getItem(NOTES_KEY) || "";
// const saveNote = (n) => localStorage.setItem(NOTES_KEY, n);

// // Clock Widget 
// const ClockWidget = () => {
//   const [time, setTime] = useState(new Date());
//   useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
//   const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds();
//   const hDeg = (h % 12) * 30 + m * 0.5;
//   const mDeg = m * 6;
//   const sDeg = s * 6;
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-2">
//       <div className="relative w-24 h-24">
//         <svg viewBox="0 0 100 100" className="w-full h-full">
//           <circle cx="50" cy="50" r="46" fill="white" stroke="#e2e8f0" strokeWidth="2" />
//           {[...Array(12)].map((_, i) => {
//             const a = (i * 30 - 90) * (Math.PI / 180);
//             return <circle key={i} cx={50 + 38 * Math.cos(a)} cy={50 + 38 * Math.sin(a)} r="2" fill="#cbd5e1" />;
//           })}
//           {/* Hour */}
//           <line x1="50" y1="50" x2={50 + 24 * Math.cos((hDeg - 90) * Math.PI / 180)} y2={50 + 24 * Math.sin((hDeg - 90) * Math.PI / 180)} stroke="#0f2e2e" strokeWidth="3" strokeLinecap="round" />
//           {/* Minute */}
//           <line x1="50" y1="50" x2={50 + 34 * Math.cos((mDeg - 90) * Math.PI / 180)} y2={50 + 34 * Math.sin((mDeg - 90) * Math.PI / 180)} stroke="#0f2e2e" strokeWidth="2" strokeLinecap="round" />
//           {/* Second */}
//           <line x1="50" y1="50" x2={50 + 36 * Math.cos((sDeg - 90) * Math.PI / 180)} y2={50 + 36 * Math.sin((sDeg - 90) * Math.PI / 180)} stroke="#10b981" strokeWidth="1" strokeLinecap="round" />
//           <circle cx="50" cy="50" r="3" fill="#0f2e2e" />
//         </svg>
//       </div>
//       <div className="text-center">
//         <p className="text-xl font-black text-[#0f2e2e] tabular-nums">
//           {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
//         </p>
//         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
//           {time.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
//         </p>
//       </div>
//     </div>
//   );
// };

// // Notepad Widget 
// const NotepadWidget = () => {
//   const [note, setNote] = useState(loadNote);
//   const handleChange = (e) => { setNote(e.target.value); saveNote(e.target.value); };
//   return (
//     <div className="flex flex-col gap-2 h-full">
//       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Notes</p>
//       <textarea value={note} onChange={handleChange} placeholder="Write something..."
//         className="flex-1 w-full min-h-25 text-sm text-slate-700 bg-yellow-50 border border-yellow-100 rounded-2xl p-3 resize-none focus:outline-none focus:ring-2 ring-yellow-200 font-medium placeholder:text-yellow-300" />
//       <p className="text-[9px] text-gray-300 text-right">Auto-saved</p>
//     </div>
//   );
// };

// // Quick Stats Widget
// const QuickStatsWidget = ({ empCount, presentCount }) => (
//   <div className="space-y-3">
//     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Stats</p>
//     {[
//       { label: "Total Employees", value: empCount, color: "text-blue-600", bg: "bg-blue-50" },
//       { label: "Present Today", value: presentCount, color: "text-emerald-600", bg: "bg-emerald-50" },
//       { label: "Absent Today", value: Math.max(0, empCount - presentCount), color: "text-red-500", bg: "bg-red-50" },
//     ].map(s => (
//       <div key={s.label} className={`${s.bg} rounded-2xl px-4 py-3 flex justify-between items-center`}>
//         <p className="text-xs font-bold text-slate-600">{s.label}</p>
//         <p className={`text-lg font-black ${s.color}`}>{s.value ?? "—"}</p>
//       </div>
//     ))}
//   </div>
// );

// //Calendar Mini Widget
// const MiniCalendarWidget = () => {
//   const today = new Date();
//   const year = today.getFullYear(), month = today.getMonth();
//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
//   return (
//     <div>
//       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
//         {today.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//       </p>
//       <div className="grid grid-cols-7 gap-1 text-center">
//         {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
//           <div key={i} className="text-[9px] font-black text-gray-300 py-1">{d}</div>
//         ))}
//         {days.map((d, i) => (
//           <div key={i} className={`text-[11px] font-bold rounded-lg py-1 ${d === today.getDate() ? "bg-[#0f2e2e] text-white" :
//               d ? "text-slate-600 hover:bg-gray-100 cursor-pointer" : ""
//             }`}>{d || ""}</div>
//         ))}
//       </div>
//     </div>
//   );
// };

// //  Widget Picker Modal 
// const AVAILABLE_WIDGETS = [
//   { id: "clock", label: "Analog Clock", icon: "🕐", desc: "Live clock with analog face" },
//   { id: "notepad", label: "Notepad", icon: "📝", desc: "Quick notes, auto-saved" },
//   { id: "stats", label: "Quick Stats", icon: "📊", desc: "Employee & attendance count" },
//   { id: "calendar", label: "Mini Calendar", icon: "📅", desc: "Current month calendar" },
// ];

// // Days of week labels
// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// const DashboardContent = ({ isSidebarOpen }) => {
//   const { user } = useAuth();

//   const [empCount, setEmpCount] = useState(null);
//   const [presentCount, setPresentCount] = useState(null);
//   const [awards, setAwards] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [pendingLeaves, setPendingLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Widgets
//   const [activeWidgets, setActiveWidgets] = useState(loadWidgets);
//   const [showPicker, setShowPicker] = useState(false);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [empRes, attRes, awardRes, leaveRes] = await Promise.all([
//           employeeAPI.getAll(),
//           attendanceAPI.getAll(),
//           awardAPI.getAll(),
//           leaveAPI.getAll(),
//         ]);

//         const emps = empRes.data || [];
//         setEmpCount(emps.length);

//         // Today's attendance
//         const todayStr = new Date().toISOString().slice(0, 10);
//         const todayAtt = (attRes.data || []).filter(a => a.date?.slice(0, 10) === todayStr);
//         setPresentCount(todayAtt.length);

//         // Build weekly attendance chart — last 7 days
//         const weekData = DAYS.map((_, i) => {
//           const d = new Date();
//           d.setDate(d.getDate() - 6 + i);
//           const ds = d.toISOString().slice(0, 10);
//           return (attRes.data || []).filter(a => a.date?.slice(0, 10) === ds).length;
//         });
//         setAttendance(weekData);

//         setAwards(awardRes.data || []);
//         setPendingLeaves((leaveRes.data || []).filter(l => l.status === "Pending"));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const addWidget = (id) => {
//     if (activeWidgets.includes(id)) return;
//     const updated = [...activeWidgets, id];
//     setActiveWidgets(updated);
//     saveWidgets(updated);
//     setShowPicker(false);
//   };

//   const removeWidget = (id) => {
//     const updated = activeWidgets.filter(w => w !== id);
//     setActiveWidgets(updated);
//     saveWidgets(updated);
//   };

//   const maxBar = Math.max(...attendance, 1);

//   const renderWidget = (id) => {
//     switch (id) {
//       case "clock": return <ClockWidget />;
//       case "notepad": return <NotepadWidget />;
//       case "stats": return <QuickStatsWidget empCount={empCount} presentCount={presentCount} />;
//       case "calendar": return <MiniCalendarWidget />;
//       default: return null;
//     }
//   };

//   return (
//     <div className={`pt-20 p-3 sm:p-6 bg-[#f0f4f4] min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-[280px]" : "ml-0"}`}>
//       <div className="max-w-[1600px] mx-auto">

//         {/* ── HEADER ── */}
//         <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e2e] tracking-tight">Dashboard</h1>
//             <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium italic">
//               Welcome back, {user?.name || "Admin"} 👋
//             </p>
//           </div>
//           <button onClick={() => setShowPicker(true)}
//             className="flex items-center gap-2 bg-[#0f2e2e] text-white px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#1a4040] transition shadow-xl active:scale-95 shrink-0">
//             <Plus size={15} /> Add Widget
//           </button>
//         </div>

//         {/* ── WIDGETS ROW (if any added) ── */}
//         {activeWidgets.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {activeWidgets.map(id => (
//               <div key={id} className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-5 relative group">
//                 <button onClick={() => removeWidget(id)}
//                   className="absolute top-3 right-3 p-1 rounded-lg bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition hover:bg-red-100">
//                   <X size={12} />
//                 </button>
//                 {renderWidget(id)}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── TOP STATS GRID ── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

//           {/* Stat Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:col-span-2 lg:col-span-1">
//             <StatCard title="Total Employees" value={loading ? "—" : empCount} icon={<Users size={18} />} color="text-blue-500" />
//             <StatCard title="Today Present" value={loading ? "—" : presentCount} icon={<CheckCircle size={18} />} color="text-emerald-500" />
//             <StatCard title="Today Absent" value={loading ? "—" : Math.max(0, (empCount || 0) - (presentCount || 0))} icon={<AlertCircle size={18} />} color="text-red-400" />
//           </div>

//           {/* ── ATTENDANCE CHART (dynamic) ── */}
//           <div className="md:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-base font-bold text-[#0f2e2e] flex items-center gap-2">
//                 <TrendingUp size={16} className="text-emerald-500" /> Daily Attendance
//               </h2>
//               <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl uppercase">Last 7 Days</span>
//             </div>

//             {/* Day labels + bars */}
//             <div className="h-52 sm:h-64 flex items-end gap-1.5 sm:gap-2 px-1">
//               {DAYS.map((day, i) => {
//                 const val = attendance[i] || 0;
//                 const pct = maxBar > 0 ? Math.max(8, Math.round((val / maxBar) * 100)) : 8;
//                 const isToday = i === 6;
//                 return (
//                   <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
//                     <span className="text-[9px] font-black text-slate-400">{val > 0 ? val : ""}</span>
//                     <div className="w-full flex items-end" style={{ height: "180px" }}>
//                       <div
//                         style={{ height: `${pct}%` }}
//                         className={`w-full rounded-t-xl transition-all duration-700 ${isToday ? "bg-emerald-500" : "bg-[#0f2e2e] opacity-70 hover:opacity-100"}`}
//                       />
//                     </div>
//                     <span className={`text-[9px] font-black uppercase ${isToday ? "text-emerald-500" : "text-gray-400"}`}>{day}</span>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Legend */}
//             <div className="flex gap-4 mt-3 justify-end">
//               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] text-gray-400 font-bold">Today</span></div>
//               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#0f2e2e]" /><span className="text-[10px] text-gray-400 font-bold">Previous</span></div>
//             </div>
//           </div>

//           {/* Pending Approvals Card */}
//           <div className="md:col-span-2 lg:col-span-1 bg-[#0f2e2e] rounded-[32px] p-6 text-white relative overflow-hidden flex flex-col min-h-[250px] shadow-xl">
//             <div className="relative z-10 mb-4">
//               <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[3px]">Action Required</span>
//               <h2 className="text-lg font-black mt-1 flex items-center gap-2">
//                 Pending Leaves
//                 {pendingLeaves.length > 0 && (
//                   <span className="text-xs bg-yellow-400 text-yellow-900 font-black px-2 py-0.5 rounded-full">{pendingLeaves.length}</span>
//                 )}
//               </h2>
//             </div>
//             <div className="relative z-10 flex-1 space-y-2 overflow-y-auto max-h-[180px]">
//               {loading ? (
//                 <p className="text-xs text-white/50 font-bold text-center py-6">Loading...</p>
//               ) : pendingLeaves.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full py-6 opacity-60">
//                   <CheckCircle size={28} className="text-emerald-400 mb-2" />
//                   <p className="text-xs font-bold text-white/70">All clear! No pending</p>
//                 </div>
//               ) : pendingLeaves.slice(0, 5).map((l, i) => (
//                 <div key={l._id || i} className="bg-white/10 hover:bg-white/15 transition rounded-2xl px-3 py-2.5 flex items-center justify-between gap-2">
//                   <div className="flex items-center gap-2 min-w-0">
//                     <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-black shrink-0">
//                       {(l.employeeName || l.employee?.name || "?").charAt(0)}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-xs font-black text-white truncate">{l.employeeName || l.employee?.name || "—"}</p>
//                       <p className="text-[9px] text-white/60 font-bold">{l.type} • {l.days || 1}d</p>
//                     </div>
//                   </div>
//                   <span className="text-[9px] font-black bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full shrink-0">Pending</span>
//                 </div>
//               ))}
//             </div>
//             {pendingLeaves.length > 0 && (
//               <div className="relative z-10 mt-3 pt-3 border-t border-white/10">
//                 <p className="text-[10px] text-white/50 font-bold text-center">
//                   {pendingLeaves.length} pending → Leave module
//                 </p>
//               </div>
//             )}
//             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full blur-[60px] opacity-20" />
//           </div>
//         </div>

//         {/* ── AWARD LIST (dynamic from API) ── */}
//         <div className="mt-6 bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 sm:p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-[#0f2e2e] flex items-center gap-2">
//               <Award className="text-emerald-500" /> Employee Award List
//             </h2>
//             <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
//               {awards.length} Award{awards.length !== 1 ? "s" : ""}
//             </span>
//           </div>

//           {loading ? (
//             <div className="text-center py-10 text-gray-400 text-sm">Loading awards...</div>
//           ) : awards.length === 0 ? (
//             <div className="text-center py-10">
//               <Award size={36} className="mx-auto mb-2 text-gray-200" />
//               <p className="text-gray-400 text-sm font-bold">No awards given yet</p>
//               <p className="text-gray-300 text-xs mt-1">Go to Award module to give an award</p>
//             </div>
//           ) : (
//             <>
//               {/* Mobile cards */}
//               <div className="grid grid-cols-1 gap-4 md:hidden">
//                 {awards.map((row, i) => (
//                   <div key={row._id || i} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 flex flex-col gap-3">
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-center gap-3">
//                         <div className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-black text-sm">
//                           {(row.employeeName || row.employee?.name || "?").charAt(0)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-black text-[#0f2e2e]">{row.employeeName || row.employee?.name || "—"}</p>
//                           <p className="text-[10px] font-bold text-gray-400">{row.awardType || row.type}</p>
//                         </div>
//                       </div>
//                       <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase shrink-0">
//                         {row.cashPrize ? `₹${row.cashPrize}` : row.giftItem || "Award"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 text-gray-400 pt-2 border-t border-gray-100">
//                       <Calendar size={11} />
//                       <span className="text-[10px] font-bold">{row.date ? new Date(row.date).toLocaleDateString("en-IN") : "—"}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Desktop table */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="text-gray-400 text-[10px] uppercase tracking-[3px] font-black border-b border-gray-50">
//                       <th className="pb-5 pl-2">#</th>
//                       <th className="pb-5">Employee</th>
//                       <th className="pb-5">Award</th>
//                       <th className="pb-5">Prize / Gift</th>
//                       <th className="pb-5 text-right pr-2">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50/50">
//                     {awards.map((row, i) => (
//                       <tr key={row._id || i} className="hover:bg-gray-50/50 transition-colors group">
//                         <td className="py-4 text-xs font-black text-gray-300 pl-2">{i + 1}</td>
//                         <td className="py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm border-2 border-white shadow-sm">
//                               {(row.employeeName || row.employee?.name || "?").charAt(0)}
//                             </div>
//                             <span className="text-xs font-black text-[#0f2e2e] group-hover:text-emerald-600 transition-colors">
//                               {row.employeeName || row.employee?.name || "—"}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="py-4">
//                           <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">
//                             {row.awardType || row.type || "—"}
//                           </span>
//                         </td>
//                         <td className="py-4 text-xs font-bold text-slate-500">
//                           {row.cashPrize ? `₹${row.cashPrize}` : row.giftItem || "—"}
//                         </td>
//                         <td className="py-4 text-xs font-bold text-gray-400 text-right pr-2">
//                           {row.date ? new Date(row.date).toLocaleDateString("en-IN") : "—"}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ── WIDGET PICKER MODAL ── */}
//       {showPicker && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
//               <h3 className="font-black text-[#0f2e2e] text-base">Add Widget</h3>
//               <button onClick={() => setShowPicker(false)} className="p-1.5 hover:bg-gray-100 rounded-xl">
//                 <X size={18} className="text-gray-400" />
//               </button>
//             </div>
//             <div className="p-4 space-y-2">
//               {AVAILABLE_WIDGETS.map(w => {
//                 const added = activeWidgets.includes(w.id);
//                 return (
//                   <button key={w.id} onClick={() => !added && addWidget(w.id)}
//                     className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all
//                       ${added ? "border-emerald-100 bg-emerald-50 cursor-default" : "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 cursor-pointer"}`}>
//                     <span className="text-2xl">{w.icon}</span>
//                     <div className="flex-1">
//                       <p className={`text-sm font-black ${added ? "text-emerald-600" : "text-slate-700"}`}>{w.label}</p>
//                       <p className="text-[10px] text-gray-400 mt-0.5">{w.desc}</p>
//                     </div>
//                     {added ? (
//                       <span className="text-[9px] font-black text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">Added ✓</span>
//                     ) : (
//                       <Plus size={16} className="text-gray-300 shrink-0" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//             <div className="px-6 pb-4 pt-2">
//               <p className="text-[10px] text-gray-400 text-center">Hover on widget → click × to remove</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon, color }) => (
//   <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-5 flex justify-between items-center hover:shadow-md transition-shadow">
//     <div>
//       <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-black mb-2">{title}</p>
//       <h2 className="text-2xl font-black text-[#0f2e2e]">{value ?? "—"}</h2>
//     </div>
//     <div className={`p-3 bg-gray-50 rounded-xl ${color}`}>{icon}</div>
//   </div>
// );

// export default DashboardContent;


import { useState, useEffect, useCallback } from "react";
import { Plus, BarChart3, Users, Award, Briefcase, Calendar, Clock, StickyNote, X, TrendingUp, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { employeeAPI, attendanceAPI, awardAPI, leaveAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── Widget localStorage ───────────────────────────────────────────────────────
const WIDGETS_KEY = "dashboard_widgets";
const NOTES_KEY = "dashboard_notepad";
const loadWidgets = () => { try { return JSON.parse(localStorage.getItem(WIDGETS_KEY) || "[]"); } catch { return []; } };
const saveWidgets = (w) => localStorage.setItem(WIDGETS_KEY, JSON.stringify(w));
const loadNote = () => localStorage.getItem(NOTES_KEY) || "";
const saveNote = (n) => localStorage.setItem(NOTES_KEY, n);

// ── Clock Widget ──────────────────────────────────────────────────────────────
const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds();
  const hDeg = (h % 12) * 30 + m * 0.5;
  const mDeg = m * 6;
  const sDeg = s * 6;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="white" stroke="#e2e8f0" strokeWidth="2" />
          {[...Array(12)].map((_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180);
            return <circle key={i} cx={50 + 38 * Math.cos(a)} cy={50 + 38 * Math.sin(a)} r="2" fill="#cbd5e1" />;
          })}
          {/* Hour */}
          <line x1="50" y1="50" x2={50 + 24 * Math.cos((hDeg - 90) * Math.PI / 180)} y2={50 + 24 * Math.sin((hDeg - 90) * Math.PI / 180)} stroke="#0f2e2e" strokeWidth="3" strokeLinecap="round" />
          {/* Minute */}
          <line x1="50" y1="50" x2={50 + 34 * Math.cos((mDeg - 90) * Math.PI / 180)} y2={50 + 34 * Math.sin((mDeg - 90) * Math.PI / 180)} stroke="#0f2e2e" strokeWidth="2" strokeLinecap="round" />
          {/* Second */}
          <line x1="50" y1="50" x2={50 + 36 * Math.cos((sDeg - 90) * Math.PI / 180)} y2={50 + 36 * Math.sin((sDeg - 90) * Math.PI / 180)} stroke="#10b981" strokeWidth="1" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3" fill="#0f2e2e" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-[#0f2e2e] tabular-nums">
          {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
          {time.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
};

// ── Notepad Widget ────────────────────────────────────────────────────────────
const NotepadWidget = () => {
  const [note, setNote] = useState(loadNote);
  const handleChange = (e) => { setNote(e.target.value); saveNote(e.target.value); };
  return (
    <div className="flex flex-col gap-2 h-full">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Notes</p>
      <textarea value={note} onChange={handleChange} placeholder="Write something..."
        className="flex-1 w-full min-h-[100px] text-sm text-slate-700 bg-yellow-50 border border-yellow-100 rounded-2xl p-3 resize-none focus:outline-none focus:ring-2 ring-yellow-200 font-medium placeholder:text-yellow-300" />
      <p className="text-[9px] text-gray-300 text-right">Auto-saved</p>
    </div>
  );
};

// ── Quick Stats Widget ────────────────────────────────────────────────────────
const QuickStatsWidget = ({ empCount, presentCount }) => (
  <div className="space-y-3">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Stats</p>
    {[
      { label: "Total Employees", value: empCount, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Present Today", value: presentCount, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Absent Today", value: Math.max(0, empCount - presentCount), color: "text-red-500", bg: "bg-red-50" },
    ].map(s => (
      <div key={s.label} className={`${s.bg} rounded-2xl px-4 py-3 flex justify-between items-center`}>
        <p className="text-xs font-bold text-slate-600">{s.label}</p>
        <p className={`text-lg font-black ${s.color}`}>{s.value ?? "—"}</p>
      </div>
    ))}
  </div>
);

// ── Calendar Mini Widget ──────────────────────────────────────────────────────
const MiniCalendarWidget = () => {
  const today = new Date();
  const year = today.getFullYear(), month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
        {today.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] font-black text-gray-300 py-1">{d}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} className={`text-[11px] font-bold rounded-lg py-1 ${d === today.getDate() ? "bg-[#0f2e2e] text-white" :
              d ? "text-slate-600 hover:bg-gray-100 cursor-pointer" : ""
            }`}>{d || ""}</div>
        ))}
      </div>
    </div>
  );
};

// ── Widget Picker Modal ───────────────────────────────────────────────────────
const AVAILABLE_WIDGETS = [
  { id: "clock", label: "Analog Clock", icon: "🕐", desc: "Live clock with analog face" },
  { id: "notepad", label: "Notepad", icon: "📝", desc: "Quick notes, auto-saved" },
  { id: "stats", label: "Quick Stats", icon: "📊", desc: "Employee & attendance count" },
  { id: "calendar", label: "Mini Calendar", icon: "📅", desc: "Current month calendar" },
];

// ── Days of week labels ───────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─────────────────────────────────────────────────────────────────────────────
const DashboardContent = ({ isSidebarOpen }) => {
  const { user } = useAuth();

  const [empCount, setEmpCount] = useState(null);
  const [presentCount, setPresentCount] = useState(null);
  const [awards, setAwards] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Widgets
  const [activeWidgets, setActiveWidgets] = useState(loadWidgets);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, attRes, awardRes, leaveRes] = await Promise.all([
          employeeAPI.getAll(),
          attendanceAPI.getAll(),
          awardAPI.getAll(),
          leaveAPI.getAll(),
        ]);

        const emps = empRes.data || [];
        setEmpCount(emps.length);

        // Today's attendance
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayAtt = (attRes.data || []).filter(a => a.date?.slice(0, 10) === todayStr);
        setPresentCount(todayAtt.length);

        // Build weekly attendance chart — last 7 days
        const weekData = DAYS.map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - 6 + i);
          const ds = d.toISOString().slice(0, 10);
          return (attRes.data || []).filter(a => a.date?.slice(0, 10) === ds).length;
        });
        setAttendance(weekData);

        setAwards(awardRes.data || []);
        setPendingLeaves((leaveRes.data || []).filter(l => l.status === "Pending"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const addWidget = (id) => {
    if (activeWidgets.includes(id)) return;
    const updated = [...activeWidgets, id];
    setActiveWidgets(updated);
    saveWidgets(updated);
    setShowPicker(false);
  };

  const removeWidget = (id) => {
    const updated = activeWidgets.filter(w => w !== id);
    setActiveWidgets(updated);
    saveWidgets(updated);
  };

  const maxBar = Math.max(...attendance, 1);

  const renderWidget = (id) => {
    switch (id) {
      case "clock": return <ClockWidget />;
      case "notepad": return <NotepadWidget />;
      case "stats": return <QuickStatsWidget empCount={empCount} presentCount={presentCount} />;
      case "calendar": return <MiniCalendarWidget />;
      default: return null;
    }
  };

  return (
    <div className={`pt-16 sm:pt-20 p-3 sm:p-6 bg-[#f0f4f4] min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-[280px]" : "ml-0"}`}>
      <div className="max-w-[1600px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-[#0f2e2e] tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-medium italic">
              Welcome back, {user?.name || "Admin"} 👋
            </p>
          </div>
          <button onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-[#0f2e2e] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#1a4040] transition shadow-xl active:scale-95 shrink-0">
            <Plus size={14} /> Add Widget
          </button>
        </div>

        {/* ── WIDGETS ROW (if any added) ── */}
        {activeWidgets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
            {activeWidgets.map(id => (
              <div key={id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 sm:p-5 relative group">
                <button onClick={() => removeWidget(id)}
                  className="absolute top-3 right-3 p-1 rounded-lg bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition hover:bg-red-100">
                  <X size={12} />
                </button>
                {renderWidget(id)}
              </div>
            ))}
          </div>
        )}

        {/* ── TOP STATS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

          {/* Stat Cards — stacked vertically */}
          <div className="grid grid-cols-1 gap-3 md:col-span-2 lg:col-span-1">
            <StatCard title="Total Employees" value={loading ? "—" : empCount} icon={<Users size={18} />} color="text-blue-500" bg="bg-blue-50" />
            <StatCard title="Today Present" value={loading ? "—" : presentCount} icon={<CheckCircle size={18} />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard title="Today Absent" value={loading ? "—" : Math.max(0, (empCount || 0) - (presentCount || 0))} icon={<AlertCircle size={18} />} color="text-red-500" bg="bg-red-50" />
          </div>

          {/* ── ATTENDANCE CHART (dynamic) ── */}
          <div className="md:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0f2e2e] flex items-center gap-2">
                <TrendingUp size={15} className="text-emerald-500" /> Daily Attendance
              </h2>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl uppercase">Last 7 Days</span>
            </div>

            <div className="flex items-end gap-1 sm:gap-2 px-1" style={{ height: "160px" }}>
              {DAYS.map((day, i) => {
                const val = attendance[i] || 0;
                const pct = maxBar > 0 ? Math.max(8, Math.round((val / maxBar) * 100)) : 8;
                const isToday = i === 6;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1" style={{ height: "100%" }}>
                    <span className="text-[8px] sm:text-[9px] font-black text-slate-400">{val > 0 ? val : ""}</span>
                    <div className="w-full flex items-end flex-1">
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-700 ${isToday ? "bg-emerald-500" : "bg-[#0f2e2e] opacity-70 hover:opacity-100"}`}
                      />
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-black uppercase ${isToday ? "text-emerald-500" : "text-gray-400"}`}>{day}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-2 justify-end">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] text-gray-400 font-bold">Today</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0f2e2e]" /><span className="text-[9px] text-gray-400 font-bold">Previous</span></div>
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div className="md:col-span-2 lg:col-span-1 bg-[#0f2e2e] rounded-[32px] p-6 text-white relative overflow-hidden flex flex-col min-h-[250px] shadow-xl">
            <div className="relative z-10 mb-4">
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[3px]">Action Required</span>
              <h2 className="text-lg font-black mt-1 flex items-center gap-2">
                Pending Leaves
                {pendingLeaves.length > 0 && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 font-black px-2 py-0.5 rounded-full">{pendingLeaves.length}</span>
                )}
              </h2>
            </div>
            <div className="relative z-10 flex-1 space-y-2 overflow-y-auto max-h-[180px]">
              {loading ? (
                <p className="text-xs text-white/50 font-bold text-center py-6">Loading...</p>
              ) : pendingLeaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-6 opacity-60">
                  <CheckCircle size={28} className="text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-white/70">All clear! No pending</p>
                </div>
              ) : pendingLeaves.slice(0, 5).map((l, i) => (
                <div key={l._id || i} className="bg-white/10 hover:bg-white/15 transition rounded-2xl px-3 py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-black shrink-0">
                      {(l.employeeName || l.employee?.name || "?").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white truncate">{l.employeeName || l.employee?.name || "—"}</p>
                      <p className="text-[9px] text-white/60 font-bold">{l.type} • {l.days || 1}d</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full shrink-0">Pending</span>
                </div>
              ))}
            </div>
            {pendingLeaves.length > 0 && (
              <div className="relative z-10 mt-3 pt-3 border-t border-white/10">
                <p className="text-[10px] text-white/50 font-bold text-center">
                  {pendingLeaves.length} pending → Leave module
                </p>
              </div>
            )}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full blur-[60px] opacity-20" />
          </div>
        </div>

        {/* ── AWARD LIST (dynamic from API) ── */}
        <div className="mt-6 bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#0f2e2e] flex items-center gap-2">
              <Award className="text-emerald-500" /> Employee Award List
            </h2>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
              {awards.length} Award{awards.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">Loading awards...</div>
          ) : awards.length === 0 ? (
            <div className="text-center py-10">
              <Award size={36} className="mx-auto mb-2 text-gray-200" />
              <p className="text-gray-400 text-sm font-bold">No awards given yet</p>
              <p className="text-gray-300 text-xs mt-1">Go to Award module to give an award</p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {awards.map((row, i) => (
                  <div key={row._id || i} className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-black text-sm shrink-0">
                        {(row.employeeName || row.employee?.name || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-[#0f2e2e] truncate">{row.employeeName || row.employee?.name || "—"}</p>
                        <p className="text-[10px] font-bold text-gray-400">{row.awardType || row.type}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase shrink-0 ml-auto">
                        {row.cashPrize ? `₹${row.cashPrize}` : row.giftItem || "Award"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pt-2 border-t border-gray-100">
                      <Calendar size={11} />
                      <span className="text-[10px] font-bold">{row.date ? new Date(row.date).toLocaleDateString("en-IN") : "—"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-[10px] uppercase tracking-[3px] font-black border-b border-gray-50">
                      <th className="pb-5 pl-2">#</th>
                      <th className="pb-5">Employee</th>
                      <th className="pb-5">Award</th>
                      <th className="pb-5">Prize / Gift</th>
                      <th className="pb-5 text-right pr-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {awards.map((row, i) => (
                      <tr key={row._id || i} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 text-xs font-black text-gray-300 pl-2">{i + 1}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm border-2 border-white shadow-sm">
                              {(row.employeeName || row.employee?.name || "?").charAt(0)}
                            </div>
                            <span className="text-xs font-black text-[#0f2e2e] group-hover:text-emerald-600 transition-colors">
                              {row.employeeName || row.employee?.name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">
                            {row.awardType || row.type || "—"}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-500">
                          {row.cashPrize ? `₹${row.cashPrize}` : row.giftItem || "—"}
                        </td>
                        <td className="py-4 text-xs font-bold text-gray-400 text-right pr-2">
                          {row.date ? new Date(row.date).toLocaleDateString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── WIDGET PICKER MODAL ── */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="font-black text-[#0f2e2e] text-base">Add Widget</h3>
              <button onClick={() => setShowPicker(false)} className="p-1.5 hover:bg-gray-100 rounded-xl">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {AVAILABLE_WIDGETS.map(w => {
                const added = activeWidgets.includes(w.id);
                return (
                  <button key={w.id} onClick={() => !added && addWidget(w.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all
                      ${added ? "border-emerald-100 bg-emerald-50 cursor-default" : "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 cursor-pointer"}`}>
                    <span className="text-2xl">{w.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-black ${added ? "text-emerald-600" : "text-slate-700"}`}>{w.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{w.desc}</p>
                    </div>
                    {added ? (
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">Added ✓</span>
                    ) : (
                      <Plus size={16} className="text-gray-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-6 pb-4 pt-2">
              <p className="text-[10px] text-gray-400 text-center">Hover on widget → click × to remove</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-black mb-1">{title}</p>
      <h2 className="text-3xl font-black text-[#0f2e2e]">{value ?? "—"}</h2>
    </div>
    <div className={`p-3 ${bg || "bg-gray-50"} rounded-2xl ${color}`}>{icon}</div>
  </div>
);

export default DashboardContent;