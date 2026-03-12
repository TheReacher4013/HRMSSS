import { useState, useEffect } from "react";
import { Pencil, Trash2, Layers, Plus, AlertCircle, X, Loader2, CheckCircle, Building2 } from "lucide-react";
import { departmentAPI } from "../../services/api";

const ITEMS_PER_PAGE = 5;

export default function SubDepartment() {
  const [list, setList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptLoading, setDeptLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [subName, setSubName] = useState("");
  const [parentId, setParentId] = useState("");
  const [status, setStatus] = useState("Active");
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedData = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toast = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  // ── fetch sub-depts + parent depts ────────────────────────────────────
  useEffect(() => {
    const loadSubs = async () => {
      try {
        const res = await departmentAPI.getAllSubs();
        setList(res.data || []);
      } catch (e) {
        toast("Failed to load sub-departments.", "error");
      } finally {
        setLoading(false);
      }
    };

    const loadDepts = async () => {
      try {
        const res = await departmentAPI.getAll();
        setDepartments(res.data || []);
      } catch (e) {
        console.error("Dept load error:", e);
      } finally {
        setDeptLoading(false);
      }
    };

    loadSubs();
    loadDepts();
  }, []);

  // ── modal helpers ─────────────────────────────────────────────────────
  const onAdd = () => {
    setCurrent(null);
    setSubName("");
    setParentId("");
    setStatus("Active");
    setModalOpen(true);
  };

  const onEdit = (item) => {
    setCurrent(item);
    setSubName(item.name || "");
    setParentId(item.department?._id || item.department || "");
    setStatus(item.status || "Active");
    setModalOpen(true);
  };

  // ── save ──────────────────────────────────────────────────────────────
  const saveSub = async () => {
    if (!subName.trim()) { toast("Sub-department name is required.", "error"); return; }
    if (!parentId) { toast("Please select a parent department.", "error"); return; }
    setSaving(true);
    try {
      const body = { name: subName.trim(), department: parentId, status };
      if (current) {
        const res = await departmentAPI.updateSub(current._id || current.id, body);
        setList(prev => prev.map(d => (d._id || d.id) === (current._id || current.id) ? res.data : d));
        toast("Sub-department updated.");
      } else {
        const res = await departmentAPI.createSub(body);
        setList(prev => [res.data, ...prev]);
        toast("Sub-department created.");
      }
      setModalOpen(false);
    } catch (e) {
      toast(e.message || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── delete ────────────────────────────────────────────────────────────
  const onDelete = (item) => { setCurrent(item); setDeleteOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await departmentAPI.deleteSub(current._id || current.id);
      setList(prev => prev.filter(d => (d._id || d.id) !== (current._id || current.id)));
      toast("Sub-department deleted.");
      setPage(p => (p > Math.ceil((list.length - 1) / ITEMS_PER_PAGE) ? Math.max(p - 1, 1) : p));
    } catch (e) {
      toast("Delete failed.", "error");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  // ── helper: get parent dept name for a sub ────────────────────────────
  const getParentName = (item) =>
    item.department?.name ||
    departments.find(d => d._id === item.department)?.name ||
    "";

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Layers className="text-emerald-600" size={28} /> Sub Department List
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage specialized units within your departments</p>
          </div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
          >
            <Plus size={20} /> Add Sub Department
          </button>
        </div>

        {/* Toast */}
        {msg.text && (
          <div className={`mb-4 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error"
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}>
            {msg.type === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
            {msg.text}
          </div>
        )}

        {/* Desktop table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Sl No.</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Sub Department</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Department</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">No sub-departments yet.</td></tr>
                  ) : paginatedData.map((d, i) => (
                    <tr key={d._id || d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-slate-400">
                        {String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-700">{d.name}</td>
                      <td className="px-6 py-5">
                        {getParentName(d) ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                            <Building2 size={11} className="text-slate-400" /> {getParentName(d)}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg ${d.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                          }`}>{d.status || "Active"}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => onEdit(d)} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"><Pencil size={16} /></button>
                          <button onClick={() => onDelete(d)} className="p-2.5 bg-white border border-slate-100 text-red-600 rounded-xl hover:border-red-200 hover:shadow-sm transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {paginatedData.map((d, i) => (
                <div key={d._id || d.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-[10px] font-black text-slate-300 uppercase">#{(page - 1) * ITEMS_PER_PAGE + i + 1}</div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${d.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{d.status || "Active"}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{d.name}</h3>
                  {getParentName(d) && (
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-4">
                      <Building2 size={11} /> {getParentName(d)}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => onEdit(d)} className="flex-1 bg-slate-50 text-blue-600 font-bold py-3 rounded-2xl text-xs active:scale-95">Edit Detail</button>
                    <button onClick={() => onDelete(d)} className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-2xl text-xs active:scale-95">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${page === i + 1 ? "bg-[#0a4d44] text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"}`}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ADD / EDIT MODAL ── */}
        {modalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">

              {/* Modal header strip */}
              <div className="bg-[#0a4d44] px-8 py-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{current ? "Edit Sub Department" : "New Sub Department"}</h3>
                  <p className="text-emerald-200 text-xs mt-0.5">Update your organization structure</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8 space-y-5">

                {/* Sub-department name */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-1">
                    Sub Department Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all"
                    placeholder="e.g. Backend Engineering"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveSub()}
                  />
                </div>

                {/* Parent department dropdown — dynamic */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-1">
                    Parent Department <span className="text-red-400">*</span>
                    {deptLoading && <Loader2 className="inline ml-2 animate-spin" size={11} />}
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    disabled={deptLoading}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all appearance-none text-slate-700 disabled:opacity-60"
                  >
                    <option value="">— Select Department —</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                  {departments.length === 0 && !deptLoading && (
                    <p className="text-xs text-amber-500 font-medium ml-1 mt-1">No departments found. Please create a department first.</p>
                  )}
                </div>

                {/* Status toggle */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-3 block">Status</label>
                  <div className="flex gap-4">
                    {["Active", "Inactive"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${status === s ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100 text-slate-400"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <button
                  onClick={saveSub}
                  disabled={saving}
                  className="w-full bg-[#0a4d44] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save Sub Department"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM ── */}
        {deleteOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteOpen(false)} />
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete Sub Dept?</h2>
              <p className="text-slate-500 text-sm mb-8">
                Removing <span className="font-bold text-slate-700">"{current?.name}"</span> cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteOpen(false)} className="py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 border border-slate-100 transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} className="py-4 rounded-2xl font-bold bg-red-500 text-white shadow-lg shadow-red-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-all">
                  {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}