import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Calendar, CheckCircle, AlertCircle, Gift } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

const TYPE_COLORS = {
  National: "bg-blue-100 text-blue-700",
  Religious: "bg-purple-100 text-purple-700",
  Optional: "bg-yellow-100 text-yellow-700",
  Company: "bg-emerald-100 text-emerald-700",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EMPTY = { name: "", date: "", description: "", type: "National" };

export default function WeeklyHoliday() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

  const fetchHolidays = async () => {
    try {
      const res = await fetch(`${BASE}/holidays`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setHolidays(data.data || []);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHolidays(); }, []);

  const openAdd = () => { setEditId(null); setForm(EMPTY); setModal(true); };
  const openEdit = (h) => {
    setEditId(h._id);
    setForm({ name: h.name, date: h.date?.slice(0, 10) || "", description: h.description || "", type: h.type || "National" });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast("Name is required", "error"); return; }
    if (!form.date) { toast("Date is required", "error"); return; }
    setSaving(true);
    try {
      const url = editId ? `${BASE}/holidays/${editId}` : `${BASE}/holidays`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (editId) setHolidays(p => p.map(x => x._id === editId ? data.data : x));
      else setHolidays(p => [...p, data.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      toast(editId ? "Holiday updated ✅" : "Holiday added ✅");
      setModal(false);
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/holidays/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setHolidays(p => p.filter(x => x._id !== deleteId));
      toast("Holiday deleted");
    } catch (e) { toast(e.message, "error"); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const years = [...new Set(holidays.map(h => new Date(h.date).getFullYear()))].sort((a, b) => b - a);
  if (!years.includes(yearFilter)) years.push(yearFilter);

  const filtered = holidays.filter(h => new Date(h.date).getFullYear() === yearFilter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 transition";

  return (
    <div className="min-h-screen bg-[#f0f4f4] p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0a4d44] rounded-2xl shadow-lg">
              <Gift className="text-emerald-300" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f2e2e]">Holidays</h1>
              <p className="text-slate-400 text-sm mt-0.5">Add & manage company holidays — users can see them</p>
            </div>
          </div>
          <button onClick={openAdd}
            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
            <Plus size={18} /> Add Holiday
          </button>
        </div>

        {/* Toast */}
        {msg.text && (
          <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
            {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
          </div>
        )}

        {/* Year filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {years.map(y => (
            <button key={y} onClick={() => setYearFilter(y)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition border ${yearFilter === y ? "bg-[#0a4d44] text-white border-transparent" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {y} ({holidays.filter(h => new Date(h.date).getFullYear() === y).length})
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {["National", "Religious", "Optional", "Company"].map(t => {
            const count = filtered.filter(h => h.type === t).length;
            return (
              <div key={t} className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-2xl font-black text-[#0f2e2e]">{count}</p>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TYPE_COLORS[t]}`}>{t}</span>
              </div>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <Gift size={48} className="mx-auto text-slate-200 mb-3" />
            <p className="font-black text-slate-400 text-base">No holidays for {yearFilter}</p>
            <p className="text-slate-300 text-sm mt-1">Click "+ Add Holiday" to add one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">#</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Holiday</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Day</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h, i) => {
                  const d = new Date(h.date);
                  const isUpcoming = d >= new Date();
                  return (
                    <tr key={h._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4 text-slate-400 font-bold text-xs">{i + 1}</td>
                      <td className="px-5 py-4">
                        <p className={`font-black text-sm ${isUpcoming ? "text-[#0f2e2e]" : "text-slate-400"}`}>{h.name}</p>
                        {h.description && <p className="text-[10px] text-slate-400 mt-0.5">{h.description}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex flex-col items-center justify-center text-center leading-none ${isUpcoming ? "bg-[#0a4d44] text-white" : "bg-slate-100 text-slate-400"}`}>
                            <span className="text-[8px] font-black uppercase">{MONTHS[d.getMonth()]}</span>
                            <span className="text-sm font-black">{d.getDate()}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-600">{d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-slate-500 text-xs font-bold">
                        {d.toLocaleDateString("en-IN", { weekday: "long" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${TYPE_COLORS[h.type]}`}>{h.type}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(h)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteId(h._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-slate-800">{editId ? "Edit Holiday" : "Add Holiday"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
            </div>
            <div className="p-7 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Holiday Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="e.g. Diwali" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inp}>
                  {["National", "Religious", "Optional", "Company"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description (optional)</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inp} placeholder="Short note…" />
              </div>
            </div>
            <div className="px-7 pb-7 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update" : "Add Holiday"}
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
            <h2 className="text-lg font-black text-slate-800 mb-1">Delete Holiday?</h2>
            <p className="text-slate-400 text-sm">This cannot be undone.</p>
            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleDelete} disabled={deleting}
                className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Yes, Delete"}
              </button>
              <button onClick={() => setDeleteId(null)} className="w-full py-3.5 rounded-2xl font-bold text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}