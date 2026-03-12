import { useState, useEffect, useMemo } from "react";
import {
    Plus, Pencil, Trash2, X, Search, BarChart2, Loader2,
    CheckCircle, AlertCircle, ChevronLeft, ChevronRight, IndianRupee,
} from "lucide-react";
import { bidAnalysisAPI, procRequestAPI } from "../../services/api";

const STATUS_COLORS = {
    Open: "bg-blue-50 text-blue-700",
    Closed: "bg-gray-100 text-gray-600",
    Awarded: "bg-emerald-50 text-emerald-700",
};

const EMPTY_FORM = {
    request: "", requestNo: "", sbaNo: "", location: "", description: "",
    bidDate: "", status: "Open", selectedVendor: "",
    vendors: [{ vendorName: "", amount: "", notes: "" }],
};

const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

export default function BidAnalysis() {
    const [rows, setRows] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [msg, setMsg] = useState({ text: "", type: "" });

    const PER_PAGE = 8;
    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        Promise.all([bidAnalysisAPI.getAll(), procRequestAPI.getAll()])
            .then(([b, r]) => { setRows(b.data || []); setRequests(r.data || []); })
            .catch(() => toast("Failed to load.", "error"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r =>
        `${r.bidNo} ${r.sbaNo} ${r.location} ${r.requestNo}`.toLowerCase().includes(search.toLowerCase())
    ), [rows, search]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => { setEditId(null); setForm({ ...EMPTY_FORM, vendors: [{ vendorName: "", amount: "", notes: "" }] }); setModal(true); };
    const openEdit = (r) => {
        setEditId(r._id);
        setForm({
            request: r.request?._id || r.request || "",
            requestNo: r.requestNo || "",
            sbaNo: r.sbaNo || "",
            location: r.location || "",
            description: r.description || "",
            bidDate: r.bidDate?.slice(0, 10) || "",
            status: r.status,
            selectedVendor: r.selectedVendor || "",
            vendors: r.vendors?.length ? r.vendors.map(v => ({ vendorName: v.vendorName, amount: v.amount || "", notes: v.notes || "" })) : [{ vendorName: "", amount: "", notes: "" }],
        });
        setModal(true);
    };

    const handleRequestChange = (id) => {
        const r = requests.find(x => x._id === id);
        setForm(p => ({ ...p, request: id, requestNo: r?.requestNo || "" }));
    };

    const updateVendor = (i, field, val) =>
        setForm(p => ({ ...p, vendors: p.vendors.map((v, idx) => idx === i ? { ...v, [field]: val } : v) }));

    const addVendorRow = () => setForm(p => ({ ...p, vendors: [...p.vendors, { vendorName: "", amount: "", notes: "" }] }));
    const removeVendorRow = (i) => setForm(p => ({ ...p, vendors: p.vendors.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        if (!form.vendors.some(v => v.vendorName.trim())) { toast("Add at least one vendor.", "error"); return; }
        setSaving(true);
        try {
            const payload = {
                ...form,
                vendors: form.vendors.filter(v => v.vendorName.trim()),
            };
            if (editId) {
                const res = await bidAnalysisAPI.update(editId, payload);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Bid analysis updated.");
            } else {
                const res = await bidAnalysisAPI.create(payload);
                setRows(p => [res.data, ...p]);
                toast("Bid analysis created.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await bidAnalysisAPI.delete(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Bid analysis deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    const quickStatus = async (id, status) => {
        try {
            const res = await bidAnalysisAPI.update(id, { status });
            setRows(p => p.map(r => r._id === id ? res.data : r));
        } catch { toast("Update failed.", "error"); }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl"><BarChart2 className="text-purple-600" size={22} /></div>
                            Bid Analysis
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Compare vendor bids and award contracts</p>
                    </div>
                    <button onClick={openAdd}
                        className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> New Bid Analysis
                    </button>
                </div>

                {/* Toast */}
                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                {/* Search */}
                <div className="relative max-w-sm mb-6 ml-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input placeholder="Search bid no, location…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-white border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-purple-50" />
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" size={32} /></div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                        {["Bid No", "SBA No", "Request", "Location", "Vendors", "Lowest Bid", "Awarded To", "Bid Date", "Status", "Actions"].map(h =>
                                            <th key={h} className="px-5 py-5">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paged.length === 0 ? (
                                        <tr><td colSpan={10} className="px-6 py-16 text-center text-slate-400">{rows.length === 0 ? "No bid analysis yet." : "No results."}</td></tr>
                                    ) : paged.map(r => {
                                        const amounts = r.vendors?.map(v => Number(v.amount)).filter(Boolean);
                                        const lowest = amounts?.length ? Math.min(...amounts) : null;
                                        return (
                                            <tr key={r._id} className="group hover:bg-slate-50/50 transition">
                                                <td className="px-5 py-4 text-xs font-bold text-purple-500">{r.bidNo || "—"}</td>
                                                <td className="px-5 py-4 text-sm text-slate-500">{r.sbaNo || "—"}</td>
                                                <td className="px-5 py-4 text-xs text-slate-400">{r.requestNo || r.request?.requestNo || "—"}</td>
                                                <td className="px-5 py-4 text-sm text-slate-600">{r.location || "—"}</td>
                                                <td className="px-5 py-4 text-sm font-bold text-slate-700">{r.vendors?.length || 0}</td>
                                                <td className="px-5 py-4 text-sm font-black text-slate-800">
                                                    {lowest ? <span className="flex items-center gap-0.5"><IndianRupee size={11} />{lowest.toLocaleString("en-IN")}</span> : "—"}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-emerald-600 font-bold">{r.selectedVendor || "—"}</td>
                                                <td className="px-5 py-4 text-xs text-slate-400">{r.bidDate?.slice(0, 10) || "—"}</td>
                                                <td className="px-5 py-4">
                                                    <select value={r.status} onChange={e => quickStatus(r._id, e.target.value)}
                                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}>
                                                        {["Open", "Closed", "Awarded"].map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                        <button onClick={() => openEdit(r)} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200"><Pencil size={13} /></button>
                                                        <button onClick={() => setDeleteId(r._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200"><Trash2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {paged.map(r => {
                                const amounts = r.vendors?.map(v => Number(v.amount)).filter(Boolean);
                                const lowest = amounts?.length ? Math.min(...amounts) : null;
                                return (
                                    <div key={r._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <span className="text-[10px] font-bold text-purple-500">{r.bidNo}</span>
                                                <p className="font-bold text-slate-800">{r.location || "—"}</p>
                                                <p className="text-xs text-slate-500">SBA: {r.sbaNo || "—"} • {r.vendors?.length || 0} vendor(s)</p>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg h-fit ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                                        </div>
                                        {lowest && <p className="text-sm font-black text-slate-700 mb-3">Lowest: ₹{lowest.toLocaleString("en-IN")}</p>}
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(r)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-xs">Edit</button>
                                            <button onClick={() => setDeleteId(r._id)} className="flex-1 bg-red-50 text-red-500 font-bold py-2 rounded-xl text-xs">Delete</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-[10px] font-black uppercase text-slate-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-purple-600 disabled:opacity-30"><ChevronLeft size={18} /></button>
                                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-purple-600 disabled:opacity-30"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Bid Analysis" : "New Bid Analysis"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Linked Request</label>
                                    <select value={form.request} onChange={e => handleRequestChange(e.target.value)} className={inp}>
                                        <option value="">— Select Request —</option>
                                        {requests.map(r => <option key={r._id} value={r._id}>{r.requestNo} — {r.item}</option>)}
                                    </select>
                                </div>
                                {[["sbaNo", "SBA No"], ["location", "Location"]].map(([k, l]) => (
                                    <div key={k}>
                                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{l}</label>
                                        <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className={inp} placeholder={l} />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Bid Date</label>
                                    <input type="date" value={form.bidDate} onChange={e => setForm({ ...form, bidDate: e.target.value })} className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                        {["Open", "Closed", "Awarded"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description</label>
                                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inp} placeholder="Optional description…" />
                                </div>
                            </div>

                            {/* Vendor Bids */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Vendor Bids *</label>
                                    <button onClick={addVendorRow} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                        <Plus size={12} /> Add Vendor
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {form.vendors.map((v, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-2xl">
                                            <div className="col-span-4">
                                                <input value={v.vendorName} onChange={e => updateVendor(i, "vendorName", e.target.value)}
                                                    className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100"
                                                    placeholder="Vendor name" />
                                            </div>
                                            <div className="col-span-3">
                                                <input type="number" min="0" value={v.amount} onChange={e => updateVendor(i, "amount", e.target.value)}
                                                    className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100"
                                                    placeholder="Amount (₹)" />
                                            </div>
                                            <div className="col-span-4">
                                                <input value={v.notes} onChange={e => updateVendor(i, "notes", e.target.value)}
                                                    className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100"
                                                    placeholder="Notes (optional)" />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                {form.vendors.length > 1 && (
                                                    <button onClick={() => removeVendorRow(i)} className="text-red-400 hover:text-red-600 p-1"><X size={14} /></button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selected winner */}
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Awarded Vendor</label>
                                <select value={form.selectedVendor} onChange={e => setForm({ ...form, selectedVendor: e.target.value })} className={inp}>
                                    <option value="">— Not awarded yet —</option>
                                    {form.vendors.filter(v => v.vendorName.trim()).map((v, i) => <option key={i} value={v.vendorName}>{v.vendorName}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex gap-3 shrink-0">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update" : "Create Bid Analysis"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Bid Analysis?</h2>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={confirmDelete} disabled={deleting}
                                className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
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