// import { useState } from "react";
// import { Pencil, Trash2, Plus, Briefcase, X, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

// const initialData = [
//   { id: 1, name: "Sales Team", status: "Active" },
//   { id: 2, name: "Legal Team", status: "Active" },
//   { id: 3, name: "HR Team", status: "Active" },
//   { id: 4, name: "Marketing Team", status: "Active" },
//   { id: 5, name: "Finance Team", status: "Active" },
//   { id: 6, name: "IT Team", status: "Active" },
// ];

// const ITEMS_PER_PAGE = 5;

// export default function Department() {
//   const [list, setList] = useState(initialData);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [current, setCurrent] = useState(null);
//   const [deptName, setDeptName] = useState("");
//   const [status, setStatus] = useState("Active");
//   const [page, setPage] = useState(1);

//   const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
//   const paginatedData = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//   const onAdd = () => {
//     setCurrent(null);
//     setDeptName("");
//     setStatus("Active");
//     setModalOpen(true);
//   };

//   const onEdit = (item) => {
//     setCurrent(item);
//     setDeptName(item.name);
//     setStatus(item.status);
//     setModalOpen(true);
//   };

//   const saveDepartment = () => {
//     if (!deptName.trim()) return;
//     if (current) {
//       setList((prev) => prev.map((d) => (d.id === current.id ? { ...d, name: deptName, status } : d)));
//     } else {
//       setList((prev) => [...prev, { id: Date.now(), name: deptName, status }]);
//     }
//     setModalOpen(false);
//   };

//   const onDelete = (item) => {
//     setCurrent(item);
//     setDeleteOpen(true);
//   };

//   const confirmDelete = () => {
//     setList((prev) => prev.filter((d) => d.id !== current.id));
//     setDeleteOpen(false);
//     setPage((p) => (p > Math.ceil((list.length - 1) / ITEMS_PER_PAGE) ? Math.max(1, p - 1) : p));
//   };

//   return (
//     <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
//       <div className="max-w-5xl mx-auto">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 rounded-xl">
//                 <Briefcase className="text-indigo-600" size={24} />
//               </div>
//               Organization Units
//             </h1>
//             <p className="text-slate-500 text-sm font-medium mt-1">Manage departments and official positions</p>
//           </div>
//           <button
//             onClick={onAdd}
//             className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
//           >
//             <Plus size={18} /> Add Position
//           </button>
//         </div>

//         {/* DESKTOP TABLE */}
//         <div className="hidden sm:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100">
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Index</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Position / Department Name</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-center">Current Status</th>
//                 <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginatedData.map((d, i) => (
//                 <tr key={d.id} className="group hover:bg-slate-50/50 transition-all">
//                   <td className="px-8 py-5 text-sm font-bold text-slate-300">
//                     {String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, '0')}
//                   </td>
//                   <td className="px-8 py-5">
//                     <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{d.name}</span>
//                   </td>
//                   <td className="px-8 py-5 text-center">
//                     <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${d.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
//                       }`}>
//                       <div className={`w-1 h-1 rounded-full ${d.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
//                       {d.status}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => onEdit(d)} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 transition-all shadow-sm">
//                         <Pencil size={16} />
//                       </button>
//                       <button onClick={() => onDelete(d)} className="p-2.5 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 transition-all shadow-sm">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE CARDS */}
//         <div className="sm:hidden space-y-4">
//           {paginatedData.map((d, i) => (
//             <div key={d.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-xs font-black text-slate-300">#{(page - 1) * ITEMS_PER_PAGE + i + 1}</span>
//                 <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${d.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
//                   }`}>
//                   {d.status}
//                 </span>
//               </div>
//               <h3 className="font-bold text-slate-800 text-lg mb-6">{d.name}</h3>
//               <div className="flex gap-2">
//                 <button onClick={() => onEdit(d)} className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Pencil size={14} /> Edit</button>
//                 <button onClick={() => onDelete(d)} className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Trash2 size={14} /> Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex justify-between items-center mt-8 px-2">
//             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Units Management</p>
//             <div className="flex gap-2">
//               <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all">
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex gap-1">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${page === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-400"}`}>
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all">
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
//                 <h2 className="font-black text-slate-800 tracking-tight">{current ? "Update Position" : "Create New Position"}</h2>
//                 <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={20} /></button>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Official Designation Name</label>
//                   <input className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-indigo-50 transition-all" value={deptName} onChange={(e) => setDeptName(e.target.value)} placeholder="e.g. Senior Lead Developer" />
//                 </div>
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Operational Status</label>
//                   <div className="flex gap-3">
//                     {["Active", "Inactive"].map((opt) => (
//                       <button key={opt} onClick={() => setStatus(opt)} className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border ${status === opt ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"}`}>
//                         {opt}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-3">
//                 <button onClick={() => setModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-white transition-all">Discard</button>
//                 <button onClick={saveDepartment} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
//                   {current ? "Confirm Changes" : "Save Position"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MODAL: DELETE CONFIRMATION */}
//         {deleteOpen && (
//           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
//             <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
//               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <AlertCircle size={40} className="text-red-500" />
//               </div>
//               <h2 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h2>
//               <p className="text-slate-500 text-sm font-medium mb-8">This action will permanently remove <span className="text-slate-800 font-bold">"{current?.name}"</span> from the system.</p>
//               <div className="flex flex-col gap-2">
//                 <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 active:scale-95 transition-all">Yes, Delete Record</button>
//                 <button onClick={() => setDeleteOpen(false)} className="w-full py-4 rounded-2xl font-bold text-sm text-slate-400 hover:text-slate-600 transition-all">Wait, Go Back</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pencil, Trash2, Plus, Briefcase, X, AlertCircle,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";

const ITEMS_PER_PAGE = 5;
const API_URL = "http://localhost:5000/api/departments";

export default function Department() {
  // Data States
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form States
  const [current, setCurrent] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [status, setStatus] = useState("Active");
  const [page, setPage] = useState(1);

  // --- API Functions ---
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setList(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const saveDepartment = async () => {
    if (!deptName.trim()) return;
    try {
      if (current) {
        // Update (PUT)
        await axios.put(`${API_URL}/${current._id}`, { name: deptName, status });
      } else {
        // Create (POST)
        await axios.post(API_URL, { name: deptName, status });
      }
      fetchDepartments();
      setModalOpen(false);
    } catch (err) {
      alert("Error saving department. Make sure backend is running.");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${current._id}`);
      fetchDepartments();
      setDeleteOpen(false);
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // Helper Functions
  const onAdd = () => {
    setCurrent(null);
    setDeptName("");
    setStatus("Active");
    setModalOpen(true);
  };

  const onEdit = (item) => {
    setCurrent(item);
    setDeptName(item.name);
    setStatus(item.status);
    setModalOpen(true);
  };

  const onDeleteClick = (item) => {
    setCurrent(item);
    setDeleteOpen(true);
  };

  // Pagination Logic
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedData = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Briefcase className="text-indigo-600" size={24} />
              </div>
              Organization Units
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage official positions & departments</p>
          </div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg font-bold active:scale-95"
          >
            <Plus size={18} /> Add Position
          </button>
        </div>

        {/* --- DATA TABLE / LOADING --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-400 font-bold">Syncing Database...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Position Name</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-center">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((d) => (
                  <tr key={d._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-700">{d.name}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${d.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}>
                        <div className={`w-1 h-1 rounded-full ${d.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(d)} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 shadow-sm transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => onDeleteClick(d)} className="p-2.5 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 shadow-sm transition-all">
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

        {/* --- PAGINATION --- */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 px-2">
            <p className="text-[10px] font-black uppercase text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* --- MODAL: ADD / EDIT --- */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">{current ? "Update Record" : "New Position"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Designation Name</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-indigo-50 transition-all"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
                  <div className="flex gap-3">
                    {["Active", "Inactive"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setStatus(opt)}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase transition-all border ${status === opt ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 pt-0 flex gap-3">
                <button onClick={saveDepartment} className="w-full bg-[#0a4d44] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-slate-800 transition-all">
                  {current ? "Confirm Changes" : "Save Record"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL: DELETE CONFIRMATION --- */}
        {deleteOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete Record?</h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Are you sure you want to remove <br /><span className="text-slate-800 font-bold italic">"{current?.name}"</span>?</p>
              <div className="flex flex-col gap-2">
                <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg active:scale-95 transition-all">Yes, Delete Now</button>
                <button onClick={() => setDeleteOpen(false)} className="w-full py-4 rounded-2xl font-black text-xs uppercase text-slate-400 hover:bg-slate-50 transition-all">No, Keep it</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}