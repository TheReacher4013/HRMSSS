// import { Pencil, Trash2, Plus, Search, Calendar, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
// import { useState } from "react";

// const LeaveApplication = () => {
//   const [data, setData] = useState([
//     { id: 1, employee: "Amy Peck", type: "Annual Leave", applyDate: "2026-02-15", startDate: "2026-02-16", endDate: "2026-02-18", days: 3, reason: "Personal", status: "Approved" },
//     { id: 2, employee: "Maisha Gonzales", type: "Medical Leave", applyDate: "2026-02-14", startDate: "2026-02-14", endDate: "2026-02-14", days: 1, reason: "Sick", status: "Pending" },
//   ]);

//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const emptyForm = { employee: "", type: "", applyDate: "", startDate: "", endDate: "", days: "", reason: "", status: "Pending" };
//   const [form, setForm] = useState(emptyForm);

//   const filtered = data.filter((item) => item.employee.toLowerCase().includes(search.toLowerCase()));
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

//   const handleSubmit = () => {
//     if (editId) {
//       setData(data.map((item) => item.id === editId ? { ...form, id: editId } : item));
//     } else {
//       setData([{ ...form, id: Date.now() }, ...data]);
//     }
//     setForm(emptyForm); setEditId(null); setShowForm(false);
//   };

//   const handleEdit = (item) => {
//     setForm(item); setEditId(item.id); setShowForm(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Delete this leave application?")) {
//       setData(data.filter((item) => item.id !== id));
//     }
//   };

//   return (
//     <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans">
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Clock size={24} /></div>
//               Leave Requests
//             </h1>
//             <p className="text-slate-500 text-sm font-medium mt-1">Manage and track employee absences</p>
//           </div>
//           <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg font-bold">
//             <Plus size={18} /> Apply Leave
//           </button>
//         </div>

//         {/* SEARCH */}
//         <div className="relative w-full max-w-sm ml-auto mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//           <input placeholder="Search employee..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-indigo-50 transition-all" />
//         </div>

//         {/* TABLE */}
//         <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
//                 <th className="px-6 py-5">Employee</th>
//                 <th className="px-6 py-5">Leave Type</th>
//                 <th className="px-6 py-5">Duration</th>
//                 <th className="px-6 py-5 text-center">Days</th>
//                 <th className="px-6 py-5">Status</th>
//                 <th className="px-6 py-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginatedData.map((item) => (
//                 <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
//                   <td className="px-6 py-5 font-bold text-slate-700">{item.employee}</td>
//                   <td className="px-6 py-5 text-sm text-slate-500">{item.type}</td>
//                   <td className="px-6 py-5">
//                     <div className="text-[11px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-tight">
//                       {item.startDate} <span className="text-slate-300">→</span> {item.endDate}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 text-center">
//                     <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">{item.days}</span>
//                   </td>
//                   <td className="px-6 py-5">
//                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === "Approved" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
//                       }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-100 text-indigo-600 rounded-xl hover:border-indigo-200 shadow-sm"><Pencil size={16} /></button>
//                       <button onClick={() => handleDelete(item.id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 shadow-sm"><Trash2 size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE */}
//         <div className="md:hidden space-y-4">
//           {paginatedData.map((item) => (
//             <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
//               <div className="flex justify-between items-start mb-4">
//                 <h3 className="font-bold text-slate-800">{item.employee}</h3>
//                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === "Approved" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
//                   }`}>{item.status}</span>
//               </div>
//               <div className="text-xs font-medium text-slate-500 mb-4 space-y-1">
//                 <p>Type: <span className="text-slate-800">{item.type}</span></p>
//                 <p>Dates: <span className="text-slate-800">{item.startDate} to {item.endDate}</span></p>
//                 <p>Reason: <span className="text-slate-800 italic">"{item.reason}"</span></p>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => handleEdit(item)} className="flex-1 bg-slate-50 text-indigo-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2">Edit</button>
//                 <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2">Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-center gap-2 mt-8">
//           <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl disabled:opacity-30"><ChevronLeft size={20} /></button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-400 hover:text-indigo-600"}`}>{i + 1}</button>
//           ))}
//           <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl disabled:opacity-30"><ChevronRight size={20} /></button>
//         </div>

//         {/* MODAL */}
//         {showForm && (
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
//             <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//               <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
//                 <h2 className="font-black text-slate-800 tracking-tight">{editId ? "Edit Application" : "New Leave Application"}</h2>
//                 <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
//               </div>
//               <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
//                 {Object.keys(emptyForm).map((key) => (
//                   <div key={key} className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{key}</label>
//                     <input placeholder={`Enter ${key}...`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none focus:ring-4 ring-indigo-50 transition-all" />
//                   </div>
//                 ))}
//               </div>
//               <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-3">
//                 <button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
//                 <button onClick={handleSubmit} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10">Submit Application</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeaveApplication;





import { Pencil, Trash2, Plus, Search, Calendar, ChevronLeft, ChevronRight, X, Clock, Loader2, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/leaves";

const LeaveApplication = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showForm, setShowForm] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Match with your Backend Schema: employeeid, fromDate, toDate, leaveReason
  const emptyForm = {
    employeeid: "",
    type: "Casual Leave",
    fromDate: "",
    toDate: "",
    leaveReason: "",
    status: "pending"
  };
  const [form, setForm] = useState(emptyForm);

  // --- API: FETCH ---
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  // --- Auto-calculate Days ---
  const calculateDays = () => {
    if (form.fromDate && form.toDate) {
      const start = new Date(form.fromDate);
      const end = new Date(form.toDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  // --- API: SUBMIT ---
  const handleSubmit = async () => {
    if (!form.employeeid || !form.fromDate || !form.toDate) {
      alert("Please fill required fields");
      return;
    }
    try {
      if (currentId) {
        await axios.put(`${API_URL}/${currentId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchLeaves();
      setShowForm(false);
      setForm(emptyForm);
      setCurrentId(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // --- API: DELETE ---
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${currentId}`);
      fetchLeaves();
      setDeleteOpen(false);
      setCurrentId(null);
    } catch (err) { alert("Delete failed."); }
  };

  const handleEdit = (item) => {
    setForm(item);
    setCurrentId(item._id);
    setShowForm(true);
  };

  const filtered = data.filter((item) => item.employeeid?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Clock size={24} /></div>
              Leave Management
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-tight">Backend Integrated Portal</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setCurrentId(null); setShowForm(true); }} className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl font-black text-xs uppercase active:scale-95">
            <Plus size={18} /> Apply New Leave
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full max-w-sm ml-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input placeholder="Search Employee ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-indigo-50 transition-all font-bold" />
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex flex-col items-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Fetching from MongoDB...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-6">Employee ID</th>
                  <th className="px-8 py-6">Type</th>
                  <th className="px-8 py-6">Timeline</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/30 transition-all">
                    <td className="px-8 py-6 font-black text-slate-700">{item.employeeid}</td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{item.type}</td>
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                        {new Date(item.fromDate).toLocaleDateString()} <span className="text-slate-200">→</span> {new Date(item.toDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "Approved" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEdit(item)} className="p-2 text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all"><Pencil size={16} /></button>
                        <button onClick={() => { setCurrentId(item._id); setDeleteOpen(true); }} className="p-2 text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL: FORM */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-black text-slate-800 tracking-tight uppercase text-xs">{currentId ? "Update Record" : "New Application"}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
              </div>
              <div className="p-10 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Employee ID</label>
                  <input className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none" value={form.employeeid} onChange={(e) => setForm({ ...form, employeeid: e.target.value })} placeholder="e.g. EMP101" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">From Date</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">To Date</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Reason for Leave</label>
                  <textarea rows="3" className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none" value={form.leaveReason} onChange={(e) => setForm({ ...form, leaveReason: e.target.value })} placeholder="Explain briefly..." />
                </div>
                {calculateDays() > 0 && (
                  <div className="col-span-2 bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
                    <Info size={18} className="text-indigo-600" />
                    <span className="text-xs font-black text-indigo-900 uppercase">Calculating Duration: {calculateDays()} Days</span>
                  </div>
                )}
              </div>
              <div className="px-10 pb-10 flex gap-4">
                <button onClick={handleSubmit} className="flex-1 bg-[#0a4d44] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Submit to Database</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE */}
        {deleteOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} className="text-red-500" /></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Erase Record?</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium italic underline decoration-red-200">Record will be permanently removed.</p>
              <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase mb-2 active:scale-95 transition-all shadow-lg">Yes, Delete</button>
              <button onClick={() => setDeleteOpen(false)} className="w-full py-4 text-slate-400 font-black text-xs uppercase">Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeaveApplication;