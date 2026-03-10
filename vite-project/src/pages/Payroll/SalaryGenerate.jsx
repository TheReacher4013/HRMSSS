import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar, Search, ArrowRight, Loader2, AlertCircle,
    CheckCircle, Users, Trash2, ChevronDown, ChevronUp, Info, Save, X
} from "lucide-react";
import { employeeAPI, payrollAPI } from "../../services/api";

const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const calcTax = (annual) => {
    if (annual <= 300000) return 0;
    if (annual <= 600000) return (annual - 300000) * 0.05;
    if (annual <= 900000) return 15000 + (annual - 600000) * 0.10;
    if (annual <= 1200000) return 45000 + (annual - 900000) * 0.15;
    if (annual <= 1500000) return 90000 + (annual - 1200000) * 0.20;
    return 150000 + (annual - 1500000) * 0.30;
};

const TABS = (navigate) => [
    { label: "Salary Advance", onClick: () => navigate("/Payroll/salary-advance"), active: false },
    { label: "Salary Generate", onClick: null, active: true },
    { label: "Manage Salary", onClick: () => navigate("/Payroll/manage-employee-salary"), active: false },
];

export function SalaryGenerate() {
    const navigate = useNavigate();
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [employees, setEmployees] = useState([]);
    const [preview, setPreview] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const perPage = 5;

    const showMsg = (text, type = "success") => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 5000);
    };

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [empRes, payRes] = await Promise.all([employeeAPI.getAll(), payrollAPI.getAll()]);
            setEmployees(empRes.data || []);
            setHistory(payRes.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchAll(); }, []);

    const handlePreview = () => {
        if (!month) { showMsg("Select a month first.", "error"); return; }
        const [yr, mo] = month.split("-");
        if (history.some(p => String(p.year) === yr && Number(p.month) === parseInt(mo))) {
            showMsg(`Payroll for ${MONTHS[parseInt(mo) - 1]} ${yr} already generated.`, "error");
            return;
        }
        const rows = employees.filter(e => e.status === "Active").map(e => {
            const basic = e.salary || 0;
            const hra = Math.round(basic * 0.40);
            const ta = Math.round(basic * 0.10);
            const allowances = hra + ta;
            const pf = Math.round(basic * 0.12);
            const esi = basic <= 21000 ? Math.round(basic * 0.0075) : 0;
            const deductions = pf + esi;
            const tax = Math.round(calcTax(basic * 12) / 12);
            return {
                _empId: e._id, employeeName: e.name, position: e.position || "",
                basicSalary: basic, hra, ta, allowances, pf, esi, deductions, tax,
                netSalary: basic + allowances - deductions - tax, note: "",
            };
        });
        setPreview(rows);
        setShowPreview(true);
    };

    const updateRow = (idx, field, val) => {
        setPreview(prev => {
            const rows = [...prev];
            const r = { ...rows[idx], [field]: Number(val) || 0 };
            r.allowances = r.hra + r.ta;
            r.deductions = r.pf + r.esi;
            r.netSalary = r.basicSalary + r.allowances - r.deductions - r.tax;
            rows[idx] = r;
            return rows;
        });
    };

    const handleSave = async () => {
        const [yr, mo] = month.split("-");
        setSaving(true);
        try {
            const results = await Promise.allSettled(preview.map(r =>
                payrollAPI.create({
                    employee: r._empId, employeeName: r.employeeName,
                    month: parseInt(mo), year: parseInt(yr),
                    basicSalary: r.basicSalary, allowances: r.allowances,
                    deductions: r.deductions, tax: r.tax, netSalary: r.netSalary,
                    note: r.note, status: "Pending",
                })
            ));
            const ok = results.filter(r => r.status === "fulfilled").length;
            const bad = results.filter(r => r.status === "rejected").length;
            showMsg(`✅ Payroll saved! ${ok} records created${bad ? `, ${bad} failed` : ""}.`);
            setShowPreview(false);
            setPreview([]);
            setMonth(new Date().toISOString().slice(0, 7));
            await fetchAll();
        } catch (e) { showMsg("Failed to save: " + e.message, "error"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (records) => {
        if (!window.confirm("Delete this entire payroll batch?")) return;
        try {
            await Promise.all(records.map(r => payrollAPI.delete(r._id)));
            await fetchAll();
            showMsg("Batch deleted.");
        } catch (e) { showMsg("Delete failed.", "error"); }
    };

    const grouped = useMemo(() => {
        const map = {};
        history.forEach(p => {
            const key = `${p.year}-${String(p.month).padStart(2, "0")}`;
            if (!map[key]) map[key] = { month: key, year: p.year, mo: p.month, count: 0, totalNet: 0, records: [] };
            map[key].count++;
            map[key].totalNet += (p.netSalary || 0);
            map[key].records.push(p);
        });
        return Object.values(map).sort((a, b) => b.month.localeCompare(a.month));
    }, [history]);

    const filtered = grouped.filter(r => r.month.includes(search) || String(r.year).includes(search));
    const totalPages = Math.ceil(filtered.length / perPage);
    const pageData = filtered.slice((page - 1) * perPage, page * perPage);

    const totals = preview.reduce((a, r) => ({
        basic: a.basic + r.basicSalary, allow: a.allow + r.allowances,
        ded: a.ded + r.deductions, tax: a.tax + r.tax, net: a.net + r.netSalary,
    }), { basic: 0, allow: 0, ded: 0, tax: 0, net: 0 });

    return (
        <section className="bg-[#f1f5f4] min-h-screen p-3 sm:p-5 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 mb-5 bg-white/60 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm">
                    {TABS(navigate).map(t => (
                        <button key={t.label} onClick={t.onClick || undefined}
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
                        {msg.type === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />} {msg.text}
                    </div>
                )}

                {/* ─── MAIN CONTENT ─── */}
                {!showPreview ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

                        {/* Generate Card */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="bg-emerald-50 p-2.5 rounded-xl text-[#0a4d44] shrink-0"><Calendar size={20} /></div>
                                <div>
                                    <h2 className="font-bold text-base sm:text-lg text-slate-800 leading-tight">Generate Payroll</h2>
                                    <p className="text-[11px] text-slate-400">All active employees</p>
                                </div>
                            </div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Select Month</label>
                            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 ring-emerald-100 outline-none mb-4 text-sm" />
                            <button onClick={handlePreview} disabled={loading}
                                className="w-full bg-[#0a4d44] hover:bg-[#063b34] text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-sm">
                                <Users size={15} /> Preview Salaries <ArrowRight size={15} />
                            </button>
                            <div className="mt-4 bg-blue-50 rounded-2xl p-3 flex gap-2">
                                <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                                    Auto-calculates HRA (40%), TA (10%), PF (12%), ESI, TDS from employee base salary.
                                </p>
                            </div>
                        </div>

                        {/* History */}
                        <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                                <h2 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                                    <Calendar size={17} className="text-emerald-500" /> Payroll History
                                </h2>
                                <div className="relative">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input placeholder="Search month…" value={search} onChange={e => setSearch(e.target.value)}
                                        className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 w-full sm:w-44" />
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-400" size={28} /></div>
                            ) : pageData.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-slate-300 font-bold text-sm">No payroll history yet</p>
                                    <p className="text-slate-300 text-xs mt-1">Select a month and click Preview</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pageData.map(r => (
                                        <div key={r.month} className="border border-slate-100 rounded-2xl overflow-hidden">
                                            <button className="w-full flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-3 bg-slate-50/60 hover:bg-emerald-50/30 transition text-left"
                                                onClick={() => setExpandedRow(expandedRow === r.month ? null : r.month)}>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-black text-slate-800 text-sm">{MONTHS[r.mo - 1]} {r.year}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-2">• {r.count} emp</span>
                                                </div>
                                                <span className="text-sm font-black text-emerald-600 shrink-0">{fmt(r.totalNet)}</span>
                                                <button onClick={e => { e.stopPropagation(); handleDelete(r.records); }}
                                                    className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition shrink-0">
                                                    <Trash2 size={13} />
                                                </button>
                                                {expandedRow === r.month ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                                            </button>

                                            {expandedRow === r.month && (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs min-w-[500px]">
                                                        <thead className="bg-slate-50 border-t border-slate-100">
                                                            <tr>{["Employee", "Basic", "Allow.", "Deduct.", "Tax", "Net", "Status"].map(h => (
                                                                <th key={h} className="px-3 py-2 text-left text-[9px] font-black uppercase text-slate-400">{h}</th>
                                                            ))}</tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-50">
                                                            {r.records.map(p => (
                                                                <tr key={p._id} className="hover:bg-slate-50/50">
                                                                    <td className="px-3 py-2 font-bold text-slate-700 whitespace-nowrap">{p.employeeName}</td>
                                                                    <td className="px-3 py-2 text-slate-500">{fmt(p.basicSalary)}</td>
                                                                    <td className="px-3 py-2 text-blue-500">+{fmt(p.allowances)}</td>
                                                                    <td className="px-3 py-2 text-rose-500">-{fmt(p.deductions)}</td>
                                                                    <td className="px-3 py-2 text-amber-500">-{fmt(p.tax)}</td>
                                                                    <td className="px-3 py-2 font-black text-emerald-600 whitespace-nowrap">{fmt(p.netSalary)}</td>
                                                                    <td className="px-3 py-2">
                                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase
                                      ${p.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                                                            {p.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-1.5 pt-2">
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <button key={i} onClick={() => setPage(i + 1)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-black transition
                            ${page === i + 1 ? "bg-[#0a4d44] text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                ) : (
                    /* ─── PREVIEW TABLE ─── */
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        {/* Preview header */}
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="font-black text-slate-800 text-base sm:text-lg">
                                    Preview — {MONTHS[parseInt(month.split("-")[1]) - 1]} {month.split("-")[0]}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">{preview.length} employees · adjust before saving</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => setShowPreview(false)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200">
                                    <X size={14} /> Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black disabled:opacity-50 transition">
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {saving ? "Saving…" : "Confirm & Save"}
                                </button>
                            </div>
                        </div>

                        {/* Summary strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-slate-100 border-b border-slate-100">
                            {[
                                { l: "Basic", v: fmt(totals.basic), c: "text-slate-700" },
                                { l: "Allowances", v: fmt(totals.allow), c: "text-blue-600" },
                                { l: "Deductions", v: fmt(totals.ded), c: "text-rose-500" },
                                { l: "TDS", v: fmt(totals.tax), c: "text-amber-600" },
                                { l: "Net Payout", v: fmt(totals.net), c: "text-emerald-600 font-black" },
                            ].map(s => (
                                <div key={s.l} className="bg-white px-3 sm:px-4 py-3 text-center">
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{s.l}</p>
                                    <p className={`text-xs sm:text-sm font-black ${s.c} mt-0.5`}>{s.v}</p>
                                </div>
                            ))}
                        </div>

                        {/* Desktop editable table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>{["Employee", "Basic ₹", "HRA ₹", "TA ₹", "PF ₹", "ESI ₹", "TDS ₹", "Net Salary", "Note"].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                                    ))}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {preview.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-slate-800 whitespace-nowrap">{r.employeeName}</p>
                                                {r.position && <p className="text-[10px] text-slate-400">{r.position}</p>}
                                            </td>
                                            {[{ f: "basicSalary" }, { f: "hra" }, { f: "ta" }, { f: "pf" }, { f: "esi" }, { f: "tax" }].map(({ f }) => (
                                                <td key={f} className="px-4 py-3">
                                                    <input type="number" value={r[f]} onChange={e => updateRow(i, f, e.target.value)}
                                                        className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-1 ring-emerald-100" />
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-sm">{fmt(r.netSalary)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input value={r.note} placeholder="Note…"
                                                    onChange={e => { const rows = [...preview]; rows[i] = { ...rows[i], note: e.target.value }; setPreview(rows); }}
                                                    className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-400" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile/tablet cards */}
                        <div className="lg:hidden divide-y divide-slate-100">
                            {preview.map((r, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-black text-slate-800">{r.employeeName}</p>
                                            {r.position && <p className="text-[10px] text-slate-400">{r.position}</p>}
                                        </div>
                                        <span className="font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl text-sm">{fmt(r.netSalary)}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { l: "Basic", f: "basicSalary" },
                                            { l: "HRA", f: "hra" },
                                            { l: "TA", f: "ta" },
                                            { l: "PF", f: "pf" },
                                            { l: "ESI", f: "esi" },
                                            { l: "TDS", f: "tax" },
                                        ].map(({ l, f }) => (
                                            <div key={f}>
                                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">{l}</p>
                                                <input type="number" value={r[f]} onChange={e => updateRow(i, f, e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none focus:border-emerald-400" />
                                            </div>
                                        ))}
                                    </div>
                                    <input value={r.note} placeholder="Note (optional)"
                                        onChange={e => { const rows = [...preview]; rows[i] = { ...rows[i], note: e.target.value }; setPreview(rows); }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}