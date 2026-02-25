import React, { useState, useEffect } from "react";
import { Megaphone, Pencil, Trash2, Plus, Search, X, Loader2 } from "lucide-react";
import { noticeAPI } from "../../services/api";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const emptyForm = { type: "General", description: "", date: new Date().toISOString().slice(0,10), by: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const res = await noticeAPI.getAll();
      setNotices(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = notices.filter(n =>
    n.type?.toLowerCase().includes(search.toLowerCase()) ||
    n.description?.toLowerCase().includes(search.toLowerCase())
  );

  const typeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'urgent':  return 'border-l-red-500 bg-red-50 text-red-700';
      case 'holiday': return 'border-l-emerald-500 bg-emerald-50 text-emerald-700';
      case 'event':   return 'border-l-purple-500 bg-purple-50 text-purple-700';
      default:        return 'border-l-blue-500 bg-blue-50 text-blue-700';
    }
  };

  const handleSave = async () => {
    if (!form.description || !form.by) return alert("Please fill all fields");
    try {
      if (editId) {
        const res = await noticeAPI.update(editId, form);
        setNotices(notices.map(n => n._id === editId ? res.data : n));
      } else {
        const res = await noticeAPI.create(form);
        setNotices([res.data, ...notices]);
      }
      setForm(emptyForm); setShowForm(false); setEditId(null);
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (n) => {
    setForm({ type: n.type, description: n.description, date: n.date?.slice(0,10), by: n.by });
    setEditId(n._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await noticeAPI.delete(id);
      setNotices(notices.filter(n => n._id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Megaphone className="text-[#0a4d44]" /> Announcement Hub
            </h1>
            <p className="text-slate-500 text-sm">Keep everyone updated with latest news</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition shadow-md">
            <Plus size={18} /> Create Notice
          </button>
        </div>

        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 ring-emerald-200" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0a4d44]" size={36} /></div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 && <div className="text-center py-16 text-slate-400 text-sm">No notices found</div>}
            {filtered.map(notice => (
              <div key={notice._id} className={`bg-white rounded-2xl shadow-sm border-l-4 p-5 flex justify-between items-start gap-4 ${typeStyle(notice.type)}`}>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-widest opacity-70">{notice.type}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">{notice.by}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{new Date(notice.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</span>
                  </div>
                  <p className="text-slate-700 text-sm">{notice.description}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => handleEdit(notice)} className="p-2 hover:bg-white/80 rounded-xl transition"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(notice._id)} className="p-2 hover:bg-red-100 text-red-500 rounded-xl transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg text-slate-800">{editId ? "Edit Notice" : "Create Notice"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300">
                <option>General</option><option>Urgent</option><option>Holiday</option><option>Event</option>
              </select>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Notice description..." rows={3} required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300 resize-none" />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300" />
              <input value={form.by} onChange={e => setForm({...form, by: e.target.value})} placeholder="Posted by (e.g. HR, IT Dept)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300" />
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#0a4d44] text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition">
                  {editId ? "Update" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;
