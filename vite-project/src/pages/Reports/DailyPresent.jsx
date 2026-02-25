import React, { useState } from "react";

const DailyPresent = () => {
    const [data] = useState([
        { sl: 1, id: "EMP101", name: "Rahul Sharma", dept: "Engineering", date: "2026-02-19", in: "09:00 AM", out: "06:00 PM", status: "Present" },
        { sl: 2, id: "EMP105", name: "Sonia Verma", dept: "HR", date: "2026-02-19", in: "09:15 AM", out: "06:30 PM", status: "Present" },
        { sl: 3, id: "EMP112", name: "Amit Patel", dept: "Sales", date: "2026-02-19", in: "10:30 AM", out: "07:00 PM", status: "Late" },
        { sl: 4, id: "EMP204", name: "Priya Das", dept: "Design", date: "2026-02-19", in: "08:55 AM", out: "05:45 PM", status: "Present" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-50/20">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Daily Presence</h2>
                    <p className="text-xs text-slate-500 font-medium">Tracking live attendance for today</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-72 group">
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">Report</button>
                        <button className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase hover:bg-slate-50 transition">CSV</button>
                    </div>
                </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden p-6 space-y-4 bg-slate-50/30">
                {filteredData.map((row) => (
                    <div key={row.id} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">{row.name.charAt(0)}</div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm">{row.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{row.id} • {row.dept}</p>
                                </div>
                            </div>
                            <StatusBadge status={row.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">In Time</p>
                                <p className="text-xs font-bold text-slate-700">{row.in}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Out Time</p>
                                <p className="text-xs font-bold text-slate-700">{row.out}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {["#", "Employee", "Dept.", "Date", "Check In", "Check Out", "Status"].map((h) => (
                                <th key={h} className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredData.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-5 text-xs font-black text-slate-300">{row.sl}</td>
                                <td className="p-5">
                                    <p className="text-sm font-black text-slate-800">{row.name}</p>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{row.id}</p>
                                </td>
                                <td className="p-5 text-xs font-bold text-slate-500">{row.dept}</td>
                                <td className="p-5 text-xs font-medium text-slate-400 font-mono">{row.date}</td>
                                <td className="p-5 text-xs font-black text-slate-700">{row.in}</td>
                                <td className="p-5 text-xs font-black text-slate-700">{row.out}</td>
                                <td className="p-5"><StatusBadge status={row.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const style = status === "Present" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600";
    return <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${style}`}>{status}</span>;
}

export default DailyPresent;