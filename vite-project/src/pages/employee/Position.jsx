import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Briefcase, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { positionAPI } from "../../services/api";

const ITEMS_PER_PAGE = 8;

export default function PositionPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");

  const toast = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  useEffect(() => {
    positionAPI.getAll()
      .then(r => setList(r.data || []))
      .catch(() => toast("Failed to load positions"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditItem(null); setName(""); setStatus("Active"); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setName(item.name); setStatus(item.status); setModalOpen(true); };

  const handleSave = async () => {
    if (!name.trim()) { toast("Name is required"); return; }
    setSaving(true);
    try {
      if (editItem) {
        const res = await positionAPI.update(editItem._id, { name: name.trim(), status });
        setList(p => p.map(x => x._id === editItem._id ? res.data : x));
        toast("Position updated ✅");
      } else {
        const res = await positionAPI.create({ name: name.trim(), status });
        setList(p => [...p, res.data]);
        toast("Position added ✅");
      }
      setModalOpen(false);
    } catch (e) { toast(e.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await positionAPI.delete(deleteId);
      setList(p => p.filter(x => x._id !== deleteId));
      toast("Deleted");
    } catch (e) { toast(e.message); }
    finally { setDeleteId(null); }
  };

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paged = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 pt-24">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl"><Briefcase className="text-indigo-600" size={22} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Positions</h1>
              <p className="text-slate-400 text-sm">Manage job positions — used in employee forms</p>
            </div>
          </div>
          <button onClick={openAdd}
            className="bg-[#0a4d44] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-slate-800 transition shadow-lg">
            <Plus size={16} /> Add Position
          </button>
        </div>

        {msg && <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-2xl">{msg}</div>}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Position Name</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan="4" className="py-16 text-center text-slate-400">No positions yet. Click "Add Position".</td></tr>
                ) : paged.map((item, i) => (
                  <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-slate-400 text-xs font-bold">{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"
                        }`}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                          <Pencil size={14} className="text-slate-500" />
                        </button>
                        <button onClick={() => setDeleteId(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">{list.length} positions total</p>
                <div className="flex gap-1">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-7">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-slate-800">{editItem ? "Edit Position" : "Add Position"}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Position Name *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-indigo-100" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-indigo-100">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-[2] py-3 bg-[#0a4d44] text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : editItem ? "Update" : "Add Position"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl">
            <Trash2 size={32} className="mx-auto text-red-400 mb-3" />
            <h2 className="font-black text-slate-800 mb-1">Delete Position?</h2>
            <p className="text-slate-400 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-slate-200 py-3 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}