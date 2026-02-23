// import { Pencil, Trash2, Plus, X, Search, Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from "lucide-react";
// import { useState } from "react";

// const HolidayList = () => {
//   const [search, setSearch] = useState("");
//   const [list, setList] = useState([
//     { id: 1, name: "Eid Vacation", from: "2025-09-22", to: "2025-09-23", days: 2 },
//     { id: 2, name: "GOOD FRIDAY", from: "2025-04-18", to: "2025-04-18", days: 1 },
//     { id: 3, name: "Vacation", from: "2025-04-19", to: "2025-04-20", days: 2 },
//   ]);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [current, setCurrent] = useState(null);

//   const [name, setName] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   /* ================= PAGINATION ================= */
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const totalDays = from && to
//     ? Math.floor((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1
//     : "";

//   const onAdd = () => {
//     setCurrent(null); setName(""); setFrom(""); setTo("");
//     setModalOpen(true);
//   };

//   const onEdit = (item) => {
//     setCurrent(item); setName(item.name); setFrom(item.from); setTo(item.to);
//     setModalOpen(true);
//   };

//   const onSave = () => {
//     if (!name || !from || !to) return;
//     if (current) {
//       setList((prev) => prev.map((h) => h.id === current.id ? { ...h, name, from, to, days: totalDays } : h));
//     } else {
//       setList((prev) => [{ id: Date.now(), name, from, to, days: totalDays }, ...prev]);
//     }
//     setModalOpen(false);
//   };

//   const onDelete = (item) => {
//     setCurrent(item);
//     setDeleteOpen(true);
//   };

//   const confirmDelete = () => {
//     setList((prev) => prev.filter((h) => h.id !== current.id));
//     setDeleteOpen(false);
//   };

//   const filtered = list.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
//       <div className="max-w-5xl mx-auto">

//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <div className="p-2 bg-sky-100 rounded-xl">
//                 <CalendarIcon className="text-sky-600" size={24} />
//               </div>
//               Public Holidays
//             </h1>
//             <p className="text-slate-500 text-sm font-medium mt-1">Calendar of non-working days for 2025</p>
//           </div>
//           <button
//             onClick={onAdd}
//             className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
//           >
//             <Plus size={18} /> Add Holiday
//           </button>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="relative w-full max-w-sm ml-auto mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//           <input
//             placeholder="Find holiday..."
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//             className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-4 ring-sky-50 transition-all"
//           />
//         </div>

//         {/* DESKTOP TABLE */}
//         <div className="hidden sm:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100">
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Sl No.</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Holiday Name</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Duration (From - To)</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-center">Total Days</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginatedData.map((item, i) => (
//                 <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
//                   <td className="px-8 py-5 text-sm font-bold text-slate-300">
//                     {String(startIndex + i + 1).padStart(2, '0')}
//                   </td>
//                   <td className="px-8 py-5">
//                     <span className="text-sm font-bold text-slate-700">{item.name}</span>
//                   </td>
//                   <td className="px-8 py-5">
//                     <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tight">
//                       <span className="text-slate-600">{item.from}</span>
//                       <span className="text-slate-300">→</span>
//                       <span className="text-slate-600">{item.to}</span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-5 text-center">
//                     <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg text-xs font-black">
//                       {item.days} {item.days > 1 ? 'Days' : 'Day'}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => onEdit(item)} className="p-2.5 bg-white border border-slate-100 text-emerald-600 rounded-xl hover:border-emerald-200 transition-all shadow-sm">
//                         <Pencil size={16} />
//                       </button>
//                       <button onClick={() => onDelete(item)} className="p-2.5 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 transition-all shadow-sm">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE VIEW */}
//         <div className="sm:hidden space-y-4">
//           {paginatedData.map((item, i) => (
//             <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-4">
//                 <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
//                   {item.days}D
//                 </span>
//               </div>
//               <p className="text-xs font-black text-slate-300 mb-1">#{startIndex + i + 1}</p>
//               <h3 className="font-bold text-slate-800 text-lg mb-4">{item.name}</h3>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="text-center bg-slate-50 px-3 py-2 rounded-xl flex-1">
//                   <p className="text-[9px] font-black text-slate-400 uppercase">From</p>
//                   <p className="text-xs font-bold text-slate-700">{item.from}</p>
//                 </div>
//                 <div className="text-center bg-slate-50 px-3 py-2 rounded-xl flex-1">
//                   <p className="text-[9px] font-black text-slate-400 uppercase">To</p>
//                   <p className="text-xs font-bold text-slate-700">{item.to}</p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => onEdit(item)} className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Pencil size={14} /> Edit</button>
//                 <button onClick={() => onDelete(item)} className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Trash2 size={14} /> Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex justify-between items-center mt-8 px-2">
//             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Holiday Calendar</p>
//             <div className="flex gap-2">
//               <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all shadow-sm">
//                 <ChevronLeft size={20} />
//               </button>
//               <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all shadow-sm">
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* MODAL: ADD / EDIT */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 animate-in fade-in duration-200">
//             <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//               <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
//                 <h2 className="font-black text-slate-800 tracking-tight">{current ? "Edit Holiday Info" : "New Holiday Entry"}</h2>
//                 <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={20} /></button>
//               </div>
//               <div className="p-8 space-y-6">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Event / Holiday Name</label>
//                   <input className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-sky-50 transition-all" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Annual Winter Break" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">From Date</label>
//                     <input type="date" className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-sky-50 transition-all" value={from} onChange={(e) => setFrom(e.target.value)} />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">To Date</label>
//                     <input type="date" className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-sky-50 transition-all" value={to} onChange={(e) => setTo(e.target.value)} />
//                   </div>
//                 </div>
//                 {totalDays > 0 && (
//                   <div className="bg-sky-50 p-4 rounded-2xl flex items-center gap-3">
//                     <Info size={18} className="text-sky-600" />
//                     <p className="text-xs font-bold text-sky-800 tracking-tight italic">This duration will count as <span className="underline">{totalDays}</span> full business days.</p>
//                   </div>
//                 )}
//               </div>
//               <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-3">
//                 <button onClick={() => setModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-white transition-all">Discard</button>
//                 <button onClick={onSave} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
//                   {current ? "Confirm Update" : "Save Holiday"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MODAL: DELETE */}
//         {deleteOpen && (
//           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
//             <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
//               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Trash2 size={40} className="text-red-500" />
//               </div>
//               <h2 className="text-xl font-black text-slate-800 mb-2">Delete Holiday?</h2>
//               <p className="text-slate-500 text-sm font-medium mb-8">This will remove <span className="text-slate-800 font-bold">"{current?.name}"</span> from the global calendar list.</p>
//               <div className="flex flex-col gap-2">
//                 <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 active:scale-95 transition-all">Yes, Remove it</button>
//                 <button onClick={() => setDeleteOpen(false)} className="w-full py-4 rounded-2xl font-bold text-sm text-slate-400 hover:text-slate-600 transition-all">Keep Holiday</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HolidayList;
import { Pencil, Trash2, Plus, X, Search, Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
// Humne apni service import kar li
import { getHolidays, updateHolidays } from "../../../src/api/leaveService"
import axios from "axios";

// Agar aap service file use kar rahe hain toh API_URL ki zarurat nahi, 
// lekin fallback ke liye main yahan ek temporary base rakhta hoon
const API_BASE = "http://localhost:5000/api/holidays";

const HolidayList = () => {
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- 1. Fetch Data ---
  const fetchHolidays = async () => {
    setLoading(true);
    try {
      // Humein database se array mil raha hai
      const res = await axios.get(API_BASE);
      setList(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // --- 2. Calculate Days ---
  const totalDays = from && to
    ? Math.floor((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // --- 3. Save / Update ---
  const onSave = async () => {
    if (!name || !from || !to) return;
    const holidayData = { name, from, to, days: totalDays };

    try {
      if (current) {
        // Edit Mode
        await axios.put(`${API_BASE}/${current._id}`, holidayData);
      } else {
        // Add Mode
        await axios.post(API_BASE, holidayData);
      }
      fetchHolidays();
      setModalOpen(false);
    } catch (err) {
      alert("Error saving holiday. Make sure backend is running.");
    }
  };

  // --- 4. Delete ---
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${current._id}`);
      fetchHolidays();
      setDeleteOpen(false);
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const onAdd = () => {
    setCurrent(null); setName(""); setFrom(""); setTo("");
    setModalOpen(true);
  };

  const onEdit = (item) => {
    setCurrent(item);
    setName(item.name);
    setFrom(item.from);
    setTo(item.to);
    setModalOpen(true);
  };

  // --- Pagination Logic ---
  const filtered = list.filter((h) => h.name?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <CalendarIcon className="text-indigo-600" size={24} />
              </div>
              Public Holidays
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-tighter">Official Calendar Management</p>
          </div>
          <button onClick={onAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-xl font-black text-xs uppercase tracking-widest active:scale-95">
            <Plus size={18} /> Add Holiday
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full max-w-sm ml-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search holiday name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 ring-indigo-50 transition-all"
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Syncing Calendar...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">ID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Holiday Name</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date Range</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Days</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((item, i) => (
                  <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-8 py-6 text-xs font-black text-slate-300">{(startIndex + i + 1).toString().padStart(2, '0')}</td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-slate-700">{item.name}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-white border border-slate-100 w-fit px-3 py-1 rounded-lg">
                        {item.from} <ChevronRight size={12} className="text-slate-300" /> {item.to}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black">
                        {item.days} {item.days > 1 ? 'DAYS' : 'DAY'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => onEdit(item)} className="p-2 text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => { setCurrent(item); setDeleteOpen(true); }} className="p-2 text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white border border-slate-100 rounded-2xl disabled:opacity-30 hover:shadow-lg transition-all">
                <ChevronLeft size={20} />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white border border-slate-100 rounded-2xl disabled:opacity-30 hover:shadow-lg transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* MODAL: FORM */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-800">{current ? "Update Record" : "Add Holiday"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Event Name</label>
                  <input className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-indigo-50" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Winter Break" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Starts From</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold" value={from} onChange={(e) => setFrom(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Ends At</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold" value={to} onChange={(e) => setTo(e.target.value)} />
                  </div>
                </div>
                {totalDays > 0 && (
                  <div className="bg-indigo-50 p-5 rounded-[2rem] flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Info size={20} className="text-indigo-600" /></div>
                    <p className="text-xs font-black text-indigo-900 uppercase tracking-tight">Calculating: <span className="text-lg ml-1">{totalDays}</span> Days Total</p>
                  </div>
                )}
                <button onClick={onSave} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-slate-800 transition-all mt-4">
                  {current ? "Update Calendar" : "Add to Database"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE */}
        {deleteOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><Trash2 size={40} /></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete This?</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 italic">"{current?.name}"</p>
              <div className="flex flex-col gap-2">
                <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-red-600 transition-all">Confirm Erase</button>
                <button onClick={() => setDeleteOpen(false)} className="w-full py-4 text-slate-400 font-black text-xs uppercase">Keep Record</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HolidayList;