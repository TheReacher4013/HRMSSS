import { useState, useEffect, useMemo } from "react";
import { Download, Loader2, AlertCircle, Search, Calendar, Clock, FileText } from "lucide-react";
import { attendanceAPI } from "../../../services/api";

// ── Proper UTF-8 CSV download (no hashed/garbled output) ──────────
const downloadCSV = (rows, filename) => {
    if (!rows.length) return;
    const headers = ["Date", "Check In", "Check Out", "Working Hours", "Status", "Note"];
    const data = rows.map(r => {
        const date = r.date?.slice(0, 10) || "";
        const checkIn = r.checkIn || "—";
        const checkOut = r.checkOut || "—";
        const hours = calcHours(r.checkIn, r.checkOut);
        return [date, checkIn, checkOut, hours, r.status, r.note || ""].map(v => `"${String(v).replace(/"/g, '""')}"`);
    });
    const csv = [headers.join(","), ...data.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};

const calcHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "—";
    const toMin = t => {
        const [h, m] = t.replace(/(AM|PM)/i, "").trim().split(":").map(Number);
        const isPm = /PM/i.test(t);
        return (isPm && h !== 12 ? h + 12 : (!isPm && h === 12 ? 0 : h)) * 60 + (m || 0);
    };
    const diff = toMin(checkOut) - toMin(checkIn);
    if (diff <= 0) return "—";
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const STATUS_COLORS = {
    Present: "text-emerald-500",
    Absent: "text-red-500",
    Late: "text-amber-500",
    "Half Day": "text-blue-500",
    Holiday: "text-purple-500",
};

const STATUS_BG = {
    Present: "bg-emerald-50 text-emerald-700",
    Absent: "bg-red-50 text-red-600",
    Late: "bg-amber-50 text-amber-700",
    "Half Day": "bg-blue-50 text-blue-700",
    Holiday: "bg-purple-50 text-purple-700",
};

export default function AttendanceLog() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });

    // Get current user from localStorage
    const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();

    useEffect(() => {
        setLoading(true);
        const [y, m] = month.split("-");
        // User sees only their own attendance (filter by employee name match if possible)
        attendanceAPI.getAll(`?year=${y}&month=${m}`)
            .then(r => {
                let data = r.data || [];
                // Filter for current user if employee name matches
                if (user?.name) {
                    const matched = data.filter(a => a.employee?.name?.toLowerCase() === user.name.toLowerCase());
                    data = matched.length > 0 ? matched : data;
                }
                setRows(data);
            })
            .catch(() => setError("Failed to load attendance."))
            .finally(() => setLoading(false));
    }, [month]);

    const filtered = useMemo(() => rows.filter(r =>
        !search || `${r.date} ${r.status} ${r.checkIn} ${r.checkOut}`.toLowerCase().includes(search.toLowerCase())
    ), [rows, search]);

    // Summary stats
    const stats = useMemo(() => ({
        present: rows.filter(r => r.status === "Present").length,
        absent: rows.filter(r => r.status === "Absent").length,
        late: rows.filter(r => r.status === "Late").length,
        halfDay: rows.filter(r => r.status === "Half Day").length,
    }), [rows]);

    return (
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-100">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-indigo-600 rounded-full" />
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Attendance History</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Log Activity</p>
                    </div>
                </div>
                <button
                    onClick={() => downloadCSV(filtered, `attendance-${month}.csv`)}
                    disabled={!filtered.length}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wide hover:bg-indigo-700 transition active:scale-95 disabled:opacity-40 shadow-sm">
                    <Download size={14} /> Download CSV
                </button>
            </div>

            {/* Month picker + search */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 ring-indigo-100 font-bold text-slate-600" />
                </div>
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 ring-indigo-100" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[["Present", stats.present, "emerald"], ["Absent", stats.absent, "red"], ["Late", stats.late, "amber"], ["Half Day", stats.halfDay, "blue"]].map(([l, v, c]) => (
                    <div key={l} className={`bg-${c}-50 rounded-2xl p-4 border border-${c}-100`}>
                        <p className={`text-[10px] font-black uppercase text-${c}-600`}>{l}</p>
                        <p className={`text-2xl font-black text-${c}-700 mt-1`}>{v}</p>
                    </div>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold mb-6">
                    <AlertCircle size={16} />{error}
                </div>
            )}

            {/* Log List */}
            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500" size={30} /></div>
            ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                    <FileText className="mx-auto mb-3 text-slate-200" size={36} />
                    <p className="font-bold">No records for this period</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((log) => {
                        const hours = calcHours(log.checkIn, log.checkOut);
                        return (
                            <div key={log._id} className="group p-5 bg-white border border-slate-100 rounded-[28px] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                    {/* Date & Status */}
                                    <div className="min-w-[160px]">
                                        <p className="text-base font-black text-slate-800">{log.date?.slice(0, 10)}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[log.status] || "text-slate-400"}`}>
                                            ● {log.status}
                                        </span>
                                        {log.employee?.name && (
                                            <p className="text-[10px] text-slate-400 mt-0.5">{log.employee.name}</p>
                                        )}
                                    </div>

                                    {/* Timings */}
                                    <div className="grid grid-cols-3 gap-6 flex-1">
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Check In</p>
                                            <p className="text-sm font-bold text-slate-700">{log.checkIn || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Check Out</p>
                                            <p className="text-sm font-bold text-slate-700">{log.checkOut || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Hours</p>
                                            <p className="text-sm font-black text-indigo-600 flex items-center gap-1"><Clock size={11} />{hours}</p>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl ${STATUS_BG[log.status] || "bg-gray-100 text-gray-500"}`}>
                                        {log.status}
                                    </span>
                                </div>
                                {log.note && (
                                    <p className="mt-2 text-xs text-slate-400 italic pl-1">Note: {log.note}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer */}
            {filtered.length > 0 && (
                <div className="mt-8 flex justify-between items-center">
                    <p className="text-xs text-slate-400">{filtered.length} records for {month}</p>
                    <button onClick={() => downloadCSV(filtered, `attendance-${month}.csv`)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-800 bg-white border-2 border-indigo-50 px-6 py-3 rounded-full hover:bg-indigo-50 transition-all shadow-sm flex items-center gap-2">
                        <Download size={12} /> Download CSV
                    </button>
                </div>
            )}
        </div>
    );
}