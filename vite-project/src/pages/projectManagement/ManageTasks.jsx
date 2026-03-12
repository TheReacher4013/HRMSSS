import { useState, useEffect, useMemo } from "react";
import {
    Plus, Pencil, Trash2, X, Search, ListTodo, Loader2,
    CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Calendar,
} from "lucide-react";
import { projectAPI, employeeAPI } from "../../services/api";

const STATUS_COLORS = {
    "To Do": "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-50 text-blue-700",
    "Review": "bg-purple-50 text-purple-700",
    "Done": "bg-emerald-50 text-emerald-700",
};
const PRIORITY_COLORS = { Low: "bg-gray-100 text-gray-500", Medium: "bg-yellow-50 text-yellow-600", High: "bg-red-50 text-red-600" };
const PER_PAGE = 10;
const EMPTY = { title: "", project: "", assignedTo: "", assigneeName: "", dueDate: "", priority: "Medium", status: "To Do", description: "" };
const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

export default function ManageTasks() {
    const [rows, setRows] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
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

    const toast = (t, type = "success") => { setMsg({ text: t, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        Promise.all([projectAPI.getTasks(), projectAPI.getAll(), employeeAPI.getAll()])
            .then(([t, p, e]) => { setRows(t.data || []); setProjects(p.data || []); setEmployees(e.data || []); })
            .catch(() => toast("Failed to load.", "error"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r => {
        const matchS = statusF === "All" || r.status === statusF;
        const matchQ = `${r.title} ${r.assigneeName || r.assignedTo?.name || ""} ${r.project?.title || ""}`.toLowerCase().includes(search.toLowerCase());
        return matchS && matchQ;
    }), [rows, search, statusF]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = (r) => {
        setEditId(r._id);
        setForm({
            title: r.title, project: r.project?._id || r.project || "",
            assignedTo: r.assignedTo?._id || r.assignedTo || "",
            assigneeName: r.assigneeName || r.assignedTo?.name || "",
            dueDate: r.dueDate?.slice(0, 10) || "",
            priority: r.priority, status: r.status, description: r.description || "",
        });
        setModal(true);
    };

    const handleEmpChange = (id) => {
        const emp = employees.find(e => e._id === id);
        setForm(p => ({ ...p, assignedTo: id, assigneeName: emp?.name || "" }));
    };

    const handleSave = async () => {
        if (!form.title.trim()) { toast("Task title is required.", "error"); return; }
        setSaving(true);
        try {
            if (editId) {
                const res = await projectAPI.updateTask(editId, form);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Task updated.");
            } else {
                const res = await projectAPI.createTask(form);
                setRows(p => [res.data, ...p]);
                toast("Task created.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await projectAPI.deleteTask(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Task deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    const quickStatus = async (id, status) => {
        try { const res = await projectAPI.updateTask(id, { status }); setRows(p => p.map(r => r._id === id ? res.data : r)); }
        catch { toast("Update failed.", "error"); }
    };

    // Count by status for filter tabs
    const countByStatus = (s) => rows.filter(r => r.status === s).length;

    const isOverdue = (d) => d && new Date(d) < new Date() && true;

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl"><ListTodo className="text-purple-600" size={22} /></div>Manage Tasks
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Create tasks, assign to team members, track progress</p>
                    </div>
                    <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> New Task
                    </button>
                </div>

                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center mb-6">
                    {["All", "To Do", "In Progress", "Review", "Done"].map(s => (
                        <button key={s} onClick={() => { setStatusF(s); setPage(1); }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${statusF === s ? "bg-[#0a4d44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                            {s} ({s === "All" ? rows.length : countByStatus(s)})
                        </button>
                    ))}
                    <div className="relative ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input placeholder="Search…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 ring-purple-100 w-48" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" size={32} /></div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                        {["Task", "Project", "Assigned To", "Due Date", "Priority", "Status", "Actions"].map(h => <th key={h} className="px-5 py-5">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paged.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">{rows.length === 0 ? "No tasks yet." : "No results."}</td></tr>
                                    ) : paged.map(r => {
                                        const assignee = r.assigneeName || r.assignedTo?.name || "—";
                                        const due = r.dueDate?.slice(0, 10);
                                        const overdue = r.status !== "Done" && isOverdue(r.dueDate);
                                        return (
                                            <tr key={r._id} className="group hover:bg-slate-50/50 transition">
                                                <td className="px-5 py-4">
                                                    <p className="font-bold text-slate-800 text-sm">{r.title}</p>
                                                    {r.description && <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[160px]">{r.description}</p>}
                                                </td>
                                                <td className="px-5 py-4 text-xs text-blue-600 font-bold">{r.project?.title || "—"}</td>
                                                <td className="px-5 py-4">
                                                    {assignee !== "—" ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[9px] font-black text-purple-700">
                                                                {assignee.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-700">{assignee}</span>
                                                        </div>
                                                    ) : <span className="text-xs text-slate-400">Unassigned</span>}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {due ? (
                                                        <span className={`flex items-center gap-1 text-xs font-bold ${overdue ? "text-red-500" : "text-slate-500"}`}>
                                                            <Calendar size={11} />{due}{overdue ? " ⚠" : ""}
                                                        </span>
                                                    ) : <span className="text-xs text-slate-400">—</span>}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${PRIORITY_COLORS[r.priority]}`}>{r.priority}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <select value={r.status} onChange={e => quickStatus(r._id, e.target.value)}
                                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}>
                                                        {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
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

                        {/* Mobile */}
                        <div className="md:hidden space-y-3">
                            {paged.map(r => {
                                const assignee = r.assigneeName || r.assignedTo?.name || "—";
                                return (
                                    <div key={r._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-bold text-slate-800">{r.title}</h3>
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                                        </div>
                                        <p className="text-xs text-blue-500 mb-1">{r.project?.title || "—"}</p>
                                        <p className="text-xs text-slate-500 mb-3">👤 {assignee} • Due: {r.dueDate?.slice(0, 10) || "—"}</p>
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
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 disabled:opacity-30"><ChevronLeft size={18} /></button>
                                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Task" : "New Task"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Task Title *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inp} placeholder="Task description" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Project</label>
                                <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} className={inp}>
                                    <option value="">— Select Project —</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Assign To</label>
                                <select value={form.assignedTo} onChange={e => handleEmpChange(e.target.value)} className={inp}>
                                    <option value="">— Unassigned —</option>
                                    {employees.map(e => <option key={e._id} value={e._id}>{e.name} {e.designation ? `(${e.designation})` : ""}</option>)}
                                </select>
                                {form.assigneeName && (
                                    <div className="flex items-center gap-2 mt-2 bg-purple-50 px-3 py-2 rounded-xl">
                                        <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-[9px] font-black text-purple-700">{form.assigneeName.slice(0, 2).toUpperCase()}</div>
                                        <span className="text-xs font-bold text-purple-700">Assigned to: {form.assigneeName}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Due Date</label>
                                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={inp} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Priority</label>
                                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className={inp}>
                                    {["Low", "Medium", "High"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                    {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Notes</label>
                                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inp} placeholder="Optional task notes…" />
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update Task" : "Create Task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Task?</h2>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={confirmDelete} disabled={deleting}
                                className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Confirm Delete"}
                            </button>
                            <button onClick={() => setDeleteId(null)} className="w-full py-3.5 rounded-2xl font-bold text-slate-400">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}