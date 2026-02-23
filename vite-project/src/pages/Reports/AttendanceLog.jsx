// import React from "react";

// const AttendanceLog = () => {
//     const logs = [
//         { id: 1, date: "19 Feb 2026", checkIn: "09:15 AM", checkOut: "06:30 PM", duration: "9h 15m", status: "On Time" },
//         { id: 2, date: "18 Feb 2026", checkIn: "09:45 AM", checkOut: "07:00 PM", duration: "9h 15m", status: "Late" },
//         { id: 3, date: "17 Feb 2026", checkIn: "09:05 AM", checkOut: "06:15 PM", duration: "9h 10m", status: "On Time" },
//     ];

//     return (
//         <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-500">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
//                 <div className="flex items-center gap-4">
//                     <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
//                     <div>
//                         <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase text-sm md:text-xl">Attendance History</h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Log Activity</p>
//                     </div>
//                 </div>
//                 <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-5 py-2 rounded-2xl uppercase tracking-[0.2em] border border-indigo-100">Last 30 Days</span>
//             </div>

//             {/* Logs List */}
//             <div className="space-y-4">
//                 {logs.map((log) => (
//                     <div key={log.id} className="group p-6 bg-white border border-slate-100 rounded-[32px] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

//                             {/* Date & Status */}
//                             <div className="min-w-[150px]">
//                                 <p className="text-base font-black text-slate-800">{log.date}</p>
//                                 <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${log.status === "On Time" ? "text-emerald-500" : "text-amber-500"}`}>
//                                     ● {log.status}
//                                 </p>
//                             </div>

//                             {/* Timings */}
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
//                                 <div>
//                                     <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Check In</p>
//                                     <p className="text-sm font-bold text-slate-700">{log.checkIn}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Check Out</p>
//                                     <p className="text-sm font-bold text-slate-700">{log.checkOut}</p>
//                                 </div>
//                                 <div className="hidden md:block">
//                                     <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Working Hours</p>
//                                     <p className="text-sm font-black text-indigo-600">{log.duration}</p>
//                                 </div>
//                             </div>

//                             {/* Action */}
//                             <button className="w-full md:w-auto text-[10px] font-black uppercase tracking-widest py-3 px-8 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">Details</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Bottom Navigation */}
//             <div className="mt-10 text-center">
//                 <button className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:text-indigo-800 bg-white border-2 border-indigo-50 px-8 py-4 rounded-full hover:bg-indigo-50 transition-all shadow-sm">
//                     View Full History →
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AttendanceLog;




import React, { useState } from "react";

const DailyPresent = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // 1. आज की तारीख प्राप्त करें (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];

    // 2. सर्च और आज के डेटा के हिसाब से फिल्टर करें
    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.employeeId && item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));

        // आप यहाँ तय कर सकते हैं कि सिर्फ आज का डेटा दिखाना है या सारा:
        // return matchesSearch && item.date === today; 
        return matchesSearch;
    });

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-50/20">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Daily Presence</h2>
                    <p className="text-xs text-slate-500 font-medium font-mono uppercase tracking-widest mt-1">Live Feed: {today}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search employee or ID..."
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {["Employee", "Dept.", "Check In", "Check Out", "Status"].map((h) => (
                                <th key={h} className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredData.length > 0 ? (
                            filteredData.map((row) => (
                                <tr key={row._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-5">
                                        <p className="text-sm font-black text-slate-800">{row.name}</p>
                                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{row.employeeId || 'EMP-N/A'}</p>
                                    </td>
                                    <td className="p-5 text-xs font-bold text-slate-500 uppercase">{row.department || 'General'}</td>
                                    <td className="p-5 text-xs font-black text-slate-700">{row.checkIn || '--:--'}</td>
                                    <td className="p-5 text-xs font-black text-slate-700">{row.checkOut || '--:--'}</td>
                                    <td className="p-5">
                                        <StatusBadge status={row.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">No records found for today</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden p-4 space-y-4">
                {filteredData.map((row) => (
                    <div key={row._id} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-black text-slate-800">{row.name}</p>
                            <StatusBadge status={row.status} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>In: {row.checkIn || '--'}</span>
                            <span>Out: {row.checkOut || '--'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// छोटा हेल्पर कॉम्पोनेंट स्टेटस के लिए
const StatusBadge = ({ status }) => {
    const isPresent = status === "Present";
    const style = isPresent
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-amber-50 text-amber-600 border-amber-100";

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${style}`}>
            {status}
        </span>
    );
};

export default DailyPresent;