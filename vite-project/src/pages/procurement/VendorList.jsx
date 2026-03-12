import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search, Store, Loader2, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { vendorAPI } from "../../services/api";

const EMPTY = { name: "", email: "", phone: "", address: "", city: "", category: "" };
const PER_PAGE = 8;

const Toast = ({ msg }) => !msg.text ? null : (
    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
    </div>
);

export default function Vendors() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [msg, setMsg] = useState({ text: "", type: "" });

    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        vendorAPI.getAll().then(r => setRows(r.data || [])).catch(() => toast("Failed to load vendors.", "error")).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r => `${r.name} ${r.email} ${r.city} ${r.category}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = (r) => { setEditId(r._id); setForm({ name: r.name, email: r.email || "", phone: r.phone || "", address: r.address || "", city: r.city || "", category: r.category || "" }); setModal(true); };

    const handleSave = async () => {
        if (!form.name.trim()) { toast("Vendor name is required.", "error"); return; }
        setSaving(true);
        try {
            if (editId) {
                const res = await vendorAPI.update(editId, form);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Vendor updated.");
            } else {
                const res = await vendorAPI.create(form);
                setRows(p => [res.data, ...p]);
                toast("Vendor added.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(deleteId);
        try {
            await vendorAPI.delete(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Vendor deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(null); setDeleteId(null); }
    };

    const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-xl"><Store className="text-emerald-600" size={22} /></div>Vendor List
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage supplier and vendor contacts</p>
                    </div>
                    <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> Add Vendor
                    </button>
                </div>

                <Toast msg={msg} />

                <div className="relative max-w-sm mb-6 ml-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input placeholder="Search vendors…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-emerald-50" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                        {["#", "Vendor", "Email", "Phone", "City", "Category", "Actions"].map(h => <th key={h} className="px-6 py-5">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paged.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400 font-medium">{rows.length === 0 ? "No vendors yet." : "No results."}</td></tr>
                                    ) : paged.map((r, i) => (
                                        <tr key={r._id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-300">{(page - 1) * PER_PAGE + i + 1}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{r.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{r.email || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{r.phone || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{r.city || "—"}</td>
                                            <td className="px-6 py-4"><span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[11px] font-bold">{r.category || "—"}</span></td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openEdit(r)} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 transition"><Pencil size={14} /></button>
                                                    <button onClick={() => setDeleteId(r._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 transition"><Trash2 size={14} /></button>
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
                                        <h3 className="font-bold text-slate-800">{r.name}</h3>
                                        <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold">{r.category || "—"}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{r.email} • {r.phone} • {r.city}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => openEdit(r)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-xs">Edit</button>
                                        <button onClick={() => setDeleteId(r._id)} className="flex-1 bg-red-50 text-red-500 font-bold py-2 rounded-xl text-xs">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 px-2">
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
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Vendor" : "New Vendor"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-4">
                            {[["name", "Vendor Name *", "text", true], ["email", "Email", "email"], ["phone", "Phone", "text"], ["city", "City", "text"], ["category", "Category", "text"], ["address", "Address", "text"]].map(([k, l, t, req]) => (
                                <div key={k} className={k === "address" ? "col-span-2" : ""}>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{l}</label>
                                    <input type={t || "text"} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className={inp} placeholder={l} />
                                </div>
                            ))}
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95 transition">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update Vendor" : "Add Vendor"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500"><Trash2 size={32} /></div>
                        <h2 className="text-xl font-black text-slate-800 mb-2">Delete Vendor?</h2>
                        <p className="text-slate-500 text-sm mb-8">This will permanently remove this vendor.</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={confirmDelete} disabled={!!deleting} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Confirm Delete"}
                            </button>
                            <button onClick={() => setDeleteId(null)} className="w-full py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}