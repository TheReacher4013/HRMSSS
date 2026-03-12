import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search, ClipboardList, Loader2, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { procRequestAPI, unitAPI } from "../../services/api";

const STATUS_COLORS = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-600",
    Ordered: "bg-blue-50 text-blue-700",
};
const PER_PAGE = 8;
const EMPTY = { requestedBy: "", department: "", item: "", quantity: "", unit: "", estimatedCost: "", reason: "", status: "Pending" };

export default function Request() {
    const [rows, setRows] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [statusF, setStatusF] = useState("All");
    const [page, setPage] = useState(1);
    const [msg, setMsg] = useState({ text: "", type: "" });

    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        Promise.all([procRequestAPI.getAll(), unitAPI.getAll()])
            .then(([r, u]) => { setRows(r.data || []); setUnits(u.data || []); })
            .catch(() => toast("Failed to load.", "error"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r => {
        const matchS = statusF === "All" || r.status === statusF;
        const matchQ = `${r.requestedBy} ${r.department} ${r.item} ${r.requestNo}`.toLowerCase().includes(search.toLowerCase());
        return matchS && matchQ;
    }), [rows, search, statusF]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = (r) => { setEditId(r._id); setForm({ requestedBy: r.requestedBy, department: r.department || "", item: r.item, quantity: r.quantity, unit: r.unit || "", estimatedCost: r.estimatedCost || "", reason: r.reason || "", status: r.status }); setModal(true); };

    const handleSave = async () => {
        if (!form.requestedBy.trim() || !form.item.trim() || !form.quantity) { toast("Requested by, item and quantity are required.", "error"); return; }
        setSaving(true);
        try {
            if (editId) {
                const res = await procRequestAPI.update(editId, form);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Request updated.");
            } else {
                const res = await procRequestAPI.create(form);
                setRows(p => [res.data, ...p]);
                toast("Request created.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await procRequestAPI.delete(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Request deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    const quickStatus = async (id, status) => {
        try {
            const res = await procRequestAPI.update(id, { status });
            setRows(p => p.map(r => r._id === id ? res.data : r));
        } catch { toast("Update failed.", "error"); }
    };

    const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-xl"><ClipboardList className="text-amber-600" size={22} /></div>Request List
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Procurement requests — track approvals</p>
                    </div>
                    <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> New Request
                    </button>
                </div>

                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                {/* Status filter + search */}
                <div className="flex flex-wrap gap-3 items-center mb-6">
                    <div className="flex flex-wrap gap-2">
                        {["All", "Pending", "Approved", "Rejected", "Ordered"].map(s => (
                            <button key={s} onClick={() => { setStatusF(s); setPage(1); }}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${statusF === s ? "bg-[#0a4d44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                                {s} ({s === "All" ? rows.length : rows.filter(r => r.status === s).length})
                            </button>
                        ))}
                    </div>
                    <div className="relative ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input placeholder="Search…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 ring-emerald-100 w-52" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                        {["Req No", "Requested By", "Item", "Qty", "Est. Cost", "Date", "Status", "Actions"].map(h => <th key={h} className="px-5 py-5">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paged.length === 0 ? (
                                        <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400">{rows.length === 0 ? "No requests yet." : "No results."}</td></tr>
                                    ) : paged.map(r => (
                                        <tr key={r._id} className="group hover:bg-slate-50/50 transition">
                                            <td className="px-5 py-4 text-xs font-bold text-slate-400">{r.requestNo || "—"}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-slate-700 text-sm">{r.requestedBy}</p>
                                                {r.department && <p className="text-[10px] text-slate-400">{r.department}</p>}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-700 text-sm">{r.item}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{r.quantity} {r.unit}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600 flex items-center gap-0.5"><IndianRupee size={12} />{r.estimatedCost ? Number(r.estimatedCost).toLocaleString("en-IN") : "—"}</td>
                                            <td className="px-5 py-4 text-xs text-slate-400">{r.requestDate?.slice(0, 10) || "—"}</td>
                                            <td className="px-5 py-4">
                                                <select value={r.status} onChange={e => quickStatus(r._id, e.target.value)}
                                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}>
                                                    {["Pending", "Approved", "Rejected", "Ordered"].map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openEdit(r)} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200"><Pencil size={13} /></button>
                                                    <button onClick={() => setDeleteId(r._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200"><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-3">
                            {paged.map(r => (
                                <div key={r._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400">{r.requestNo}</p>
                                            <h3 className="font-bold text-slate-800">{r.item}</h3>
                                            <p className="text-xs text-slate-500">{r.requestedBy} • {r.department}</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg h-fit ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">Qty: {r.quantity} {r.unit} {r.estimatedCost ? `• ₹${Number(r.estimatedCost).toLocaleString("en-IN")}` : ""}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(r)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-xs">Edit</button>
                                        <button onClick={() => setDeleteId(r._id)} className="flex-1 bg-red-50 text-red-500 font-bold py-2 rounded-xl text-xs">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-[10px] font-black uppercase text-slate-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30"><ChevronLeft size={18} /></button>
                                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Request" : "New Request"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
                            {[["requestedBy", "Requested By *"], ["department", "Department"], ["item", "Item Name *"]].map(([k, l]) => (
                                <div key={k} className={k === "item" ? "col-span-2" : ""}>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{l}</label>
                                    <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={l} className={inp} />
                                </div>
                            ))}
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Quantity *</label>
                                <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className={inp} placeholder="0" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Unit</label>
                                <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className={inp}>
                                    <option value="">— Select —</option>
                                    {units.map(u => <option key={u._id} value={u.shortName || u.name}>{u.name}{u.shortName ? ` (${u.shortName})` : ""}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Estimated Cost (₹)</label>
                                <input type="number" min="0" value={form.estimatedCost} onChange={e => setForm({ ...form, estimatedCost: e.target.value })} className={inp} placeholder="0" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                    {["Pending", "Approved", "Rejected", "Ordered"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Reason</label>
                                <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className={inp} placeholder="Why is this needed?" />
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update" : "Create Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Request?</h2>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={confirmDelete} disabled={deleting} className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Confirm Delete"}
                            </button>
                            <button onClick={() => setDeleteId(null)} className="w-full py-3.5 rounded-2xl font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}