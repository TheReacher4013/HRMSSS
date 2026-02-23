// import { useState } from "react";
// import { Plus, Pencil, Trash2, Trophy, Calendar, User, Gift, X } from "lucide-react";

// const ITEMS_PER_PAGE = 5;

// const AwardList = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [page, setPage] = useState(1);

//   const [form, setForm] = useState({
//     awardName: "",
//     description: "",
//     gift: "",
//     date: "",
//     employee: "",
//     awardBy: "",
//   });

//   const [data, setData] = useState([
//     {
//       id: 1,
//       awardName: "Employee of the month",
//       description: "Excellence in performance",
//       gift: "Smart Watch",
//       date: "2025-09-18",
//       employee: "Honorato Terry",
//       awardBy: "usamaDev",
//     },
//   ]);

//   /* ---------- logic ---------- */
//   const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
//   const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//   const openAdd = () => {
//     setEditId(null);
//     setForm({ awardName: "", description: "", gift: "", date: "", employee: "", awardBy: "" });
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(item.id);
//     setForm(item);
//     setShowForm(true);
//   };

//   const handleSave = () => {
//     if (!form.awardName || !form.employee) return alert("Please fill required fields");
//     if (editId) {
//       setData(data.map((d) => (d.id === editId ? form : d)));
//     } else {
//       setData([{ ...form, id: Date.now() }, ...data]);
//     }
//     setShowForm(false);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Delete this award?")) {
//       setData(data.filter((d) => d.id !== id));
//       if (paginatedData.length === 1 && page > 1) setPage(page - 1);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 pt-24">
//       <div className="max-w-7xl mx-auto">

//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <Trophy className="text-emerald-600" /> Award Recognition
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">Celebrate and manage employee achievements</p>
//           </div>
//           <button
//             onClick={openAdd}
//             className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
//           >
//             <Plus size={20} /> Add New Award
//           </button>
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100">
//                 {["Award Details", "Gift & Date", "Recipients", "Actions"].map((h) => (
//                   <th key={h} className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginatedData.map((item) => (
//                 <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
//                   <td className="px-6 py-5">
//                     <p className="font-bold text-slate-800">{item.awardName}</p>
//                     <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
//                       <Gift size={14} className="text-emerald-500" /> {item.gift}
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
//                       <Calendar size={12} /> {item.date}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
//                         {item.employee.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-700">{item.employee}</p>
//                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">By {item.awardBy}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => openEdit(item)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"><Pencil size={18} /></button>
//                       <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors"><Trash2 size={18} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Card View */}
//         <div className="md:hidden space-y-4">
//           {paginatedData.map((item) => (
//             <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-3 flex gap-1">
//                 <button onClick={() => openEdit(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Pencil size={14} /></button>
//                 <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={14} /></button>
//               </div>
//               <div className="mb-4">
//                 <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Award</span>
//                 <h3 className="text-lg font-bold text-slate-800 mt-2">{item.awardName}</h3>
//                 <p className="text-sm text-slate-500">{item.description}</p>
//               </div>
//               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Employee</p>
//                   <p className="text-sm font-bold text-slate-700">{item.employee}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Gift</p>
//                   <p className="text-sm font-bold text-slate-700">{item.gift}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-8">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-[#0a4d44] disabled:opacity-30 transition-colors"
//             >
//               Prev
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? "bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/20" : "bg-white text-slate-400 border border-slate-100"
//                   }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-[#0a4d44] disabled:opacity-30 transition-colors"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modern Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
//           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="bg-[#0a4d44] p-6 text-white flex justify-between items-center">
//               <div>
//                 <h3 className="text-xl font-bold">{editId ? "Edit Award" : "Grant New Award"}</h3>
//                 <p className="text-emerald-200 text-xs">Fill in the details for the recognition</p>
//               </div>
//               <button onClick={() => setShowForm(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
//             </div>

//             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
//               <Input label="Award Name" value={form.awardName} onChange={(v) => setForm({ ...form, awardName: v })} placeholder="e.g. Star Performer" />
//               <Input label="Gift Item" value={form.gift} onChange={(v) => setForm({ ...form, gift: v })} placeholder="e.g. Cash Prize" />
//               <Input label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
//               <Input label="Employee Name" value={form.employee} onChange={(v) => setForm({ ...form, employee: v })} placeholder="Full Name" />
//               <div className="md:col-span-2">
//                 <Input label="Awarded By" value={form.awardBy} onChange={(v) => setForm({ ...form, awardBy: v })} placeholder="Manager Name" />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Award Description</label>
//                 <textarea
//                   className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 ring-emerald-50 outline-none min-h-[100px]"
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   placeholder="Tell us more about this achievement..."
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-slate-50 flex gap-3">
//               <button onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Cancel</button>
//               <button onClick={handleSave} className="flex-1 py-4 rounded-2xl font-bold bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/10 hover:bg-slate-800 transition-all">Save Recognition</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ---------- Reusable Input ---------- */
// const Input = ({ label, value, onChange, type = "text", placeholder }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label} *</label>
//     <input
//       type={type}
//       value={value}
//       placeholder={placeholder}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
//     />
//   </div>
// );

// export default AwardList;





import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Trophy, Calendar, Gift, X, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 5;

const AwardList = () => {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    awardName: "",
    description: "",
    gift: "",
    date: "",
    employee: "",
    awardBy: "",
  });

  const [data, setData] = useState([]);

  // --- 1. Fetch Awards from DB ---
  useEffect(() => {
    const fetchAwards = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/awards", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching awards", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAwards();
  }, [token]);

  /* ---------- Pagination Logic ---------- */
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openAdd = () => {
    setEditId(null);
    setForm({ awardName: "", description: "", gift: "", date: "", employee: "", awardBy: "" });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item._id); // MongoDB uses _id
    setForm(item);
    setShowForm(true);
  };

  // --- 2. Save (Create or Update) ---
  const handleSave = async () => {
    if (!form.awardName || !form.employee) return alert("Please fill required fields");

    setLoading(true);
    try {
      if (editId) {
        // Update
        const res = await axios.put(`http://localhost:5000/api/awards/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(data.map((d) => (d._id === editId ? res.data : d)));
      } else {
        // Create
        const res = await axios.post("http://localhost:5000/api/awards", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData([res.data, ...data]);
      }
      setShowForm(false);
    } catch (err) {
      alert("Failed to save award");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this award?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/awards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(data.filter((d) => d._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Trophy className="text-emerald-600" /> Award Recognition
            </h1>
            <p className="text-slate-500 text-sm font-medium">Celebrate employee achievements</p>
          </div>
          <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg font-bold active:scale-95 transition-all">
            <Plus size={20} /> Add New Award
          </button>
        </div>

        {loading && data.length === 0 ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    {["Award Details", "Gift & Date", "Recipients", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-800">{item.awardName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="flex items-center gap-2 font-medium"><Gift size={14} className="text-emerald-500" /> {item.gift}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><Calendar size={12} /> {item.date}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">{item.employee.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{item.employee}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">By {item.awardBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"><Pencil size={18} /></button>
                          <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View logic remains same as yours */}
            {/* ... (Your mobile card code) */}

            {/* Pagination logic remains same */}
            {/* ... (Your pagination code) */}
          </>
        )}
      </div>

      {/* Modern Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
            <div className="bg-[#0a4d44] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editId ? "Edit Award" : "Grant New Award"}</h3>
                <p className="text-emerald-200 text-xs">Fill in achievement details</p>
              </div>
              <button onClick={() => setShowForm(false)} className="bg-white/10 p-2 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Award Name" value={form.awardName} onChange={(v) => setForm({ ...form, awardName: v })} />
              <Input label="Gift Item" value={form.gift} onChange={(v) => setForm({ ...form, gift: v })} />
              <Input label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              <Input label="Employee Name" value={form.employee} onChange={(v) => setForm({ ...form, employee: v })} />
              <div className="md:col-span-2">
                <Input label="Awarded By" value={form.awardBy} onChange={(v) => setForm({ ...form, awardBy: v })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                <textarea className="w-full mt-1 bg-slate-50 border rounded-2xl p-3 text-sm outline-none focus:ring-4 ring-emerald-50 min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 py-4 font-bold bg-[#0a4d44] text-white rounded-2xl flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Recognition"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input Component (as defined in your code)
const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label} *</label>
    <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 ring-emerald-50 outline-none transition-all" />
  </div>
);

export default AwardList;