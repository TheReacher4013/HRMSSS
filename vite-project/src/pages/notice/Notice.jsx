import React, { useState, useEffect } from "react";
import { Megaphone, Pencil, Trash2, Plus, Search, Calendar, User, X, AlertTriangle, Info } from "lucide-react";
import { noticeAPI } from "../../utils/api";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const emptyForm = { type: "General", description: "", date: "", by: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchNotices = async () => {
    setLoading(true);
    try { const res = await noticeAPI.getAll(); setNotices(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const filtered = notices.filter(n => n.type.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase()));

  const typeStyle = (type) => ({ urgent: "border-l-red-500 text-red-700", holiday: "border-l-emerald-500 text-emerald-700" })[type.toLowerCase()] || "border-l-blue-500 text-blue-700";

  const handleSave = async () => {
    try {
      if (editId) { await noticeAPI.update(editId, form); }
      else { await noticeAPI.create(form); }
      setForm(emptyForm); setShowForm(false); setEditId(null); fetchNotices();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try { await noticeAPI.remove(id); fetchNotices(); }
    catch (err) { alert(err.message); }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2"><Megaphone className="text-[#0a4d44]" /> Announcement Hub</h1>
            <p className="text-slate-500 text-sm font-medium">Keep everyone updated with the latest news</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md">
            <Plus size={18} /> Create New Notice
          </button>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center">
          <div className="pl-4 pr-2 text-slate-400"><Search size={20} /></div>
          <input type="text" placeholder="Search notices..." className="w-full py-3 outline-none text-slate-600 bg-transparent" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? <div className="bg-white rounded-2xl p-20 text-center text-slate-400">Loading...</div> : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center text-slate-400">No notices found</div>
            ) : filtered.map((n) => (
              <div key={n._id} className={`bg-white rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all overflow-hidden ${typeStyle(n.type)}`}>
                <div className="p-5 md:p-6 bg-white flex flex-col md:flex-row gap-4 items-start">
                  <div className="p-3 rounded-xl hidden md:block bg-slate-50">
                    {n.type === "Urgent" ? <AlertTriangle size={24} /> : <Info size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{n.type}</span>
                      <div className="flex items-center gap-3 text-slate-400">
                        <button onClick={() => { setForm(n); setEditId(n._id); setShowForm(true); }} className="hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(n._id)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-slate-800 font-bold text-lg mb-2">{n.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 border-t border-slate-50 pt-3">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Calendar size={14} />{n.date?.slice(0,10)}</span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><User size={14} />By {n.by}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b flex justify-between items-center"><h2 className="font-black text-slate-800">{editId ? "Edit Notice" : "New Notice"}</h2><button onClick={() => setShowForm(false)}><X size={24} className="text-slate-400" /></button></div>
              <div className="p-8 space-y-4">
                <div><label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none">
                    <option>General</option><option>Urgent</option><option>Holiday</option>
                  </select></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none resize-none" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400">Posted By</label>
                  <input value={form.by} onChange={(e) => setForm({ ...form, by: e.target.value })} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none" /></div>
              </div>
              <div className="p-8 border-t flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button><button onClick={handleSave} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold">Save Notice</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Notice;
