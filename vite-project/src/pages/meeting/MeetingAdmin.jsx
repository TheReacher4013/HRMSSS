import { useState, useEffect, useMemo } from "react";
import {
    Plus, Pencil, Trash2, X, Search, Video, Loader2, CheckCircle,
    AlertCircle, Copy, Check, RefreshCw, ExternalLink, Calendar,
    Clock, MapPin, Users, UserCheck, ChevronLeft, ChevronRight
} from "lucide-react";
import { meetingAPI } from "../../services/api";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STATUS_COLORS = {
    Scheduled: "bg-blue-100 text-blue-700",
    Ongoing: "bg-emerald-100 text-emerald-700",
    Completed: "bg-gray-100 text-gray-500",
    Cancelled: "bg-red-100 text-red-600",
};
const PER_PAGE = 6;

const generateLink = () => {
    const uid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
    return `https://meet.jit.si/HRMS-${uid}`;
};

const EMPTY = {
    title: "", description: "", date: "", time: "", location: "",
    organizer: "Admin", status: "Scheduled", meetingLink: "",
    assignedUsers: [],
};

/* ── CopyButton ── */
const CopyButton = ({ text }) => {
    const [cp, setCp] = useState(false);
    return (
        <button onClick={() => { navigator.clipboard.writeText(text); setCp(true); setTimeout(() => setCp(false), 2000); }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition ${cp ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {cp ? <><Check size={10} />Copied!</> : <><Copy size={10} />Copy</>}
        </button>
    );
};

export default function MeetingAdmin() {
    const [meetings, setMeetings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({ ...EMPTY, meetingLink: generateLink() });
    const [search, setSearch] = useState("");
    const [statusF, setStatusF] = useState("All");
    const [page, setPage] = useState(1);
    const [userSrch, setUserSrch] = useState("");
    const [msg, setMsg] = useState({ text: "", type: "" });

    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        const load = async () => {
            try {
                const [mRes, uRes] = await Promise.all([
                    meetingAPI.getAll(),
                    fetch(`${BASE}/auth/users`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(r => r.json()),
                ]);
                setMeetings(mRes.data || []);
                setUsers(uRes.data || []);
            } catch (e) { toast("Failed to load", "error"); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = useMemo(() => meetings.filter(m => {
        const ms = statusF === "All" || m.status === statusF;
        const mq = `${m.title} ${m.organizer || ""} ${m.location || ""}`.toLowerCase().includes(search.toLowerCase());
        return ms && mq;
    }), [meetings, search, statusF]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => {
        setEditId(null);
        setForm({ ...EMPTY, meetingLink: generateLink() });
        setUserSrch(""); setModal(true);
    };
    const openEdit = (m) => {
        setEditId(m._id);
        setForm({
            title: m.title,
            description: m.description || "",
            date: m.date?.slice(0, 10) || "",
            time: m.time || "",
            location: m.location || "",
            organizer: m.organizer || "Admin",
            status: m.status,
            meetingLink: m.meetingLink || generateLink(),
            assignedUsers: m.assignedUsers?.map(u => u._id || u) || [],
        });
        setUserSrch(""); setModal(true);
    };

    const toggleUser = (id) => setForm(p => ({
        ...p,
        assignedUsers: p.assignedUsers.includes(id)
            ? p.assignedUsers.filter(x => x !== id)
            : [...p.assignedUsers, id],
    }));

    const handleSave = async () => {
        if (!form.title.trim()) { toast("Title is required", "error"); return; }
        if (!form.date) { toast("Date is required", "error"); return; }
        setSaving(true);
        try {
            if (editId) {
                const res = await meetingAPI.update(editId, form);
                setMeetings(p => p.map(x => x._id === editId ? res.data : x));
                toast("Meeting updated ✅");
            } else {
                const res = await meetingAPI.create(form);
                setMeetings(p => [res.data, ...p]);
                toast("Meeting created ✅");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed", "error"); }
        finally { setSaving(false); }
    };

    const handleRegenerate = async (id) => {
        try {
            const res = await fetch(`${BASE}/meetings/${id}/regenerate-link`, {
                method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setMeetings(p => p.map(x => x._id === id ? data.data : x));
            toast("Link regenerated ✅");
        } catch { toast("Failed", "error"); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await meetingAPI.delete(deleteId);
            setMeetings(p => p.filter(x => x._id !== deleteId));
            toast("Meeting deleted");
        } catch { toast("Delete failed", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    const quickStatus = async (id, status) => {
        try {
            const res = await meetingAPI.update(id, { status });
            setMeetings(p => p.map(x => x._id === id ? res.data : x));
        } catch { toast("Update failed", "error"); }
    };

    const filteredUsers = users.filter(u =>
        `${u.name} ${u.email}`.toLowerCase().includes(userSrch.toLowerCase())
    );

    const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl"><Video className="text-blue-600" size={22} /></div>
                            Meetings
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Schedule meetings & assign to users — they'll see the join link</p>
                    </div>
                    <button onClick={openAdd}
                        className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> New Meeting
                    </button>
                </div>

                {/* Toast */}
                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center mb-6">
                    {["All", "Scheduled", "Ongoing", "Completed", "Cancelled"].map(s => (
                        <button key={s} onClick={() => { setStatusF(s); setPage(1); }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition border ${statusF === s ? "bg-[#0a4d44] text-white border-transparent" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                            {s} ({s === "All" ? meetings.length : meetings.filter(m => m.status === s).length})
                        </button>
                    ))}
                    <div className="relative ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input placeholder="Search…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 ring-blue-100 w-48" />
                    </div>
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {paged.length === 0 ? (
                                <div className="col-span-2 bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
                                    <Video size={40} className="mx-auto text-slate-200 mb-3" />
                                    <p className="font-bold text-slate-400">{meetings.length === 0 ? "No meetings yet." : "No matching meetings."}</p>
                                </div>
                            ) : paged.map(m => (
                                <div key={m._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3">
                                    {/* Title + status */}
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-black text-slate-800 text-base leading-tight flex-1">{m.title}</h3>
                                        <select value={m.status} onChange={e => quickStatus(m._id, e.target.value)}
                                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-xl border-0 outline-none cursor-pointer shrink-0 ${STATUS_COLORS[m.status]}`}>
                                            {["Scheduled", "Ongoing", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                        {m.date && <span className="flex items-center gap-1"><Calendar size={11} className="text-emerald-500" />{new Date(m.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>}
                                        {m.time && <span className="flex items-center gap-1"><Clock size={11} className="text-blue-400" />{m.time}</span>}
                                        {m.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-red-400" />{m.location}</span>}
                                        <span className="flex items-center gap-1"><Users size={11} className="text-purple-400" />by {m.organizer}</span>
                                    </div>

                                    {/* Assigned users */}
                                    {m.assignedUsers?.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            <UserCheck size={12} className="text-indigo-400 shrink-0" />
                                            {m.assignedUsers.map((u, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-100">
                                                    {u.name || u}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-slate-300 font-bold italic">No users assigned yet</p>
                                    )}

                                    {/* Meeting link */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Video size={11} className="text-blue-500 shrink-0" />
                                            <span className="text-[10px] font-mono text-blue-700 truncate flex-1">{m.meetingLink}</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <CopyButton text={m.meetingLink} />
                                            <a href={m.meetingLink} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition">
                                                <ExternalLink size={10} /> Open
                                            </a>
                                            <button onClick={() => handleRegenerate(m._id)}
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                                                <RefreshCw size={10} /> New Link
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-1 border-t border-slate-50">
                                        <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                                            <Pencil size={12} /> Edit
                                        </button>
                                        <button onClick={() => setDeleteId(m._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-[10px] font-black uppercase text-slate-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronLeft size={18} /></button>
                                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── ADD/EDIT MODAL ── */}
            {modal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Meeting" : "New Meeting"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meeting Title *</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inp} placeholder="e.g. Q1 Sprint Review" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Date *</label>
                                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Time</label>
                                    <input placeholder="e.g. 10:00 - 11:00" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Location / Room</label>
                                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inp} placeholder="Conference Room A" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Organizer</label>
                                    <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} className={inp} placeholder="Admin" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                        {["Scheduled", "Ongoing", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className={`${inp} resize-none`} placeholder="Meeting agenda or details…" />
                                </div>

                                {/* Meeting Link */}
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meeting Link (Jitsi auto-generated)</label>
                                    <div className="flex gap-2">
                                        <input value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} className={`${inp} flex-1 font-mono text-xs`} />
                                        <button type="button" onClick={() => setForm(p => ({ ...p, meetingLink: generateLink() }))}
                                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition text-xs font-bold flex items-center gap-1 shrink-0">
                                            <RefreshCw size={12} /> New
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Assign Users */}
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 flex items-center gap-1">
                                    <UserCheck size={10} /> Assign to Users — they will see this meeting + join link
                                </label>

                                {form.assignedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {users.filter(u => form.assignedUsers.includes(u._id)).map(u => (
                                            <span key={u._id} onClick={() => toggleUser(u._id)}
                                                className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-red-100 hover:text-red-600 transition">
                                                {u.name} ✕
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="relative mb-2">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input value={userSrch} onChange={e => setUserSrch(e.target.value)} placeholder="Search users…"
                                        className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-indigo-100" />
                                </div>

                                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-44 overflow-y-auto">
                                    {filteredUsers.length === 0 ? (
                                        <p className="text-center text-sm text-slate-400 py-5">No users found</p>
                                    ) : filteredUsers.map(u => {
                                        const sel = form.assignedUsers.includes(u._id);
                                        return (
                                            <div key={u._id} onClick={() => toggleUser(u._id)}
                                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition border-b border-slate-50 last:border-0 ${sel ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${sel ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}>
                                                    {sel && <span className="text-white text-[9px] font-black">✓</span>}
                                                </div>
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs shrink-0">
                                                    {u.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${sel ? "text-indigo-700" : "text-slate-700"}`}>{u.name}</p>
                                                    <p className="text-[10px] text-slate-400">{u.email}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1">{form.assignedUsers.length} user{form.assignedUsers.length !== 1 ? "s" : ""} assigned</p>
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex gap-3 shrink-0">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update Meeting" : "Create Meeting"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRM ── */}
            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Meeting?</h2>
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