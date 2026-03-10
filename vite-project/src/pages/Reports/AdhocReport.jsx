import React, { useState } from "react";
import { Loader2, FileBarChart2, RefreshCw, Search } from "lucide-react";
import { attendanceAPI } from "../../services/api";

const getStatusStyle = (status) => {
    switch (status) {
        case "Present": return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "Absent": return "bg-rose-50 text-rose-600 border-rose-100";
        case "Late": return "bg-amber-50 text-amber-600 border-amber-100";
        default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
};

const AdhocReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!startDate || !endDate) {
            setError("Please select both From and To dates.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError("From Date cannot be after To Date.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await attendanceAPI.getAll(`?startDate=${startDate}&endDate=${endDate}`);
            const allRecords = res.data || [];

            // Filter client-side by date range (handles both API-filtered and full responses)
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const filtered = allRecords.filter((item) => {
                const d = new Date(item.date || item.createdAt);
                return d >= start && d <= end;
            });

            setFilteredData(filtered);
            setGenerated(true);
        } catch (err) {
            setError("Failed to fetch attendance data. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        setFilteredData([]);
        setGenerated(false);
        setError("");
    };

    // Summary counts
    const summary = {
        Present: filteredData.filter(r => r.status === "Present").length,
        Absent: filteredData.filter(r => r.status === "Absent").length,
        Late: filteredData.filter(r => r.status === "Late").length,
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="bg-white shadow-sm rounded-[32px] border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/20">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <FileBarChart2 size={22} className="text-indigo-500" /> Adhoc Report
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Generate custom date-range attendance insights.</p>
                </div>

                <div className="p-4 sm:p-6 md:p-8">

                    {/* Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 items-end">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setError(""); }}
                                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setError(""); }}
                                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={14} />}
                            {loading ? "Generating..." : "Generate Report"}
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            <RefreshCw size={13} /> Reset
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-16">
                            <Loader2 className="animate-spin text-indigo-400" size={36} />
                        </div>
                    )}

                    {/* Summary badges (shown after generate) */}
                    {generated && !loading && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { label: "Present", val: summary.Present, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                                { label: "Absent", val: summary.Absent, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                                { label: "Late", val: summary.Late, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                            ].map(s => (
                                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3 text-center`}>
                                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Table */}
                    {generated && !loading && (
                        <div className="border border-slate-100 rounded-3xl overflow-hidden">
                            {filteredData.length === 0 ? (
                                <div className="p-14 text-center">
                                    <FileBarChart2 size={36} className="mx-auto mb-3 text-gray-200" />
                                    <p className="text-slate-400 font-bold text-sm">No attendance records found</p>
                                    <p className="text-slate-300 text-xs mt-1">Try a different date range</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                                <tr>
                                                    {["#", "Employee", "Date", "Check In", "Check Out", "Status"].map(h => (
                                                        <th key={h} className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredData.map((item, i) => (
                                                    <tr key={item._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="p-5 text-xs font-black text-slate-300">{i + 1}</td>
                                                        <td className="p-5 font-bold text-slate-700">
                                                            {item.employeeName || item.employee?.name || "—"}
                                                        </td>
                                                        <td className="p-5 text-sm font-medium text-slate-400 font-mono">
                                                            {item.date ? new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                                        </td>
                                                        <td className="p-5 text-sm font-medium text-slate-500">{item.checkIn || "—"}</td>
                                                        <td className="p-5 text-sm font-medium text-slate-500">{item.checkOut || "—"}</td>
                                                        <td className="p-5">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                                                {item.status || "Present"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile cards */}
                                    <div className="md:hidden divide-y divide-slate-50">
                                        {filteredData.map((item, i) => (
                                            <div key={item._id || i} className="p-5 bg-white space-y-2.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-black text-slate-800 text-sm">
                                                        {item.employeeName || item.employee?.name || "—"}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                                        {item.status || "Present"}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-400">
                                                    📅 {item.date ? new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                                </p>
                                                <div className="flex gap-4 text-xs text-slate-400 font-medium">
                                                    <span>In: <strong className="text-slate-600">{item.checkIn || "—"}</strong></span>
                                                    <span>Out: <strong className="text-slate-600">{item.checkOut || "—"}</strong></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Prompt to generate if not yet done */}
                    {!generated && !loading && (
                        <div className="border border-dashed border-slate-200 rounded-3xl p-14 text-center">
                            <FileBarChart2 size={36} className="mx-auto mb-3 text-slate-200" />
                            <p className="text-slate-400 font-bold text-sm">Select a date range and click Generate</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {generated && !loading && (
                    <div className="p-5 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Total Records: {filteredData.length} &nbsp;•&nbsp; {startDate} → {endDate}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdhocReport;