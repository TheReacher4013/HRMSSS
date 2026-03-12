import React, { useState } from "react";

const LeaveReport = () => {
    const initialLeaves = [
        { id: 1, name: "Rahul Sharma", dept: "Engineering", type: "Sick Leave", start: "2026-02-20", end: "2026-02-22", status: "Approved" },
        { id: 2, name: "Sonia Verma", dept: "HR", type: "Casual Leave", start: "2026-02-25", end: "2026-02-26", status: "Pending" },
        { id: 3, name: "Amit Patel", dept: "Sales", type: "Vacation", start: "2026-03-01", end: "2026-03-10", status: "Rejected" },
        { id: 4, name: "Priya Das", dept: "Design", type: "Sick Leave", start: "2026-02-19", end: "2026-02-19", status: "Approved" },
    ];

    const [searchTerm, setSearchTerm] = useState("");

    const filteredLeaves = initialLeaves.filter(leave =>
        leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Rejected": return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="bg-white shadow-sm rounded-[40px] border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Leave Lifecycle</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Review and manage employee time-off requests.</p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search leave type or name..."
                            className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="border border-slate-100 rounded-[32px] overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-50">
                                    <tr>
                                        {["Employee", "Department", "Leave Type", "Duration", "Status", ""].map((h) => (
                                            <th key={h} className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLeaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <div className="font-bold text-slate-700">{leave.name}</div>
                                                <div className="text-[10px] font-black text-slate-300 font-mono">LVE-{leave.id}00</div>
                                            </td>
                                            <td className="p-5 text-sm font-medium text-slate-500">{leave.dept}</td>
                                            <td className="p-5">
                                                <span className="text-sm font-bold text-slate-700">{leave.type}</span>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-[11px] font-black text-indigo-500 font-mono">
                                                    {leave.start} <span className="text-slate-300 mx-1">→</span> {leave.end}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyles(leave.status)}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline px-4">Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-slate-50">
                            {filteredLeaves.map((leave) => (
                                <div key={leave.id} className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-black text-slate-800">{leave.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{leave.dept}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyles(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                                        <p className="text-xs font-bold text-slate-600">{leave.type}</p>
                                        <p className="text-[10px] font-black text-indigo-600 font-mono">{leave.start}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredLeaves.length} applications</p>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Download PDF</button>
                            <button className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Export Excel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveReport;