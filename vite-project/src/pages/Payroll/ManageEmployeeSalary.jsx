import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Loader2, Filter, Edit2, CheckCircle, X,
    Save, ChevronDown, AlertCircle
} from "lucide-react";
import { payrollAPI } from "../../services/api";

const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ManageEmployeeSalary() {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const perPage = 8;

    const showMsg = (text, type = "success") => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 4000);
    };

    useEffect(() => {
        payrollAPI.getAll()
            .then(r => setAllData(r.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const availableMonths = useMemo(() => {
        const s = new Set();
        allData.forEach(p => s.add(`${p.year}-${String(p.month).padStart(2, "0")}`));
        return [...s].sort((a, b) => b.localeCompare(a));
    }, [allData]);

    const filtered = useMemo(() =>
        allData.filter(r => {
            const name = (r.employeeName || "").toLowerCase();
            const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
            return (
                name.includes(search.toLowerCase()) &&
                (!monthFilter || key === monthFilter) &&
                (!statusFilter || r.status === statusFilter)
            );
        }), [allData, search, monthFilter, statusFilter]);

    useEffect(() => setPage(1), [filtered.length]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const pageData = filtered.slice((page - 1) * perPage, page * perPage);

    const summary = useMemo(() => filtered.reduce((acc, r) => ({
        count: acc.count + 1,
        net: acc.net + (r.netSalary || 0),
        paid: acc.paid + (r.status === "Paid" ? 1 : 0),
    }), { count: 0, net: 0, paid: 0 }), [filtered]);

    const startEdit = (r) => {
        setEditId(r._id);
        setEditForm({
            basicSalary: r.basicSalary || 0,
            allowances: r.allowances || 0,
            deductions: r.deductions || 0,
            tax: r.tax || 0,
            status: r.status || "Pending",
            note: r.note || "",
        });
    };

    const calcNet = (f) =>
        (Number(f.basicSalary) + Number(f.allowances)) - Number(f.deductions) - Number(f.tax);

    const saveEdit = async () => {
        setSaving(true);
        try {
            const body = { ...editForm, netSalary: calcNet(editForm) };
            const res = await payrollAPI.update(editId, body);
            setAllData(prev => prev.map(p => p._id === editId ? res.data : p));
            setEditId(null);
            showMsg("Record updated ✅");
        } catch (e) { showMsg("Update failed: " + e.message, "error"); }
        finally { setSaving(false); }
    };

    const markPaid = async (id) => {
        try {
            const res = await payrollAPI.update(id, { status: "Paid", paidOn: new Date() });
            setAllData(prev => prev.map(p => p._id === id ? res.data : p));
            showMsg("Marked as Paid ✅");
        } catch (e) { showMsg("Failed", "error"); }
    };

    const cancelEdit = () => setEditId(null);

    return (
        <section className="bg-[#f1f5f4] min-h-screen p-3 sm:p-5 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 mb-5 bg-white/60 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm">
                    {[
                        { label: "Salary Advance", path: "/Payroll/salary-advance", active: false },
                        { label: "Salary Generate", path: "/Payroll/salary-generate", active: false },
                        { label: "Manage Salary", path: null, active: true },
                    ].map(t => (
                        <button key={t.label} onClick={t.path ? () => navigate(t.path) : undefined}
                            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap
                ${t.active ? "bg-[#0a4d44] text-white shadow" : "text-slate-600 hover:bg-white"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Message */}
                {msg.text && (
                    <div className={`mb-4 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2
            ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />} {msg.text}
                    </div>
                )}

                {/* Summary */}
                {!loading && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                        {[
                            { l: "Records", v: summary.count, c: "text-slate-700", bg: "bg-white" },
                            { l: "Net Total", v: fmt(summary.net), c: "text-emerald-600", bg: "bg-emerald-50" },
                            { l: "Paid", v: `${summary.paid}/${summary.count}`, c: "text-blue-600", bg: "bg-blue-50" },
                        ].map(s => (
                            <div key={s.l} className={`${s.bg} border border-slate-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-center`}>
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">{s.l}</p>
                                <p className={`text-sm sm:text-lg font-black ${s.c} mt-0.5 truncate`}>{s.v}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="relative flex-1 min-w-[140px]">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-emerald-400" />
                    </div>
                    <div className="relative">
                        <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
                            className="pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:border-emerald-400 text-slate-600 appearance-none">
                            <option value="">All Months</option>
                            {availableMonths.map(m => {
                                const [y, mo] = m.split("-");
                                return <option key={m} value={m}>{MONTHS[parseInt(mo) - 1]} {y}</option>;
                            })}
                        </select>
                    </div>
                    <div className="relative">
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="pl-3 pr-7 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:border-emerald-400 text-slate-600 appearance-none">
                            <option value="">All Status</option>
                            <option>Pending</option><option>Paid</option><option>Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-400" size={32} /></div>
                    ) : pageData.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-slate-400 font-bold text-sm">
                                {allData.length === 0 ? "No payroll generated yet — go to Salary Generate first." : "No records match your filters."}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            {["Employee", "Month", "Basic", "Allowances", "Deductions", "Tax", "Net Salary", "Status", "Actions"].map(h => (
                                                <th key={h} className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {pageData.map(r =>
                                            editId === r._id ? (
                                                /* Edit row */
                                                <tr key={r._id} className="bg-emerald-50/20">
                                                    <td className="px-4 py-3 font-bold text-slate-800">{r.employeeName}</td>
                                                    <td className="px-4 py-3 text-slate-400 text-xs">{MONTHS[(r.month || 1) - 1]} {r.year}</td>
                                                    {["basicSalary", "allowances", "deductions", "tax"].map(f => (
                                                        <td key={f} className="px-4 py-3">
                                                            <input type="number" value={editForm[f]}
                                                                onChange={e => setEditForm(p => ({ ...p, [f]: e.target.value }))}
                                                                className="w-24 bg-white border border-emerald-200 rounded-lg px-2 py-1.5 text-sm font-bold outline-none focus:ring-1 ring-emerald-300" />
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-3">
                                                        <span className="font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg text-sm whitespace-nowrap">{fmt(calcNet(editForm))}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                                                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none">
                                                            <option>Pending</option><option>Paid</option><option>Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-1.5">
                                                            <button onClick={saveEdit} disabled={saving}
                                                                className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-black hover:bg-emerald-700 disabled:opacity-50">
                                                                {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />} Save
                                                            </button>
                                                            <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200">
                                                                <X size={13} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                /* Normal row */
                                                <tr key={r._id} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-4 py-3">
                                                        <p className="font-bold text-slate-800 whitespace-nowrap">{r.employeeName}</p>
                                                        <p className="text-[10px] text-slate-400">{r.employee?.employeeId || ""}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs font-bold whitespace-nowrap">{MONTHS[(r.month || 1) - 1]} {r.year}</td>
                                                    <td className="px-4 py-3 text-slate-600">{fmt(r.basicSalary)}</td>
                                                    <td className="px-4 py-3 text-blue-600 font-bold">+{fmt(r.allowances)}</td>
                                                    <td className="px-4 py-3 text-rose-500 font-bold">-{fmt(r.deductions)}</td>
                                                    <td className="px-4 py-3 text-amber-600 font-bold">-{fmt(r.tax)}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap">{fmt(r.netSalary)}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border whitespace-nowrap
                              ${r.status === "Paid" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                                r.status === "Cancelled" ? "bg-red-100 text-red-600 border-red-200" :
                                                                    "bg-amber-100 text-amber-700 border-amber-200"}`}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <button onClick={() => startEdit(r)} className="p-1.5 hover:bg-blue-50 text-blue-400 rounded-lg transition"><Edit2 size={13} /></button>
                                                            {r.status !== "Paid" && (
                                                                <button onClick={() => markPaid(r._id)}
                                                                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black transition whitespace-nowrap">
                                                                    Mark Paid
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {pageData.map(r =>
                                    editId === r._id ? (
                                        /* Mobile edit card */
                                        <div key={r._id} className="p-4 bg-emerald-50/20 space-y-3">
                                            <p className="font-black text-slate-800">{r.employeeName} — {MONTHS[(r.month || 1) - 1]} {r.year}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { l: "Basic", f: "basicSalary" },
                                                    { l: "Allowances", f: "allowances" },
                                                    { l: "Deductions", f: "deductions" },
                                                    { l: "Tax/TDS", f: "tax" },
                                                ].map(({ l, f }) => (
                                                    <div key={f}>
                                                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1">{l}</p>
                                                        <input type="number" value={editForm[f]}
                                                            onChange={e => setEditForm(p => ({ ...p, [f]: e.target.value }))}
                                                            className="w-full bg-white border border-emerald-200 rounded-lg px-2 py-2 text-sm font-bold outline-none focus:ring-1 ring-emerald-300" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black text-emerald-600">Net: {fmt(calcNet(editForm))}</span>
                                                <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                                                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                                                    <option>Pending</option><option>Paid</option><option>Cancelled</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={saveEdit} disabled={saving}
                                                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-black disabled:opacity-50">
                                                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
                                                </button>
                                                <button onClick={cancelEdit} className="flex-1 bg-slate-100 text-slate-500 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Mobile display card */
                                        <div key={r._id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0 mr-2">
                                                    <p className="font-black text-slate-800 truncate">{r.employeeName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{MONTHS[(r.month || 1) - 1]} {r.year}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase whitespace-nowrap
                            ${r.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                                                            r.status === "Cancelled" ? "bg-red-100 text-red-600" :
                                                                "bg-amber-100 text-amber-700"}`}>
                                                        {r.status}
                                                    </span>
                                                    <button onClick={() => startEdit(r)} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg shrink-0"><Edit2 size={12} /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-slate-50 rounded-xl px-3 py-2"><p className="text-[9px] text-slate-400 font-black uppercase">Basic</p><p className="font-bold text-slate-700">{fmt(r.basicSalary)}</p></div>
                                                <div className="bg-blue-50 rounded-xl px-3 py-2"><p className="text-[9px] text-blue-400 font-black uppercase">Allowances</p><p className="font-bold text-blue-600">+{fmt(r.allowances)}</p></div>
                                                <div className="bg-rose-50 rounded-xl px-3 py-2"><p className="text-[9px] text-rose-400 font-black uppercase">Deductions</p><p className="font-bold text-rose-500">-{fmt(r.deductions)}</p></div>
                                                <div className="bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100"><p className="text-[9px] text-emerald-500 font-black uppercase">Net Pay</p><p className="font-black text-emerald-600">{fmt(r.netSalary)}</p></div>
                                            </div>
                                            {r.status !== "Paid" && (
                                                <button onClick={() => markPaid(r._id)}
                                                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition">
                                                    Mark as Paid
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1.5 mt-4">
                        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-emerald-400 disabled:opacity-30">←</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-xl font-black text-xs transition-all
                  ${page === i + 1 ? "bg-[#0a4d44] text-white" : "bg-white border border-slate-200 text-slate-400 hover:border-emerald-400"}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-emerald-400 disabled:opacity-30">→</button>
                    </div>
                )}
            </div>
        </section>
    );
}