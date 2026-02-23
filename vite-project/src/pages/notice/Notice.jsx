// import React, { useState } from "react";
// import { Megaphone, Pencil, Trash2, Plus, Search, Calendar, User, X, Bell, Info, AlertTriangle } from "lucide-react";

// const Notice = () => {
//   const [notices, setNotices] = useState([
//     { id: 1, type: "Urgent", description: "System maintenance scheduled for tonight at 10 PM. Please save all your work.", date: "2026-02-20", by: "IT Dept" },
//     { id: 2, type: "Holiday", description: "Office will remain closed on Monday for the upcoming public holiday.", date: "2026-02-18", by: "HR" },
//     { id: 3, type: "General", description: "New coffee machine has been installed in the cafeteria. Enjoy!", date: "2026-02-15", by: "Admin" },
//   ]);

//   const [search, setSearch] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);

//   const emptyForm = { type: "General", description: "", date: "", by: "" };
//   const [form, setForm] = useState(emptyForm);

//   const filteredNotices = notices.filter(n =>
//     n.type.toLowerCase().includes(search.toLowerCase()) ||
//     n.description.toLowerCase().includes(search.toLowerCase())
//   );

//   const getTypeStyle = (type) => {
//     switch (type.toLowerCase()) {
//       case 'urgent': return 'border-l-red-500 bg-red-50 text-red-700';
//       case 'holiday': return 'border-l-emerald-500 bg-emerald-50 text-emerald-700';
//       default: return 'border-l-blue-500 bg-blue-50 text-blue-700';
//     }
//   };

//   const handleSave = () => {
//     if (editId) {
//       setNotices(notices.map(n => n.id === editId ? { ...n, ...form } : n));
//     } else {
//       setNotices([{ ...form, id: Date.now() }, ...notices]);
//     }
//     setForm(emptyForm); setShowForm(false); setEditId(null);
//   };

//   return (
//     <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-10 font-sans">
//       <div className="max-w-4xl mx-auto">

//         {/* TOP BAR */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
//               <Megaphone className="text-[#0a4d44]" /> Announcement Hub
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">Keep everyone updated with the latest news</p>
//           </div>
//           <button
//             onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
//             className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md font-bold text-sm"
//           >
//             <Plus size={18} /> Create New Notice
//           </button>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center">
//           <div className="pl-4 pr-2 text-slate-400"><Search size={20} /></div>
//           <input
//             type="text"
//             placeholder="Search notices by keyword or type..."
//             className="w-full py-3 outline-none text-slate-600 bg-transparent"
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* NOTICES LIST */}
//         <div className="space-y-4">
//           {filteredNotices.length > 0 ? filteredNotices.map((n) => (
//             <div
//               key={n.id}
//               className={`bg-white rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all overflow-hidden ${getTypeStyle(n.type)}`}
//             >
//               <div className="p-5 md:p-6 bg-white flex flex-col md:flex-row gap-4 items-start">
//                 {/* Icon based on type */}
//                 <div className={`p-3 rounded-xl hidden md:block ${getTypeStyle(n.type).replace('border-l-4', '')}`}>
//                   {n.type === 'Urgent' ? <AlertTriangle size={24} /> : <Info size={24} />}
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex justify-between items-start mb-1">
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{n.type}</span>
//                     <div className="flex items-center gap-3 text-slate-400">
//                       <button onClick={() => { setForm(n); setEditId(n.id); setShowForm(true); }} className="hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
//                       <button onClick={() => setDeleteId(n.id)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
//                     </div>
//                   </div>
//                   <h3 className="text-slate-800 font-bold text-lg mb-2 leading-tight">{n.description}</h3>

//                   <div className="flex flex-wrap items-center gap-4 mt-4 border-t border-slate-50 pt-3">
//                     <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
//                       <Calendar size={14} className="text-slate-300" /> {n.date}
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
//                       <User size={14} className="text-slate-300" /> By {n.by}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )) : (
//             <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
//               <p className="text-slate-400 font-medium italic">No notices found matching your search.</p>
//             </div>
//           )}
//         </div>

//         {/* MODAL & DELETE CONFIRMATION (Same as previous high-end style) */}
//         {showForm && (
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
//             <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-black text-slate-800">{editId ? "Update Notice" : "New Notice"}</h2>
//                 <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 ml-1">Notice Type</label>
//                   <select
//                     name="type"
//                     value={form.type}
//                     onChange={(e) => setForm({ ...form, type: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl mt-1 outline-none focus:ring-2 ring-emerald-100"
//                   >
//                     <option value="General">General</option>
//                     <option value="Urgent">Urgent</option>
//                     <option value="Holiday">Holiday</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 ml-1">Announcement Details</label>
//                   <textarea
//                     value={form.description}
//                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl mt-1 outline-none focus:ring-2 ring-emerald-100 min-h-[100px]"
//                     placeholder="Write your message here..."
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-xs font-bold text-slate-400 ml-1">Date</label>
//                     <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl mt-1 outline-none" />
//                   </div>
//                   <div>
//                     <label className="text-xs font-bold text-slate-400 ml-1">Posted By</label>
//                     <input type="text" value={form.by} onChange={(e) => setForm({ ...form, by: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl mt-1 outline-none" placeholder="Dept/Name" />
//                   </div>
//                 </div>
//               </div>
//               <button onClick={handleSave} className="w-full bg-[#0a4d44] text-white py-4 rounded-xl font-bold shadow-lg mt-8 hover:bg-slate-800 transition-all">
//                 {editId ? "Update Announcement" : "Post to Board"}
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Notice;












import React, { useState, useEffect } from "react";
import { Megaphone, Pencil, Trash2, Plus, Search, Calendar, User, X, Info, AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";

// API Base URL (Aapke backend route ke hisaab se)
const API_BASE = "http://localhost:5000/api/notice";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    type: "General",
    description: "",
    date: new Date().toISOString().split('T')[0],
    by: ""
  };
  const [form, setForm] = useState(emptyForm);

  // --- 1. FETCH NOTICES ---
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/list`);
      setNotices(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  // --- 2. SAVE OR UPDATE ---
  const handleSave = async () => {
    if (!form.description || !form.by) return alert("Please fill all fields");

    try {
      if (editId) {
        // Update existing notice
        await axios.put(`${API_BASE}/update/${editId}`, form);
      } else {
        // Create new notice
        await axios.post(`${API_BASE}/create`, form);
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
      fetchNotices(); // Refresh list
    } catch (err) {
      alert("Error saving notice: " + err.message);
    }
  };

  // --- 3. DELETE NOTICE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchNotices();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- Helpers ---
  const getTypeStyle = (type) => {
    switch (type) {
      case 'Urgent': return 'border-l-red-500 bg-red-50 text-red-700';
      case 'Holiday': return 'border-l-emerald-500 bg-emerald-50 text-emerald-700';
      default: return 'border-l-blue-500 bg-blue-50 text-blue-700';
    }
  };

  const filteredNotices = notices.filter(n =>
    n.description.toLowerCase().includes(search.toLowerCase()) ||
    n.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Megaphone className="text-[#0a4d44]" /> Notice Board
            </h1>
            <p className="text-slate-500 text-sm font-medium">Official announcements and updates</p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md font-bold text-sm"
          >
            <Plus size={18} /> New Notice
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center">
          <div className="pl-4 pr-2 text-slate-400"><Search size={20} /></div>
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full py-3 outline-none text-slate-600 bg-transparent font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((n) => (
              <div key={n._id} className={`bg-white rounded-2xl border-l-4 shadow-sm group transition-all overflow-hidden ${getTypeStyle(n.type)}`}>
                <div className="p-6 flex flex-col md:flex-row gap-4">
                  <div className={`p-3 rounded-xl hidden md:block h-fit ${getTypeStyle(n.type).replace('border-l-4', '')}`}>
                    {n.type === 'Urgent' ? <AlertTriangle size={24} /> : <Info size={24} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{n.type}</span>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setForm(n); setEditId(n._id); setShowForm(true); }} className="text-slate-400 hover:text-blue-600"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(n._id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg mb-3 leading-snug">{n.description}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5"><Calendar size={14} /> {n.date}</div>
                      <div className="flex items-center gap-1.5"><User size={14} /> By {n.by}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredNotices.length === 0 && <p className="text-center text-slate-400 py-10">No notices found.</p>}
          </div>
        )}

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  {editId ? "Edit Notice" : "Create Notice"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
              </div>
              <div className="space-y-4 font-bold">
                <div>
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-xl mt-1 outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Message</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-xl mt-1 outline-none min-h-[100px]"
                    placeholder="Enter notice details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 ml-1">Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-xl mt-1 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 ml-1">Posted By</label>
                    <input type="text" value={form.by} onChange={(e) => setForm({ ...form, by: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-xl mt-1 outline-none" placeholder="HR / Admin" />
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="w-full bg-[#0a4d44] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl mt-8 active:scale-95 transition-all">
                {editId ? "Update Notice" : "Post Notice"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;