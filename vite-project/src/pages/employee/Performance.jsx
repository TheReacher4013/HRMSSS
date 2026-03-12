import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Trophy, Search, Calendar, User, X, BarChart3, ChevronLeft, ChevronRight, Loader2, ChevronDown, CheckCircle, AlertCircle } from "lucide-react";
import { employeeAPI } from "../../services/api";

const EmployeePerformance = () => {
    // ── data ──────────────────────────────────────────────────────────────
    const [data,       setData]       = useState([]);
    const [employees,  setEmployees]  = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [empLoading, setEmpLoading] = useState(true);
    const [saving,     setSaving]     = useState(false);
    const [msg,        setMsg]        = useState({ text: "", type: "" });

    // ── ui ────────────────────────────────────────────────────────────────
    const [showForm,     setShowForm]     = useState(false);
    const [editId,       setEditId]       = useState(null);
    const [search,       setSearch]       = useState("");
    const [currentPage,  setCurrentPage]  = useState(1);

    // ── form ──────────────────────────────────────────────────────────────
    const blankForm = { employeeId: "", name: "", score: "", date: "" };
    const [form,       setForm]       = useState(blankForm);
    const [empSearch,  setEmpSearch]  = useState("");
    const [dropOpen,   setDropOpen]   = useState(false);
    const dropRef = useRef(null);

    const entriesPerPage = 5;

    const toast = (text, type = "success") => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 4000);
    };

    // ── fetch employees + performance records ─────────────────────────────
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const res = await employeeAPI.getAll();
                setEmployees(res.data || []);
            } catch (e) { console.error(e); }
            finally { setEmpLoading(false); }
        };
        // Performance records — try API, fall back to empty
        const loadRecords = async () => {
            try {
                // Try a performance endpoint if it exists, else start empty
                const res = await fetch("/api/performance", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json.data || []);
                }
            } catch (e) { /* no performance API yet — start empty */ }
            finally { setLoading(false); }
        };
        loadEmployees();
        loadRecords();
    }, []);

    // close dropdown on outside click
    useEffect(() => {
        const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // ── filtered employees for dropdown ───────────────────────────────────
    const filteredEmployees = useMemo(() => {
        const q = empSearch.toLowerCase();
        return employees.filter(e =>
            e.name?.toLowerCase().includes(q) ||
            e.employeeId?.toLowerCase().includes(q) ||
            e.department?.name?.toLowerCase().includes(q)
        );
    }, [employees, empSearch]);

    const selectEmployee = (emp) => {
        setForm(prev => ({ ...prev, employeeId: emp._id, name: emp.name }));
        setEmpSearch(emp.name);
        setDropOpen(false);
    };

    // ── open/close form ───────────────────────────────────────────────────
    const openAdd = () => {
        setForm(blankForm); setEmpSearch(""); setEditId(null);
        setDropOpen(false); setShowForm(true);
    };
    const openEdit = (item) => {
        setForm({ employeeId: item.employeeId || "", name: item.name, score: item.score, date: item.date });
        setEmpSearch(item.name);
        setEditId(item._id || item.id);
        setDropOpen(false);
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditId(null); setDropOpen(false); };

    // ── save ──────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name) { toast("Please select an employee.", "error"); return; }
        setSaving(true);
        try {
            const body = { ...form, score: +form.score };
            if (editId) {
                // Try API update; if not available, update local state
                try {
                    const res = await fetch(`/api/performance/${editId}`, {
                        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                        body: JSON.stringify(body)
                    });
                    if (res.ok) { const json = await res.json(); setData(prev => prev.map(r => (r._id || r.id) === editId ? json.data : r)); }
                    else { setData(prev => prev.map(r => (r._id || r.id) === editId ? { ...r, ...body } : r)); }
                } catch { setData(prev => prev.map(r => (r._id || r.id) === editId ? { ...r, ...body } : r)); }
                toast("Record updated.");
            } else {
                try {
                    const res = await fetch("/api/performance", {
                        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                        body: JSON.stringify(body)
                    });
                    if (res.ok) { const json = await res.json(); setData(prev => [json.data, ...prev]); }
                    else { setData(prev => [{ id: Date.now(), ...body }, ...prev]); }
                } catch { setData(prev => [{ id: Date.now(), ...body }, ...prev]); }
                toast("Performance record added.");
            }
            closeForm();
        } catch (e) {
            toast("Failed to save.", "error");
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this performance record?")) return;
        try {
            await fetch(`/api/performance/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        } catch {}
        setData(prev => prev.filter(i => (i._id || i.id) !== id));
        toast("Deleted.");
    };

    // ── filter & paginate ─────────────────────────────────────────────────
    const filteredData = useMemo(() =>
        data.filter(item => item.name?.toLowerCase().includes(search.toLowerCase())),
    [data, search]);

    const totalPages   = Math.ceil(filteredData.length / entriesPerPage);
    const start        = (currentPage - 1) * entriesPerPage;
    const paginatedData = filteredData.slice(start, start + entriesPerPage);

    // ── render ─────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-xl"><Trophy className="text-amber-600" size={24} /></div>
                            Performance Analytics
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Track and evaluate employee contributions</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
                    >
                        <Plus size={18} /> Add Performance
                    </button>
                </div>

                {/* Toast */}
                {msg.text && (
                    <div className={`mb-4 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
                        {msg.text}
                    </div>
                )}

                {/* Inline add/edit form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h3 className="font-bold text-slate-800">{editId ? "Update Record" : "New Performance Entry"}</h3>
                            <button onClick={closeForm} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Employee name — dynamic dropdown */}
                            <div className="space-y-1" ref={dropRef}>
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                                    Employee Name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={16} />
                                    <input
                                        placeholder={empLoading ? "Loading employees…" : "Search employee…"}
                                        value={empSearch}
                                        disabled={empLoading}
                                        onChange={(e) => { setEmpSearch(e.target.value); setForm(prev => ({ ...prev, name: e.target.value, employeeId: "" })); setDropOpen(true); }}
                                        onFocus={() => setDropOpen(true)}
                                        className="w-full bg-slate-50 border border-slate-100 pl-11 pr-9 py-3 rounded-xl text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all disabled:opacity-60"
                                    />
                                    {empLoading
                                        ? <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" size={15} />
                                        : <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform cursor-pointer ${dropOpen ? "rotate-180" : ""}`} size={15} onClick={() => setDropOpen(v => !v)} />
                                    }

                                    {dropOpen && !empLoading && (
                                        <div className="absolute z-20 top-full mt-1 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                                            {filteredEmployees.length === 0 ? (
                                                <p className="px-4 py-3 text-sm text-slate-400 text-center">
                                                    {employees.length === 0 ? "No employees in system" : "No match found"}
                                                </p>
                                            ) : filteredEmployees.map(emp => (
                                                <button key={emp._id} type="button" onClick={() => selectEmployee(emp)}
                                                    className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors flex items-center justify-between gap-2 ${form.employeeId === emp._id ? "bg-emerald-50" : ""}`}>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                                                        {emp.department?.name && <p className="text-[10px] text-slate-400">{emp.department.name}</p>}
                                                    </div>
                                                    {emp.employeeId && <span className="text-[10px] text-slate-400 font-mono shrink-0">{emp.employeeId}</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {form.employeeId && <p className="text-[11px] text-emerald-600 font-bold ml-1 flex items-center gap-1"><CheckCircle size={11} /> Selected</p>}
                            </div>

                            {/* Score */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Performance Score <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input required type="number" placeholder="0 – 1000" value={form.score}
                                        onChange={(e) => setForm({ ...form, score: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all" />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Record Date <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input required type="date" value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={closeForm} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={saving}
                                    className="bg-[#0a4d44] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
                                    {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : editId ? "Update Analytics" : "Submit Performance"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search */}
                <div className="relative w-full max-w-md ml-auto mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input placeholder="Search employee..." value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-4 ring-emerald-50 transition-all" />
                </div>

                {/* Desktop table */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Sl No.</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Employee Details</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Score Analytics</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Create Date</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedData.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                                            {data.length === 0 ? "No records yet. Click Add Performance to create one." : `No results for "${search}"`}
                                        </td></tr>
                                    ) : paginatedData.map((item, i) => {
                                        const rowId = item._id || item.id;
                                        return (
                                            <tr key={rowId} className="group hover:bg-slate-50/50 transition-all">
                                                <td className="px-6 py-5 text-sm font-bold text-slate-300">{String(start + i + 1).padStart(2, "0")}</td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-slate-700">{item.name}</p>
                                                    {item.department?.name && <p className="text-[10px] text-slate-400 font-bold">{item.department.name}</p>}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-sm font-black ${item.score > 100 ? "text-emerald-600" : "text-blue-600"}`}>{item.score}</span>
                                                        <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${item.score > 100 ? "bg-emerald-400" : "bg-blue-400"}`} style={{ width: `${Math.min((item.score / 600) * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-500 italic">{item.date}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEdit(item)} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 transition-all"><Pencil size={16} /></button>
                                                        <button onClick={() => handleDelete(rowId)} className="p-2.5 bg-white border border-slate-100 text-red-600 rounded-xl hover:border-red-200 transition-all"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-4">
                            {paginatedData.map((item) => {
                                const rowId = item._id || item.id;
                                return (
                                    <div key={rowId} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Trophy size={20} /></div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-emerald-600">{item.score} pts</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">{item.date}</p>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h3>
                                        {item.department?.name && <p className="text-xs text-slate-400 mb-5">{item.department.name}</p>}
                                        <div className="flex gap-2 border-t border-slate-50 pt-4">
                                            <button onClick={() => openEdit(item)} className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95"><Pencil size={14} /> Edit</button>
                                            <button onClick={() => handleDelete(rowId)} className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95"><Trash2 size={14} /> Delete</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-8 px-2">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Page {currentPage} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all"><ChevronLeft size={20} /></button>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all"><ChevronRight size={20} /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmployeePerformance;