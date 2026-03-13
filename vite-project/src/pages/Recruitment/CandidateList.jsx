import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, Plus, X, Search, Loader2, UserCircle, Star } from 'lucide-react';

const BASE = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });
const jsonHeaders = () => ({ ...authHeader(), "Content-Type": "application/json" });

const api = {
    get: async (url) => {
        // NOTE: No Content-Type on GET — express.json() returns 400 if Content-Type:json but no body
        const r = await fetch(`${BASE}${url}`, { headers: authHeader() });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Error");
        return d;
    },
    post: async (url, body) => {
        const r = await fetch(`${BASE}${url}`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify(body) });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Error");
        return d;
    },
    put: async (url, body) => {
        const r = await fetch(`${BASE}${url}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(body) });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Error");
        return d;
    },
    delete: async (url) => {
        const r = await fetch(`${BASE}${url}`, { method: "DELETE", headers: authHeader() });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Error");
        return d;
    },
};

const STATUS_COLORS = {
    Applied: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-yellow-100 text-yellow-700",
    Interview: "bg-purple-100 text-purple-700",
    Selected: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-600",
};

const EMPTY = { name: "", phone: "", email: "", position: "", department: "", experience: "", status: "Applied", interviewNotes: "" };

const inp = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 ring-indigo-100";

export default function CandidateList() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true); setError("");
        try {
            const res = await api.get("/recruitment");
            setCandidates(res.data || []);
        } catch (e) {
            setError(e.message || "Failed to load. Check if backend is running and you are logged in.");
        } finally { setLoading(false); }
    };

    const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
    const openEdit = (c) => { setForm({ name: c.name, phone: c.phone || "", email: c.email || "", position: c.position || "", department: c.department || "", experience: c.experience || "", status: c.status, interviewNotes: c.interviewNotes || "" }); setEditId(c._id); setShowForm(true); };

    const handleSave = async () => {
        if (!form.name.trim()) return alert("Name is required");
        if (!form.position.trim()) return alert("Position is required");
        setSaving(true);
        try {
            if (editId) {
                const res = await api.put(`/recruitment/${editId}`, form);
                setCandidates(p => p.map(c => c._id === editId ? res.data : c));
            } else {
                const res = await api.post("/recruitment", form);
                setCandidates(p => [res.data, ...p]);
            }
            setShowForm(false);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/recruitment/${deleteId}`);
            setCandidates(p => p.filter(c => c._id !== deleteId));
        } catch (e) { alert(e.message); }
        finally { setDeleteId(null); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const res = await api.put(`/recruitment/${id}`, { status });
            setCandidates(p => p.map(c => c._id === id ? res.data : c));
        } catch (e) { alert(e.message); }
    };

    const filtered = useMemo(() => {
        let d = [...candidates];
        if (search) d = d.filter(c =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.position?.toLowerCase().includes(search.toLowerCase())
        );
        if (statusFilter !== "All") d = d.filter(c => c.status === statusFilter);
        return d;
    }, [candidates, search, statusFilter]);

    return (
        <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-8 pt-24 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <UserCircle className="text-purple-600" size={24} />
                            </div>
                            Candidate List
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage recruitment candidates</p>
                    </div>
                    <button onClick={openAdd}
                        className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg transition">
                        <Plus size={18} /> Add Candidate
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {["All", "Applied", "Shortlisted", "Interview", "Selected", "Rejected"].filter((_, i) => i < 5).map(s => (
                        <div key={s} className={`rounded-2xl p-3 text-center border cursor-pointer transition ${statusFilter === s ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-100 hover:border-indigo-200"
                            }`} onClick={() => setStatusFilter(s)}>
                            <p className={`text-xl font-black ${statusFilter === s ? "text-white" : "text-slate-800"}`}>
                                {s === "All" ? candidates.length : candidates.filter(c => c.status === s).length}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${statusFilter === s ? "text-indigo-100" : "text-slate-400"}`}>{s}</p>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
                        ⚠️ {error}
                        <button onClick={load} className="ml-3 underline font-bold">Retry</button>
                    </div>
                )}

                {/* Search + Filter */}
                <div className="flex flex-wrap gap-3 mb-5 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search name, email, position..."
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 ring-indigo-100 shadow-sm" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                        <option value="All">All Status</option>
                        {["Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={36} /></div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    <th className="py-4 px-5 text-left">Candidate</th>
                                    <th className="py-4 px-4 text-left hidden md:table-cell">Position</th>
                                    <th className="py-4 px-4 text-left hidden lg:table-cell">Department</th>
                                    <th className="py-4 px-4 text-left hidden md:table-cell">Experience</th>
                                    <th className="py-4 px-4 text-left">Status</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="py-16 text-center text-slate-400">
                                        {candidates.length === 0 ? "No candidates yet. Add your first candidate!" : "No results found."}
                                    </td></tr>
                                ) : filtered.map(c => (
                                    <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-black text-sm shrink-0">
                                                    {c.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{c.name}</p>
                                                    <p className="text-[10px] text-slate-400">{c.email || c.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell text-sm text-slate-600">{c.position || "—"}</td>
                                        <td className="py-4 px-4 hidden lg:table-cell text-sm text-slate-600">{c.department || "—"}</td>
                                        <td className="py-4 px-4 hidden md:table-cell text-sm text-slate-600">{c.experience ? `${c.experience} yrs` : "—"}</td>
                                        <td className="py-4 px-4">
                                            <select value={c.status}
                                                onChange={e => handleStatusChange(c._id, e.target.value)}
                                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[c.status]}`}>
                                                {["Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                                                    <Edit size={14} className="text-slate-500" />
                                                </button>
                                                <button onClick={() => setDeleteId(c._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={14} className="text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-bold text-lg">{editId ? "Edit Candidate" : "Add Candidate"}</h2>
                            <button onClick={() => setShowForm(false)}><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Full Name *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Position *</label>
                                    <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="e.g. Software Engineer" className={inp} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Phone</label>
                                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inp} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Department</label>
                                    <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department" className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Experience (yrs)</label>
                                    <input type="number" min="0" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="0" className={inp} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                    {["Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Interview Notes</label>
                                <textarea value={form.interviewNotes} onChange={e => setForm({ ...form, interviewNotes: e.target.value })}
                                    rows={3} placeholder="Optional notes..." className={inp + " resize-none"} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex-[2] bg-[#0a4d44] text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
                                    {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update" : "Add Candidate"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-7 text-center">
                        <Trash2 size={32} className="mx-auto text-red-400 mb-3" />
                        <h2 className="font-black text-slate-800 mb-1">Delete Candidate?</h2>
                        <p className="text-slate-400 text-sm mb-6">This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 border border-slate-200 py-3 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-bold">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}