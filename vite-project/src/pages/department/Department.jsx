import { useState, useEffect } from "react";
import { Pencil, Trash2, Building2, Plus, AlertCircle, X, Loader2, CheckCircle } from "lucide-react";
import { departmentAPI } from "../../services/api";

const ITEMS_PER_PAGE = 5;

export default function Department() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [status, setStatus] = useState("Active");
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedData = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toast = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  // ── fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await departmentAPI.getAll();
        setList(res.data || []);
      } catch (e) {
        toast("Failed to load departments.", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── modal helpers ─────────────────────────────────────────────────────
  const onAdd = () => {
    setCurrent(null);
    setDeptName("");
    setStatus("Active");
    setModalOpen(true);
  };

  const onEdit = (item) => {
    setCurrent(item);
    setDeptName(item.name);
    setStatus(item.status || "Active");
    setModalOpen(true);
  };

  // ── save ──────────────────────────────────────────────────────────────
  const saveDepartment = async () => {
    if (!deptName.trim()) return;
    setSaving(true);
    try {
      const body = { name: deptName.trim(), status };
      if (current) {
        const res = await departmentAPI.update(current._id || current.id, body);
        setList(prev => prev.map(d => (d._id || d.id) === (current._id || current.id) ? res.data : d));
        toast("Department updated.");
      } else {
        const res = await departmentAPI.create(body);
        setList(prev => [res.data, ...prev]);
        toast("Department created.");
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
      await departmentAPI.delete(current._id || current.id);
      setList(prev => prev.filter(d => (d._id || d.id) !== (current._id || current.id)));
      toast("Department deleted.");
      setPage(p => (p > Math.ceil((list.length - 1) / ITEMS_PER_PAGE) ? Math.max(p - 1, 1) : p));
    } catch (e) {
      toast("Delete failed.", "error");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Building2 className="text-emerald-600" size={28} /> Department Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">Create and organize your company structure</p>
          </div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
          >
            <Plus size={20} /> Add Department
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
            <div className="hidden sm:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Sl</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Department Name</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">No departments yet. Click Add Department to create one.</td></tr>
                  ) : paginatedData.map((d, i) => (
                    <tr key={d._id || d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-slate-400">
                        {String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-700">{d.name}</td>
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
            <div className="sm:hidden space-y-4">
              {paginatedData.map((d, i) => (
                <div key={d._id || d.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-bold text-slate-400">#{(page - 1) * ITEMS_PER_PAGE + i + 1}</div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${d.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{d.status || "Active"}</span>
                  </div>
                  <p className="font-bold text-slate-800 text-lg">{d.name}</p>
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => onEdit(d)} className="flex-1 bg-slate-50 text-blue-600 font-bold py-3 rounded-2xl text-sm active:scale-95">Edit</button>
                    <button onClick={() => onDelete(d)} className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-2xl text-sm active:scale-95">Delete</button>
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
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-800">{current ? "Edit Department" : "New Department"}</h3>
                  <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Department Name <span className="text-red-400">*</span></label>
                    <input
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all"
                      placeholder="e.g. Creative Design"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveDepartment()}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-3 block">Set Availability</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Active", "Inactive"].map(s => (
                        <button key={s} onClick={() => setStatus(s)} className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all ${status === s ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100 text-slate-400"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={saveDepartment}
                  disabled={saving}
                  className="w-full mt-8 bg-[#0a4d44] text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-900/10 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Confirm & Save"}
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
              <h2 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h2>
              <p className="text-slate-500 text-sm mb-8">This will permanently remove <span className="font-bold text-slate-700">"{current?.name}"</span>.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteOpen(false)} className="py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 border border-slate-100">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} className="py-4 rounded-2xl font-bold bg-red-500 text-white shadow-lg shadow-red-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}