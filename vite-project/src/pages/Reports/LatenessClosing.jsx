import React, { useState } from "react";

const LatenessClosing = () => {
    const [latenessData] = useState([
        { id: 1, name: "Rahul Sharma", date: "2026-02-19", delay: "45 mins", policy: "Grace 15m", status: "Fine Applied" },
        { id: 2, name: "Sonia Verma", date: "2026-02-18", delay: "10 mins", policy: "Grace 15m", status: "Under Grace" },
        { id: 3, name: "Amit Patel", date: "2026-02-17", delay: "120 mins", policy: "Half Day", status: "Closed" },
    ]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Fine Applied": return "bg-rose-50 text-rose-600 border-rose-100";
            case "Under Grace": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "Closed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            default: return "bg-slate-50 text-slate-600";
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Lateness Closing</h2>
                            <p className="text-slate-500 text-sm font-medium">Reconcile delay records and apply penalty policies.</p>
                        </div>
                    </div>
                    <button className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                        Process All Fines
                    </button>
                </div>

                {/* Table Section */}
                <div className="p-4 md:p-8">
                    <div className="border border-slate-100 rounded-[32px] overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="p-5">Employee</th>
                                    <th className="p-5 text-center">Delay Details</th>
                                    <th className="p-5">Policy Applied</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {latenessData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="font-bold text-slate-700">{item.name}</div>
                                            <div className="text-[10px] font-black text-slate-300 font-mono">EMP-00{item.id}</div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="text-xs font-black text-slate-400 uppercase mb-1">{item.date}</div>
                                            <div className="text-sm font-black text-rose-600 bg-rose-50 inline-block px-3 py-1 rounded-lg">+{item.delay}</div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-tighter">
                                                {item.policy}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="bg-white border-2 border-slate-100 hover:border-indigo-600 text-indigo-600 font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all active:scale-95">
                                                Reconcile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="bg-indigo-600 p-4 text-center">
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.3em]">
                        Auto-Closing cycles run every 24 hours
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LatenessClosing;
