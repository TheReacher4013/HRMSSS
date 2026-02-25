import React from "react";

const AttendanceLog = () => {
    const logs = [
        { id: 1, date: "19 Feb 2026", checkIn: "09:15 AM", checkOut: "06:30 PM", duration: "9h 15m", status: "On Time" },
        { id: 2, date: "18 Feb 2026", checkIn: "09:45 AM", checkOut: "07:00 PM", duration: "9h 15m", status: "Late" },
        { id: 3, date: "17 Feb 2026", checkIn: "09:05 AM", checkOut: "06:15 PM", duration: "9h 10m", status: "On Time" },
    ];

    return (
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase text-sm md:text-xl">Attendance History</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Log Activity</p>
                    </div>
                </div>
                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-5 py-2 rounded-2xl uppercase tracking-[0.2em] border border-indigo-100">Last 30 Days</span>
            </div>

            {/* Logs List */}
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="group p-6 bg-white border border-slate-100 rounded-[32px] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                            {/* Date & Status */}
                            <div className="min-w-[150px]">
                                <p className="text-base font-black text-slate-800">{log.date}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${log.status === "On Time" ? "text-emerald-500" : "text-amber-500"}`}>
                                    ● {log.status}
                                </p>
                            </div>

                            {/* Timings */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Check In</p>
                                    <p className="text-sm font-bold text-slate-700">{log.checkIn}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Check Out</p>
                                    <p className="text-sm font-bold text-slate-700">{log.checkOut}</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Working Hours</p>
                                    <p className="text-sm font-black text-indigo-600">{log.duration}</p>
                                </div>
                            </div>

                            {/* Action */}
                            <button className="w-full md:w-auto text-[10px] font-black uppercase tracking-widest py-3 px-8 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <div className="mt-10 text-center">
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:text-indigo-800 bg-white border-2 border-indigo-50 px-8 py-4 rounded-full hover:bg-indigo-50 transition-all shadow-sm">
                    View Full History →
                </button>
            </div>
        </div>
    );
};

export default AttendanceLog;