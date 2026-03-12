import React, { useState } from "react";

const MonthlyReport = () => {
    const initialData = [
        { id: 1, name: "Rahul Sharma", dept: "IT", present: 22, absent: 2, leave: 4, late: 1, totalDays: 28 },
        { id: 2, name: "Sonia Verma", dept: "HR", present: 25, absent: 0, leave: 3, late: 0, totalDays: 28 },
        { id: 3, name: "Amit Patel", dept: "Sales", present: 20, absent: 5, leave: 3, late: 5, totalDays: 28 },
    ];

    const [reportData, setReportData] = useState(initialData);
    const [selectedMonth, setSelectedMonth] = useState("2026-02");
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            alert(`Report for ${selectedMonth} exported successfully!`);
            setIsExporting(false);
        }, 1000);
    };

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);
        const shuffled = [...reportData].sort(() => Math.random() - 0.5);
        setReportData(shuffled);
    };

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Monthly Insights</h2>
                        <p className="text-slate-500 mt-2 font-medium">Viewing performance analytics for <span className="text-indigo-600">{selectedMonth}</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isExporting ? "Generating..." : "Download Report"}
                        </button>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="block md:hidden space-y-6">
                    {reportData.map((row) => {
                        const score = ((row.present / row.totalDays) * 100).toFixed(1);
                        return (
                            <div key={row.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-lg font-bold text-slate-800">{row.name}</p>
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{row.dept}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase font-bold">Attendance</p>
                                        <p className="text-xl font-black text-slate-900">{score}%</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 text-sm">
                                    <div className="flex flex-col"><span className="text-slate-400 text-xs">Present</span><b className="text-emerald-600 text-base">{row.present}</b></div>
                                    <div className="flex flex-col"><span className="text-slate-400 text-xs">Absent</span><b className="text-rose-500 text-base">{row.absent}</b></div>
                                    <div className="flex flex-col"><span className="text-slate-400 text-xs">Leave</span><b className="text-amber-500 text-base">{row.leave}</b></div>
                                    <div className="flex flex-col"><span className="text-slate-400 text-xs">Late</span><b className="text-slate-700 text-base">{row.late}</b></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Employee Details</th>
                                <th className="px-6 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Work Days</th>
                                <th className="px-6 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Attendance</th>
                                <th className="px-6 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Leave/Late</th>
                                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Performance Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reportData.map((row) => {
                                const score = ((row.present / row.totalDays) * 100).toFixed(1);
                                return (
                                    <tr key={row.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-800 text-base">{row.name}</div>
                                            <div className="text-xs text-indigo-500 font-semibold">{row.dept} Department</div>
                                        </td>
                                        <td className="px-6 py-6 text-center font-medium text-slate-600">{row.totalDays}</td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="inline-flex gap-3 items-center px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                                                <span className="text-emerald-600 font-bold">{row.present}P</span>
                                                <span className="w-[1px] h-3 bg-slate-200"></span>
                                                <span className="text-rose-500 font-bold">{row.absent}A</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="text-sm font-semibold text-slate-700">{row.leave} Leave · {row.late} Late</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-black text-slate-900 leading-none mb-2">{score}%</span>
                                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                    <div
                                                        className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                                                        style={{ width: `${score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MonthlyReport;