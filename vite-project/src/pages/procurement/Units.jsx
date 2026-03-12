import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search, Ruler, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { unitAPI } from "../../services/api";

const EMPTY = { name: "", shortName: "" };

export default function Units() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [msg, setMsg] = useState({ text: "", type: "" });

    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        unitAPI.getAll().then(r => setRows(r.data || [])).catch(() => toast("Failed to load.", "error")).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r => `${r.name} ${r.shortName || ""}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);

    const openAdd = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = (r) => { setEditId(r._id); setForm({ name: r.name, shortName: r.shortName || "" }); setModal(true); };

    const handleSave = async () => {
        if (!form.name.trim()) { toast("Unit name is required.", "error"); return; }
        setSaving(true);
        try {
            if (editId) {
                const res = await unitAPI.update(editId, form);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Unit updated.");
            } else {
                const res = await unitAPI.create(form);
                setRows(p => [res.data, ...p]);
                toast("Unit added.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await unitAPI.delete(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Unit deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-xl"><Ruler className="text-indigo-600" size={22} /></div>Units List
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Measurement units used in procurement</p>
                    </div>
                    <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={16} /> Add Unit
                    </button>
                </div>

                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                <div className="relative max-w-xs mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input placeholder="Search units…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-emerald-50" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-16"><Loader2 className="animate-spin text-emerald-500" size={30} /></div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                    <th className="px-8 py-5">#</th>
                                    <th className="px-8 py-5">Unit Name</th>
                                    <th className="px-8 py-5">Short Name</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={4} className="px-8 py-14 text-center text-slate-400">{rows.length === 0 ? "No units yet." : "No results."}</td></tr>
                                ) : filtered.map((r, i) => (
                                    <tr key={r._id} className="group hover:bg-slate-50/50 transition">
                                        <td className="px-8 py-4 text-sm font-bold text-slate-300">{i + 1}</td>
                                        <td className="px-8 py-4 font-bold text-slate-700">{r.name}</td>
                                        <td className="px-8 py-4"><span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{r.shortName || "—"}</span></td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => openEdit(r)} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 transition"><Pencil size={14} /></button>
                                                <button onClick={() => setDeleteId(r._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 transition"><Trash2 size={14} /></button>
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
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-black text-slate-800 text-lg">{editId ? "Edit Unit" : "New Unit"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>
                        <div className="space-y-4 mb-6">
                            {[["name", "Unit Name *"], ["shortName", "Short Name (e.g. kg, pc)"]].map(([k, l]) => (
                                <div key={k}>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{l}</label>
                                    <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={l}
                                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95 transition">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update" : "Add Unit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Unit?</h2>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={confirmDelete} disabled={deleting} className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Confirm Delete"}
                            </button>
                            <button onClick={() => setDeleteId(null)} className="w-full py-3.5 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}