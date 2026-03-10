import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus, Search, Edit2, Trash2, X, Loader2,
    CheckCircle, AlertCircle, IndianRupee, Clock, Ban
} from "lucide-react";
import { employeeAPI, payrollAPI } from "../../services/api";

const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_STYLE = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-600 border-red-200",
};

const emptyForm = { employeeId: "", employeeName: "", amount: "", reason: "", requestDate: "" };

export default function SalaryAdvance() {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilt, setStatusFilt] = useState("");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const perPage = 6;

    const showMsg = (text, type = "success") => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 4000);
    };

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [advRes, empRes] = await Promise.all([payrollAPI.getAdvances(), employeeAPI.getAll()]);
            setAllData(advRes.data || []);
            setEmployees(empRes.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchAll(); }, []);

    const filtered = useMemo(() =>
        allData.filter(r => {
            const name = (r.employeeName || r.employee?.name || "").toLowerCase();
            return name.includes(search.toLowerCase()) && (!statusFilt || r.status === statusFilt);
        }), [allData, search, statusFilt]);

    useEffect(() => setPage(1), [filtered.length]);
    const totalPages = Math.ceil(filtered.length / perPage);
    const pageData = filtered.slice((page - 1) * perPage, page * perPage);

    const summary = useMemo(() => ({
        total: allData.length,
        pending: allData.filter(r => r.status === "Pending").length,
        approved: allData.filter(r => r.status === "Approved").length,
        totalAmt: allData.filter(r => r.status === "Approved").reduce((s, r) => s + (r.amount || 0), 0),
    }), [allData]);

    const openAdd = () => {
        setEditId(null);
        setForm({ ...emptyForm, requestDate: new Date().toISOString().slice(0, 10) });
        setShowModal(true);
    };

    const openEdit = (row) => {
        setEditId(row._id);
        setForm({
            employeeId: row.employee?._id || row.employee || "",
            employeeName: row.employeeName || row.employee?.name || "",
            amount: row.amount || "",
            reason: row.reason || "",
            requestDate: row.requestDate?.slice(0, 10) || "",
        });
        setShowModal(true);
    };

    const handleEmpSelect = (e) => {
        const emp = employees.find(x => x._id === e.target.value);
        if (emp) setForm(f => ({ ...f, employeeId: emp._id, employeeName: emp.name }));
    };

    const saveRow = async () => {
        if (!form.employeeName || !form.amount) {
            showMsg("Employee and amount are required.", "error");
            return;
        }
        setSaving(true);
        try {
            const body = {
                employee: form.employeeId || undefined,
                employeeName: form.employeeName,
                amount: Number(form.amount),
                reason: form.reason,
                requestDate: form.requestDate || new Date(),
                status: "Pending",
            };
            if (editId) {
                const res = await payrollAPI.updateAdvance(editId, body);
                setAllData(prev => prev.map(r => r._id === editId ? res.data : r));
                showMsg("Updated ✅");
            } else {
                const res = await payrollAPI.createAdvance(body);
                setAllData(prev => [res.data, ...prev]);
                showMsg("Request created ✅");
            }
            setShowModal(false);
        } catch (e) { showMsg("Failed: " + e.message, "error"); }
        finally { setSaving(false); }
    };

    const changeStatus = async (id, status) => {
        try {
            const res = await payrollAPI.updateAdvance(id, { status });
            setAllData(prev => prev.map(r => r._id === id ? res.data : r));
            showMsg(`Marked as ${status}`);
        } catch (e) { showMsg("Failed", "error"); }
    };

    const deleteRow = async (id) => {
        if (!window.confirm("Delete this request?")) return;
        try {
            await payrollAPI.deleteAdvance(id);
            setAllData(prev => prev.filter(r => r._id !== id));
            showMsg("Deleted.");
        } catch (e) { showMsg("Delete failed.", "error"); }
    };

    return (
        <section className="bg-[#f1f5f4] min-h-screen p-3 sm:p-5 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 mb-5 bg-white/60 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm">
                    {[
                        { label: "Salary Advance", path: null, active: true },
                        { label: "Salary Generate", path: "/Payroll/salary-generate", active: false },
                        { label: "Manage Salary", path: "/Payroll/manage-employee-salary", active: false },
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                    {[
                        { l: "Total", v: summary.total, c: "text-slate-700", bg: "bg-white" },
                        { l: "Pending", v: summary.pending, c: "text-amber-600", bg: "bg-amber-50" },
                        { l: "Approved", v: summary.approved, c: "text-emerald-600", bg: "bg-emerald-50" },
                        { l: "Disbursed", v: fmt(summary.totalAmt), c: "text-blue-600", bg: "bg-blue-50" },
                    ].map(s => (
                        <div key={s.l} className={`${s.bg} border border-slate-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-center`}>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">{s.l}</p>
                            <p className={`text-sm sm:text-lg font-black ${s.c} mt-0.5 truncate`}>{s.v}</p>
                        </div>
                    ))}
                </div>

                {/* Top bar */}
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div className="flex flex-wrap gap-2 flex-1">
                        <div className="relative flex-1 min-w-[130px]">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-emerald-400" />
                        </div>
                        <select value={statusFilt} onChange={e => setStatusFilt(e.target.value)}
                            className="px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:border-emerald-400 text-slate-600">
                            <option value="">All Status</option>
                            <option>Pending</option><option>Approved</option><option>Rejected</option>
                        </select>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-[#0a4d44] hover:bg-[#063b34] text-white px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all active:scale-95 shrink-0">
                        <Plus size={15} /> <span className="hidden sm:inline">New Request</span><span className="sm:hidden">New</span>
                    </button>
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-400" size={36} /></div>
                ) : pageData.length === 0 ? (
                    <div className="bg-white rounded-2xl py-16 text-center border-2 border-dashed border-slate-100">
                        <IndianRupee size={32} className="mx-auto mb-3 text-slate-200" />
                        <p className="text-slate-400 font-bold text-sm">{allData.length === 0 ? "No advance requests yet" : "No records match filters"}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                        {pageData.map(r => {
                            const name = r.employeeName || r.employee?.name || "Unknown";
                            const dateStr = r.requestDate
                                ? new Date(r.requestDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : "—";
                            return (
                                <div key={r._id} className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:shadow-md hover:border-emerald-100 transition-all relative overflow-hidden group">
                                    {/* decorative blob */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -mr-8 -mt-8 group-hover:bg-emerald-100 transition-colors pointer-events-none" />

                                    <div className="relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#0a4d44] font-black text-lg border border-emerald-100 shrink-0">
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${STATUS_STYLE[r.status] || STATUS_STYLE.Pending}`}>
                                                {r.status || "Pending"}
                                            </span>
                                        </div>

                                        <p className="font-black text-slate-800 truncate text-sm sm:text-base">{name}</p>
                                        {r.reason && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{r.reason}</p>}

                                        <div className="mt-3 space-y-1.5 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400 flex items-center gap-1"><IndianRupee size={12} />Amount</span>
                                                <span className="font-black text-emerald-600">₹{Number(r.amount).toLocaleString("en-IN")}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400 flex items-center gap-1"><Clock size={12} />Requested</span>
                                                <span className="font-bold text-slate-600 text-xs">{dateStr}</span>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {r.status === "Pending" && (
                                                <>
                                                    <button onClick={() => changeStatus(r._id, "Approved")}
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 min-w-[80px]">
                                                        <CheckCircle size={11} /> Approve
                                                    </button>
                                                    <button onClick={() => changeStatus(r._id, "Rejected")}
                                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-black border border-red-100 transition-all flex items-center justify-center gap-1 min-w-[70px]">
                                                        <Ban size={11} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {r.status !== "Pending" && (
                                                <button onClick={() => changeStatus(r._id, "Pending")}
                                                    className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-xl text-xs font-black hover:bg-slate-200 transition-all">
                                                    Reset
                                                </button>
                                            )}
                                            <button onClick={() => openEdit(r)} className="p-2 bg-blue-50 text-blue-400 rounded-xl hover:bg-blue-100 transition shrink-0"><Edit2 size={13} /></button>
                                            <button onClick={() => deleteRow(r._id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition shrink-0"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-1.5 mt-5">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-xl font-black text-xs transition-all
                  ${page === i + 1 ? "bg-[#0a4d44] text-white" : "bg-white border border-slate-200 text-slate-400 hover:border-emerald-400"}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── MODAL ─── */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full sm:max-w-md border border-slate-100 max-h-[92vh] overflow-y-auto">
                        {/* Modal header */}
                        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-50 sticky top-0 bg-white z-10">
                            <h3 className="text-base sm:text-lg font-black text-slate-800">{editId ? "Edit Request" : "New Advance Request"}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-xl transition"><X size={18} /></button>
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                            {/* Employee selector */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Select Employee</label>
                                <select value={form.employeeId} onChange={handleEmpSelect}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 mb-2">
                                    <option value="">— Choose from list —</option>
                                    {employees.map(e => (
                                        <option key={e._id} value={e._id}>{e.name}{e.employeeId ? ` (${e.employeeId})` : ""}</option>
                                    ))}
                                </select>
                                <input placeholder="Or type name manually" value={form.employeeName}
                                    onChange={e => setForm(f => ({ ...f, employeeName: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-emerald-400" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Amount (₹)</label>
                                    <input type="number" placeholder="e.g. 5000" value={form.amount}
                                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold outline-none focus:border-emerald-400" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Date</label>
                                    <input type="date" value={form.requestDate}
                                        onChange={e => setForm(f => ({ ...f, requestDate: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-emerald-400" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Reason</label>
                                <textarea rows={3} placeholder="Reason for advance…" value={form.reason}
                                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-emerald-400 resize-none" />
                            </div>

                            <button onClick={saveRow} disabled={saving}
                                className="w-full bg-[#0a4d44] hover:bg-[#063b34] text-white p-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><CheckCircle size={15} /> {editId ? "Update" : "Submit Request"}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}