import React, { useState, useEffect, useMemo } from "react";
import { attendanceAPI, leaveAPI } from "../../services/api";
import {
    Loader2, Download, RefreshCw, Users, CheckCircle, XCircle,
    Clock, Calendar, FileText, TrendingUp, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────── */
const exportCSV = (rows, filename) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${r[h] ?? ""}"`).join(","))].join("\n");
    const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
        download: filename,
    });
    a.click();
};
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const WORK_START = "09:00";
const lateMinutes = (checkIn) => {
    if (!checkIn) return 0;
    const [h, m] = checkIn.split(":").map(Number);
    const [wh, wm] = WORK_START.split(":").map(Number);
    return Math.max(0, h * 60 + m - (wh * 60 + wm));
};
const getPolicy = (mins) => {
    if (mins <= 0) return { label: "On Time", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    if (mins <= 15) return { label: "Grace Period", cls: "bg-blue-50 text-blue-600 border-blue-100" };
    if (mins <= 60) return { label: "Fine Applied", cls: "bg-rose-50 text-rose-600 border-rose-100" };
    return { label: "Half Day", cls: "bg-purple-50 text-purple-600 border-purple-100" };
};
const calcHours = (i, o) => {
    if (!i || !o) return "—";
    try {
        const toM = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
        const d = toM(o) - toM(i);
        return d > 0 ? `${Math.floor(d / 60)}h ${d % 60}m` : "—";
    } catch { return "—"; }
};

/* ─── tiny reusable pieces ────────────────────────────── */
const Label = ({ children }) => (
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{children}</p>
);
const EmptyState = ({ icon: Icon, msg }) => (
    <div className="py-14 flex flex-col items-center gap-3">
        <Icon size={36} className="text-slate-200" />
        <p className="text-slate-400 font-bold text-sm text-center px-4">{msg}</p>
    </div>
);
const Spinner = ({ color = "text-slate-400" }) => (
    <div className="flex justify-center py-14">
        <Loader2 size={34} className={`animate-spin ${color}`} />
    </div>
);
const StatusBadge = ({ status }) => {
    const map = {
        Present: "bg-emerald-50 text-emerald-600",
        Late: "bg-amber-50 text-amber-600",
        Absent: "bg-rose-50 text-rose-600",
        Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Pending: "bg-amber-50 text-amber-600 border-amber-100",
        Rejected: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${map[status] || "bg-slate-50 text-slate-500"}`}>
            {status}
        </span>
    );
};
const Btn = ({ onClick, disabled, children, variant = "dark", cls = "" }) => {
    const base = "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 select-none whitespace-nowrap";
    const styles = {
        dark: "bg-slate-900 text-white hover:bg-slate-700 shadow-sm",
        green: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-100",
        indigo: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100",
        rose: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-100",
        ghost: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${cls}`}>
            {children}
        </button>
    );
};
const Input = ({ cls = "", ...props }) => (
    <input
        className={`bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition w-full ${cls}`}
        {...props}
    />
);
const Select = ({ cls = "", children, ...props }) => (
    <select className={`bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-indigo-400 transition text-slate-700 w-full ${cls}`} {...props}>
        {children}
    </select>
);
const MobileCard = ({ children, cls = "" }) => (
    <div className={`bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm ${cls}`}>
        {children}
    </div>
);

/* ─── TAB LIST ─────────────────────────────────────────── */
const TABS = [
    { id: "Attendance Report", short: "Summary" },
    { id: "Lateness Closing", short: "Lateness" },
    { id: "Attendance Log", short: "Log" },
    { id: "Daily Present", short: "Daily" },
    { id: "Monthly", short: "Monthly" },
    { id: "Leave Report", short: "Leave" },
];

/* ════════════════════════════════════════════════════
   MAIN SHELL
════════════════════════════════════════════════════ */
const AttendanceReport = () => {
    const [active, setActive] = useState("Attendance Report");
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-8 py-5 sm:py-7 md:py-10">
                <div className="mb-5 sm:mb-7">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Reports Dashboard
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Real-time attendance &amp; leave analytics</p>
                </div>

                {/* Scrollable tabs — short labels on xs, full labels on sm+ */}
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-5 sm:mb-7 no-scrollbar">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActive(t.id)}
                            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all
                ${active === t.id ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300"}`}>
                            <span className="sm:hidden">{t.short}</span>
                            <span className="hidden sm:inline">{t.id}</span>
                        </button>
                    ))}
                </div>

                {active === "Attendance Report" && <AttendanceSummary />}
                {active === "Lateness Closing" && <LatenessClosing />}
                {active === "Attendance Log" && <AttendanceLog />}
                {active === "Daily Present" && <DailyPresent />}
                {active === "Monthly" && <MonthlyReport />}
                {active === "Leave Report" && <LeaveReport />}
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════
   1. ATTENDANCE SUMMARY
════════════════════════════════════════════════════ */
const AttendanceSummary = () => {
    const today = new Date().toISOString().slice(0, 10);
    const [start, setStart] = useState(today);
    const [end, setEnd] = useState(today);
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await attendanceAPI.getAll(`?startDate=${start}&endDate=${end}`);
            setRecs((res.data || []).filter(r => { const d = r.date?.slice(0, 10); return d >= start && d <= end; }));
            setGenerated(true);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const byEmp = useMemo(() => {
        const map = {};
        recs.forEach(r => {
            const name = r.employeeName || r.employee?.name || "Unknown";
            if (!map[name]) map[name] = { name, dept: r.employee?.department?.name || "—", present: 0, absent: 0, late: 0 };
            const s = r.status || "Present";
            if (s === "Absent") map[name].absent++;
            else if (s === "Late") { map[name].late++; map[name].present++; }
            else map[name].present++;
        });
        return Object.values(map);
    }, [recs]);

    const totalPresent = recs.filter(r => r.status !== "Absent").length;
    const totalAbsent = recs.filter(r => r.status === "Absent").length;

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Filter card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-end">
                    <div className="col-span-1">
                        <Label>From</Label>
                        <Input type="date" value={start} onChange={e => setStart(e.target.value)} />
                    </div>
                    <div className="col-span-1">
                        <Label>To</Label>
                        <Input type="date" value={end} onChange={e => setEnd(e.target.value)} />
                    </div>
                    <div className="col-span-2 sm:col-span-auto flex gap-2">
                        <Btn onClick={generate} disabled={loading} variant="dark" cls="flex-1 sm:flex-none">
                            {loading ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
                            {loading ? "Loading…" : "Generate"}
                        </Btn>
                        {generated && (
                            <Btn variant="green" cls="flex-1 sm:flex-none"
                                onClick={() => exportCSV(byEmp, `attendance-${start}-${end}.csv`)}>
                                <Download size={12} /> CSV
                            </Btn>
                        )}
                    </div>
                </div>
            </div>

            {loading && <Spinner />}

            {generated && !loading && (
                <>
                    {/* KPI cards */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { l: "Employees", v: byEmp.length, c: "text-indigo-600", bg: "bg-indigo-50", icon: <Users size={16} /> },
                            { l: "Present", v: totalPresent, c: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle size={16} /> },
                            { l: "Absent", v: totalAbsent, c: "text-rose-600", bg: "bg-rose-50", icon: <XCircle size={16} /> },
                        ].map(s => (
                            <div key={s.l} className={`${s.bg} rounded-2xl p-3 sm:p-4 text-center`}>
                                <div className={`${s.c} flex justify-center mb-1`}>{s.icon}</div>
                                <p className={`text-xl sm:text-2xl md:text-3xl font-black ${s.c}`}>{s.v}</p>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{s.l}</p>
                            </div>
                        ))}
                    </div>

                    {/* Data panel */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="font-black text-slate-700 text-xs sm:text-sm uppercase tracking-widest">Staff Breakdown</h3>
                            <span className="text-[10px] text-slate-400 font-bold">{byEmp.length} employees</span>
                        </div>
                        {byEmp.length === 0 ? <EmptyState icon={Users} msg="No records for selected range" /> : (
                            <>
                                {/* Desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50">
                                            <tr>{["Employee", "Department", "Present", "Absent", "Late", "Attendance %"].map(h => (
                                                <th key={h} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                            ))}</tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {byEmp.map((e, i) => {
                                                const pct = ((e.present / Math.max(e.present + e.absent + e.late, 1)) * 100).toFixed(0);
                                                return (
                                                    <tr key={i} className="hover:bg-slate-50/50 transition">
                                                        <td className="p-4 font-bold text-slate-800">{e.name}</td>
                                                        <td className="p-4 text-slate-500 text-sm">{e.dept}</td>
                                                        <td className="p-4 text-center"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">{e.present}</span></td>
                                                        <td className="p-4 text-center"><span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-black">{e.absent}</span></td>
                                                        <td className="p-4 text-center"><span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">{e.late}</span></td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                                                                <span className="text-xs font-black text-slate-600 w-9 text-right">{pct}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile */}
                                <div className="md:hidden divide-y divide-slate-50">
                                    {byEmp.map((e, i) => {
                                        const pct = ((e.present / Math.max(e.present + e.absent + e.late, 1)) * 100).toFixed(0);
                                        return (
                                            <div key={i} className="p-4 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-black text-slate-800">{e.name}</p>
                                                    <span className="text-[10px] text-slate-400 font-bold">{e.dept}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { l: "Present", v: e.present, bg: "bg-emerald-50", c: "text-emerald-600" },
                                                        { l: "Absent", v: e.absent, bg: "bg-rose-50", c: "text-rose-600" },
                                                        { l: "Late", v: e.late, bg: "bg-amber-50", c: "text-amber-600" },
                                                    ].map(s => (
                                                        <div key={s.l} className={`${s.bg} rounded-xl p-2 text-center`}>
                                                            <p className={`text-[9px] font-black uppercase ${s.c}`}>{s.l}</p>
                                                            <p className={`font-black ${s.c}`}>{s.v}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                                                    <span className="text-xs font-black text-slate-600">{pct}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {!generated && !loading && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-14 text-center">
                    <TrendingUp size={36} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400 font-bold text-sm">Select date range and click Generate</p>
                </div>
            )}
        </div>
    );
};

/* ════════════════════════════════════════════════════
   2. LATENESS CLOSING
════════════════════════════════════════════════════ */
const LatenessClosing = () => {
    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await attendanceAPI.getAll(`?startDate=${date}&endDate=${date}`);
            setRecords((res.data || []).filter(r => r.date?.slice(0, 10) === date && r.checkIn));
            setFetched(true);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const processAll = async () => {
        const late = records.filter(r => lateMinutes(r.checkIn) > 15);
        if (!late.length) { alert("No fines to process for this date."); return; }
        setProcessing(true);
        await Promise.allSettled(late.map(r => attendanceAPI.update(r._id, { status: "Late" })));
        await load();
        setProcessing(false);
        alert(`Processed fines for ${late.length} employee(s).`);
    };

    const lateRows = records.filter(r => lateMinutes(r.checkIn) > 0);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-50 bg-slate-50/20">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-rose-500" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base sm:text-lg font-black text-slate-800 truncate">Lateness Closing</h2>
                            <p className="text-[10px] sm:text-xs text-slate-400">Late arrivals after {WORK_START} · Grace 15 min</p>
                        </div>
                    </div>
                    {/* Controls */}
                    <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-2">
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} cls="col-span-1 sm:w-40" />
                        <Btn onClick={load} disabled={loading} variant="dark" cls="col-span-1">
                            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Load
                        </Btn>
                        {fetched && (
                            <Btn onClick={processAll} disabled={processing} variant="rose" cls="col-span-2 sm:col-span-auto">
                                {processing ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
                                Process All Fines
                            </Btn>
                        )}
                    </div>
                </div>
            </div>

            {loading ? <Spinner color="text-rose-400" />
                : !fetched ? <EmptyState icon={Calendar} msg="Select a date and click Load" />
                    : lateRows.length === 0 ? (
                        <div className="py-14 flex flex-col items-center gap-2">
                            <CheckCircle size={36} className="text-emerald-300" />
                            <p className="text-slate-400 font-bold text-sm">No late arrivals on {date} 🎉</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-50">
                                        <tr>{["Employee", "Check In", "Delay", "Policy", "Status", "Action"].map(h => (
                                            <th key={h} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {lateRows.map(r => {
                                            const mins = lateMinutes(r.checkIn); const pol = getPolicy(mins);
                                            return (
                                                <tr key={r._id} className="hover:bg-slate-50/50 transition">
                                                    <td className="p-4 font-bold text-slate-800">{r.employeeName || r.employee?.name || "—"}</td>
                                                    <td className="p-4 font-mono text-sm text-slate-600">{r.checkIn}</td>
                                                    <td className="p-4"><span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-black">+{mins} min</span></td>
                                                    <td className="p-4 text-sm text-slate-500">{mins <= 15 ? "Grace 15m" : mins <= 60 ? "Fine" : "Half Day"}</td>
                                                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${pol.cls}`}>{pol.label}</span></td>
                                                    <td className="p-4">
                                                        <button onClick={async () => { await attendanceAPI.update(r._id, { status: "Late" }); await load(); }}
                                                            className="text-[10px] font-black uppercase text-indigo-600 border-2 border-slate-100 hover:border-indigo-400 px-4 py-2 rounded-xl transition">
                                                            Reconcile
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile cards */}
                            <div className="md:hidden p-3 space-y-2.5">
                                {lateRows.map(r => {
                                    const mins = lateMinutes(r.checkIn); const pol = getPolicy(mins);
                                    return (
                                        <MobileCard key={r._id}>
                                            <div className="flex justify-between items-center">
                                                <p className="font-black text-slate-800 text-sm">{r.employeeName || r.employee?.name || "—"}</p>
                                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border uppercase ${pol.cls}`}>{pol.label}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap text-xs">
                                                <span className="text-slate-500">Check In: <strong className="font-mono text-slate-700">{r.checkIn}</strong></span>
                                                <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg font-black">+{mins} min</span>
                                            </div>
                                            <button onClick={async () => { await attendanceAPI.update(r._id, { status: "Late" }); await load(); }}
                                                className="w-full py-2 text-xs font-black uppercase bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition">
                                                Reconcile
                                            </button>
                                        </MobileCard>
                                    );
                                })}
                            </div>
                        </>
                    )}

            <div className="bg-indigo-600 py-2.5 text-center">
                <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">
                    Work Start: {WORK_START} · Grace: 15 min · Fine threshold: &gt;15 min
                </p>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════
   3. ATTENDANCE LOG
════════════════════════════════════════════════════ */
const AttendanceLog = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sel, setSel] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        attendanceAPI.getAll("?limit=60")
            .then(r => setRecords((r.data || []).sort((a, b) => new Date(b.date) - new Date(a.date))))
            .catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = records.filter(r =>
        (r.employeeName || r.employee?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-7 bg-indigo-600 rounded-full shrink-0" />
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-800">Attendance Log</h2>
                        <p className="text-[10px] sm:text-xs text-slate-400">All punch-in / punch-out records</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Input placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)} cls="flex-1 sm:w-48" />
                    <Btn variant="dark"
                        onClick={() => exportCSV(filtered.map(r => ({ Name: r.employeeName || r.employee?.name || "", Date: r.date?.slice(0, 10) || "", CheckIn: r.checkIn || "", CheckOut: r.checkOut || "", Status: r.status || "" })), "attendance-log.csv")}>
                        <Download size={12} /><span className="hidden sm:inline">CSV</span>
                    </Btn>
                </div>
            </div>

            {loading ? <Spinner color="text-indigo-400" />
                : filtered.length === 0 ? <EmptyState icon={FileText} msg="No records found" />
                    : (
                        <div className="divide-y divide-slate-50">
                            {filtered.map(r => {
                                const mins = lateMinutes(r.checkIn);
                                const status = r.status || (mins > 15 ? "Late" : r.checkIn ? "Present" : "Absent");
                                const hours = calcHours(r.checkIn, r.checkOut);
                                const open = sel?._id === r._id;
                                return (
                                    <div key={r._id} className="group hover:bg-slate-50/40 transition">
                                        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                            {/* Name / status */}
                                            <div className="sm:w-40 shrink-0">
                                                <p className="font-black text-slate-800 text-sm leading-tight">{r.employeeName || r.employee?.name || "—"}</p>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5
                        ${status === "Present" ? "text-emerald-500" : status === "Late" ? "text-amber-500" : "text-rose-500"}`}>
                                                    ● {status}
                                                </p>
                                            </div>
                                            {/* Date / times */}
                                            <div className="grid grid-cols-3 gap-2 sm:gap-6 flex-1">
                                                <div><Label>Date</Label><p className="text-xs font-bold text-slate-600 font-mono leading-tight">{r.date?.slice(0, 10) || "—"}</p></div>
                                                <div><Label>Check In</Label><p className="text-xs font-bold text-slate-700">{r.checkIn || "—"}</p></div>
                                                <div><Label>Check Out</Label><p className="text-xs font-bold text-slate-700">{r.checkOut || "—"}</p></div>
                                            </div>
                                            {/* Hours + Details */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{hours}</span>
                                                <button onClick={() => setSel(open ? null : r)}
                                                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest py-2 px-3 sm:px-5 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Details
                                                </button>
                                            </div>
                                        </div>
                                        {open && (
                                            <div className="mx-3 sm:mx-4 mb-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {[
                                                    { l: "Employee ID", v: r.employee?.employeeId || "—" },
                                                    { l: "Department", v: r.employee?.department?.name || "—" },
                                                    { l: "Working Hours", v: hours, c: "text-indigo-600" },
                                                    { l: "Delay", v: mins > 0 ? `+${mins} min` : "On Time", c: mins > 15 ? "text-rose-500" : "text-emerald-600" },
                                                ].map(d => (
                                                    <div key={d.l}>
                                                        <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{d.l}</p>
                                                        <p className={`text-sm font-bold ${d.c || "text-slate-700"}`}>{d.v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
        </div>
    );
};

/* ════════════════════════════════════════════════════
   4. DAILY PRESENT
════════════════════════════════════════════════════ */
const DailyPresent = () => {
    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [search, setSearch] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await attendanceAPI.getAll(`?startDate=${date}&endDate=${date}`);
            setRecords((res.data || []).filter(r => r.date?.slice(0, 10) === date));
            setFetched(true);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filtered = records.filter(r => (r.employeeName || r.employee?.name || "").toLowerCase().includes(search.toLowerCase()));
    const present = filtered.filter(r => r.status !== "Absent").length;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-50 bg-slate-50/20">
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-800">Daily Present Report</h2>
                        <p className="text-[10px] sm:text-xs text-slate-400">Real-time attendance tracking for selected date</p>
                    </div>
                    {/* 2-col grid on xs, flex row on sm+ */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} cls="col-span-1" />
                        <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} cls="col-span-1" />
                        <Btn onClick={load} disabled={loading} variant="green" cls="col-span-1">
                            {loading ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />} Generate
                        </Btn>
                        {fetched && (
                            <Btn variant="ghost" cls="col-span-1"
                                onClick={() => exportCSV(filtered.map(r => ({ Name: r.employeeName || r.employee?.name || "", Dept: r.employee?.department?.name || "", Date: date, CheckIn: r.checkIn || "", CheckOut: r.checkOut || "", Status: r.status || "Present" })), "daily-present.csv")}>
                                <Download size={12} /> CSV
                            </Btn>
                        )}
                    </div>
                </div>
            </div>

            {fetched && !loading && (
                <div className="flex gap-3 sm:gap-5 px-4 py-2.5 border-b border-slate-50 bg-slate-50/30 text-xs font-black">
                    <span className="text-emerald-600">{present} Present</span>
                    <span className="text-rose-500">{filtered.length - present} Absent</span>
                    <span className="text-slate-400">{filtered.length} Total</span>
                </div>
            )}

            {loading ? <Spinner color="text-emerald-400" />
                : !fetched ? <EmptyState icon={Calendar} msg="Select a date and click Generate" />
                    : filtered.length === 0 ? <EmptyState icon={Users} msg={`No records for ${date}`} />
                        : (
                            <>
                                {/* Desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50">
                                            <tr>{["#", "Employee", "Department", "Date", "Check In", "Check Out", "Status"].map(h => (
                                                <th key={h} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                            ))}</tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filtered.map((r, i) => {
                                                const status = r.status || (lateMinutes(r.checkIn) > 15 ? "Late" : "Present");
                                                return (
                                                    <tr key={r._id} className="hover:bg-slate-50/50 transition">
                                                        <td className="p-4 text-xs font-black text-slate-300">{i + 1}</td>
                                                        <td className="p-4"><p className="font-black text-slate-800 text-sm">{r.employeeName || r.employee?.name || "—"}</p><p className="text-[10px] text-indigo-500 font-bold">{r.employee?.employeeId || ""}</p></td>
                                                        <td className="p-4 text-slate-500 text-sm">{r.employee?.department?.name || "—"}</td>
                                                        <td className="p-4 text-xs text-slate-400 font-mono">{date}</td>
                                                        <td className="p-4 text-sm font-black text-slate-700">{r.checkIn || "—"}</td>
                                                        <td className="p-4 text-sm font-black text-slate-700">{r.checkOut || "—"}</td>
                                                        <td className="p-4"><StatusBadge status={status} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile */}
                                <div className="md:hidden p-3 space-y-2.5">
                                    {filtered.map(r => {
                                        const status = r.status || (lateMinutes(r.checkIn) > 15 ? "Late" : "Present");
                                        return (
                                            <MobileCard key={r._id}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm">{r.employeeName || r.employee?.name || "—"}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold">{r.employee?.department?.name || "—"}</p>
                                                    </div>
                                                    <StatusBadge status={status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                                    <div><Label>Check In</Label><p className="text-sm font-bold text-slate-700">{r.checkIn || "—"}</p></div>
                                                    <div><Label>Check Out</Label><p className="text-sm font-bold text-slate-700">{r.checkOut || "—"}</p></div>
                                                </div>
                                            </MobileCard>
                                        );
                                    })}
                                </div>
                            </>
                        )}
        </div>
    );
};

/* ════════════════════════════════════════════════════
   5. MONTHLY REPORT
════════════════════════════════════════════════════ */
const MonthlyReport = () => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    const generate = async () => {
        const [y, m] = month.split("-");
        const lastDay = new Date(+y, +m, 0).getDate();
        const start = `${y}-${m}-01`, end = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
        setLoading(true);
        try {
            const res = await attendanceAPI.getAll(`?startDate=${start}&endDate=${end}`);
            setRecords(res.data || []); setFetched(true);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const [y, m] = month.split("-");
    const workDays = new Date(+y, +m, 0).getDate();

    const byEmp = useMemo(() => {
        const map = {};
        records.forEach(r => {
            const name = r.employeeName || r.employee?.name || "Unknown";
            const dept = r.employee?.department?.name || "—";
            if (!map[name]) map[name] = { name, dept, present: 0, absent: 0, late: 0 };
            const s = r.status || (lateMinutes(r.checkIn) > 15 ? "Late" : "Present");
            if (s === "Absent") map[name].absent++;
            else if (s === "Late") { map[name].late++; map[name].present++; }
            else map[name].present++;
        });
        return Object.values(map).sort((a, b) => b.present - a.present);
    }, [records]);

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Controls */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-end">
                    <div className="col-span-2 sm:col-span-auto sm:flex-1">
                        <Label>Select Month</Label>
                        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} />
                    </div>
                    <div className="col-span-2 sm:col-span-auto flex gap-2">
                        <Btn onClick={generate} disabled={loading} variant="indigo" cls="flex-1 sm:flex-none">
                            {loading ? <Loader2 size={12} className="animate-spin" /> : <Calendar size={12} />}
                            {loading ? "Loading…" : "Generate"}
                        </Btn>
                        {fetched && (
                            <Btn variant="ghost" cls="flex-1 sm:flex-none"
                                onClick={() => exportCSV(byEmp.map(e => ({ ...e, workDays, pct: ((e.present / workDays) * 100).toFixed(1) + "%" })), "monthly-report.csv")}>
                                <Download size={12} /> CSV
                            </Btn>
                        )}
                    </div>
                </div>
            </div>

            {loading && <Spinner color="text-indigo-400" />}

            {fetched && !loading && (
                byEmp.length === 0 ? <EmptyState icon={Calendar} msg={`No records for ${month}`} /> : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>{["Employee", "Dept", "Work Days", "Present", "Absent", "Late", "Score"].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {byEmp.map((e, i) => {
                                        const score = ((e.present / workDays) * 100).toFixed(1);
                                        return (
                                            <tr key={i} className="hover:bg-slate-50/50 transition">
                                                <td className="px-5 py-4 font-black text-slate-800">{e.name}</td>
                                                <td className="px-5 py-4 text-slate-500 text-sm">{e.dept}</td>
                                                <td className="px-5 py-4 text-center font-bold text-slate-600">{workDays}</td>
                                                <td className="px-5 py-4 text-center"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">{e.present}</span></td>
                                                <td className="px-5 py-4 text-center"><span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-black">{e.absent}</span></td>
                                                <td className="px-5 py-4 text-center"><span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">{e.late}</span></td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score}%` }} /></div>
                                                        <span className="text-sm font-black text-slate-700 w-12 text-right">{score}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile */}
                        <div className="md:hidden space-y-3">
                            {byEmp.map((e, i) => {
                                const score = ((e.present / workDays) * 100).toFixed(1);
                                return (
                                    <MobileCard key={i}>
                                        <div className="flex justify-between items-start">
                                            <div><p className="font-black text-slate-800">{e.name}</p><p className="text-xs text-indigo-500 font-semibold">{e.dept}</p></div>
                                            <div className="text-right"><p className="text-[10px] text-slate-400 font-bold">Attendance</p><p className="text-xl font-black text-slate-900">{score}%</p></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { l: "Present", v: e.present, bg: "bg-emerald-50", c: "text-emerald-600" },
                                                { l: "Absent", v: e.absent, bg: "bg-rose-50", c: "text-rose-600" },
                                                { l: "Late", v: e.late, bg: "bg-amber-50", c: "text-amber-600" },
                                            ].map(s => (
                                                <div key={s.l} className={`${s.bg} rounded-xl p-2 text-center`}>
                                                    <p className={`text-[9px] font-black uppercase ${s.c}`}>{s.l}</p>
                                                    <p className={`font-black ${s.c}`}>{s.v}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score}%` }} /></div>
                                    </MobileCard>
                                );
                            })}
                        </div>
                    </>
                )
            )}

            {!fetched && !loading && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-14 text-center">
                    <Calendar size={36} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400 font-bold text-sm">Select a month and click Generate</p>
                </div>
            )}
        </div>
    );
};

/* ════════════════════════════════════════════════════
   6. LEAVE REPORT
════════════════════════════════════════════════════ */
const LEAVE_CLS = {
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100",
};

const LeaveReport = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sel, setSel] = useState(null);
    const [page, setPage] = useState(1);
    const PER = 10;

    useEffect(() => {
        leaveAPI.getAll().then(r => setLeaves(r.data || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() =>
        leaves.filter(l => {
            const name = (l.employeeName || l.employee?.name || "").toLowerCase();
            return name.includes(search.toLowerCase()) && (!status || l.status === status);
        }), [leaves, search, status]
    );
    useEffect(() => setPage(1), [filtered.length]);

    const pageData = filtered.slice((page - 1) * PER, page * PER);
    const totalPages = Math.ceil(filtered.length / PER);
    const sum = {
        total: leaves.length,
        approved: leaves.filter(l => l.status === "Approved").length,
        pending: leaves.filter(l => l.status === "Pending").length,
        rejected: leaves.filter(l => l.status === "Rejected").length,
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-50 bg-slate-50/20">
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-800">Leave Report</h2>
                        <p className="text-[10px] sm:text-xs text-slate-400">All employee leave applications</p>
                    </div>
                    {/* Filters: 2-col on xs, flex on sm+ */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Input placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)} cls="col-span-2 sm:col-auto sm:w-48" />
                        <Select value={status} onChange={e => setStatus(e.target.value)} cls="col-span-1 sm:w-36">
                            <option value="">All Status</option>
                            <option>Pending</option><option>Approved</option><option>Rejected</option>
                        </Select>
                        <Btn variant="dark" cls="col-span-1 sm:col-auto"
                            onClick={() => exportCSV(filtered.map(l => ({ Name: l.employeeName || l.employee?.name || "", Type: l.type || "", StartDate: l.startDate?.slice(0, 10) || "", EndDate: l.endDate?.slice(0, 10) || "", Days: l.days || "", Status: l.status || "" })), "leave-report.csv")}>
                            <Download size={12} /> CSV
                        </Btn>
                    </div>
                </div>
            </div>

            {/* Summary strip */}
            {!loading && (
                <div className="grid grid-cols-4 gap-px bg-slate-100 border-b border-slate-100">
                    {[
                        { l: "Total", v: sum.total, c: "text-slate-700", bg: "bg-white" },
                        { l: "Approved", v: sum.approved, c: "text-emerald-600", bg: "bg-emerald-50" },
                        { l: "Pending", v: sum.pending, c: "text-amber-600", bg: "bg-amber-50" },
                        { l: "Rejected", v: sum.rejected, c: "text-rose-600", bg: "bg-rose-50" },
                    ].map(s => (
                        <div key={s.l} className={`${s.bg} px-2 py-3 text-center`}>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{s.l}</p>
                            <p className={`text-base sm:text-lg font-black ${s.c}`}>{s.v}</p>
                        </div>
                    ))}
                </div>
            )}

            {loading ? <Spinner color="text-indigo-400" />
                : pageData.length === 0 ? <EmptyState icon={FileText} msg="No records found" />
                    : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-50">
                                        <tr>{["Employee", "Department", "Leave Type", "Duration", "Days", "Status", ""].map(h => (
                                            <th key={h} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {pageData.map(l => (
                                            <tr key={l._id} className="hover:bg-slate-50/50 transition">
                                                <td className="p-4 font-bold text-slate-800">{l.employeeName || l.employee?.name || "—"}</td>
                                                <td className="p-4 text-slate-500 text-sm">{l.employee?.department?.name || "—"}</td>
                                                <td className="p-4 font-bold text-slate-700 text-sm">{l.type}</td>
                                                <td className="p-4 text-[11px] font-black text-indigo-500 font-mono whitespace-nowrap">{l.startDate?.slice(0, 10) || "—"} → {l.endDate?.slice(0, 10) || "—"}</td>
                                                <td className="p-4 text-center font-black text-slate-600">{l.days || "—"}</td>
                                                <td className="p-4"><StatusBadge status={l.status} /></td>
                                                <td className="p-4">
                                                    <button onClick={() => setSel(sel?._id === l._id ? null : l)}
                                                        className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-600 hover:underline px-2">
                                                        {sel?._id === l._id ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {sel && (
                                    <div className="mx-4 mb-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { l: "Employee", v: sel.employeeName || sel.employee?.name || "—" },
                                            { l: "Leave Type", v: sel.type },
                                            { l: "Days", v: sel.days || "—", c: "text-indigo-600" },
                                            { l: "Applied On", v: fmt(sel.applyDate) },
                                        ].map(d => (
                                            <div key={d.l}>
                                                <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{d.l}</p>
                                                <p className={`font-bold text-sm ${d.c || "text-slate-800"}`}>{d.v}</p>
                                            </div>
                                        ))}
                                        <div className="col-span-2 sm:col-span-4">
                                            <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Reason</p>
                                            <p className="text-sm text-slate-700">{sel.reason || "—"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile cards */}
                            <div className="md:hidden p-3 space-y-2.5">
                                {pageData.map(l => (
                                    <MobileCard key={l._id}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{l.employeeName || l.employee?.name || "—"}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{l.employee?.department?.name || "—"}</p>
                                            </div>
                                            <StatusBadge status={l.status} />
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700">{l.type}</span>
                                            <span className="text-[10px] font-black text-indigo-500 font-mono">{l.startDate?.slice(0, 10) || "—"}</span>
                                        </div>
                                        <button onClick={() => setSel(sel?._id === l._id ? null : l)}
                                            className="w-full py-2 text-xs font-black uppercase bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition flex items-center justify-center gap-1">
                                            {sel?._id === l._id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                            {sel?._id === l._id ? "Close" : "View Details"}
                                        </button>
                                        {sel?._id === l._id && (
                                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-xs space-y-1.5">
                                                <p><span className="text-slate-400 font-bold">Days:</span> <strong className="text-indigo-600">{l.days || "—"}</strong></p>
                                                <p><span className="text-slate-400 font-bold">Applied:</span> {fmt(l.applyDate)}</p>
                                                <p><span className="text-slate-400 font-bold">End Date:</span> {l.endDate?.slice(0, 10) || "—"}</p>
                                                <p><span className="text-slate-400 font-bold">Reason:</span> {l.reason || "—"}</p>
                                            </div>
                                        )}
                                    </MobileCard>
                                ))}
                            </div>
                        </>
                    )}

            {/* Footer / pagination */}
            <div className="p-3 sm:p-4 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
                {totalPages > 1 && (
                    <div className="flex gap-1.5 flex-wrap justify-center">
                        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 disabled:opacity-30">←</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)}
                                className={`w-8 h-8 rounded-xl text-xs font-black ${page === i + 1 ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-400"}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 disabled:opacity-30">→</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceReport;