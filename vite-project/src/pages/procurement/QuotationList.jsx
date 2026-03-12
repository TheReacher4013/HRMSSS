import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search, FileText, Loader2, CheckCircle, AlertCircle, IndianRupee } from "lucide-react";
import { quotationAPI, vendorAPI, procRequestAPI } from "../../services/api";

const STATUS_COLORS = {
    Pending: "bg-amber-50 text-amber-700",
    Accepted: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-600",
};
const EMPTY = { request: "", requestNo: "", vendor: "", vendorName: "", amount: "", validUntil: "", status: "Pending", notes: "" };
const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

export default function Quotation() {
    const [rows, setRows] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [msg, setMsg] = useState({ text: "", type: "" });

    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        Promise.all([quotationAPI.getAll(), vendorAPI.getAll(), procRequestAPI.getAll()])
            .then(([q, v, r]) => { setRows(q.data || []); setVendors(v.data || []); setRequests(r.data || []); })
            .catch(() => toast("Failed to load.", "error"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r =>
        `${r.quoteNo} ${r.vendorName} ${r.requestNo}`.toLowerCase().includes(search.toLowerCase())
    ), [rows, search]);

    const openAdd = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = (r) => {
        setEditId(r._id);
        setForm({ request: r.request?._id || r.request || "", requestNo: r.requestNo || "", vendor: r.vendor?._id || r.vendor || "", vendorName: r.vendorName || "", amount: r.amount || "", validUntil: r.validUntil?.slice(0, 10) || "", status: r.status, notes: r.notes || "" });
        setModal(true);
    };

    const handleVendorChange = (id) => {
        const v = vendors.find(x => x._id === id);
        setForm(p => ({ ...p, vendor: id, vendorName: v?.name || "" }));
    };
    const handleRequestChange = (id) => {
        const r = requests.find(x => x._id === id);
        setForm(p => ({ ...p, request: id, requestNo: r?.requestNo || "" }));
    };

    const handleSave = async () => {
        if (!form.vendorName.trim() || !form.amount) { toast("Vendor and amount are required.", "error"); return; }
        setSaving(true);
        try {
            if (editId) {
                const res = await quotationAPI.update(editId, form);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Quotation updated.");
            } else {
                const res = await quotationAPI.create(form);
                setRows(p => [res.data, ...p]);
                toast("Quotation created.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await quotationAPI.delete(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Quotation deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    const quickStatus = async (id, status) => {
        try {
            const res = await quotationAPI.update(id, { status });
            setRows(p => p.map(r => r._id === id ? res.data : r));
        } catch { toast("Update failed.", "error"); }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl"><FileText className="text-blue-600" size={22} /></div>Quotation List
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Vendor quotations for procurement requests</p>
                    </div>
                    <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> Add Quotation
                    </button>
                </div>

                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                <div className="relative max-w-sm mb-6 ml-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input placeholder="Search quotations…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-emerald-50" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                    {["Quote No", "Request", "Vendor", "Amount", "Valid Until", "Status", "Actions"].map(h => <th key={h} className="px-6 py-5">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">{rows.length === 0 ? "No quotations yet." : "No results."}</td></tr>
                                ) : filtered.map(r => (
                                    <tr key={r._id} className="group hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4 text-xs font-bold text-blue-500">{r.quoteNo || "—"}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{r.requestNo || r.request?.requestNo || "—"}</td>
                                        <td className="px-6 py-4 font-bold text-slate-700 text-sm">{r.vendorName || r.vendor?.name || "—"}</td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-800 flex items-center gap-0.5"><IndianRupee size={12} />{r.amount ? Number(r.amount).toLocaleString("en-IN") : "—"}</td>
                                        <td className="px-6 py-4 text-xs text-slate-400">{r.validUntil?.slice(0, 10) || "—"}</td>
                                        <td className="px-6 py-4">
                                            <select value={r.status} onChange={e => quickStatus(r._id, e.target.value)}
                                                className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}>
                                                {["Pending", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
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
                )}
            </div>

            {modal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Quotation" : "New Quotation"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Linked Request</label>
                                <select value={form.request} onChange={e => handleRequestChange(e.target.value)} className={inp}>
                                    <option value="">— Select Request —</option>
                                    {requests.map(r => <option key={r._id} value={r._id}>{r.requestNo} — {r.item}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Vendor *</label>
                                <select value={form.vendor} onChange={e => handleVendorChange(e.target.value)} className={inp}>
                                    <option value="">— Select Vendor —</option>
                                    {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Amount (₹) *</label>
                                <input type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className={inp} placeholder="0" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Valid Until</label>
                                <input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} className={inp} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                    {["Pending", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Notes</label>
                                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inp} placeholder="Optional notes…" />
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update" : "Add Quotation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Quotation?</h2>
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