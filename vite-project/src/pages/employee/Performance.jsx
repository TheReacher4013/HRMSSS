// import { useState, useMemo } from "react";
// import { Plus, Pencil, Trash2, Trophy, Search, Calendar, User, X, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

// const EmployeePerformance = () => {
//     const [data, setData] = useState([
//         { id: 1, name: "Uma Stafford", score: 519, date: "2025-11-25" },
//         { id: 2, name: "Babara Patel", score: 46, date: "2025-09-04" },
//         { id: 3, name: "Inga Rose Dennis Robbins", score: 72, date: "2025-08-03" },
//         { id: 4, name: "Jonathan Ibrahim Shekh", score: 82, date: "2025-05-09" },
//         { id: 5, name: "Iman", score: 73, date: "2025-04-29" },
//         { id: 6, name: "Honorato Imogene Curry Terry", score: 67, date: "2025-01-25" },
//         { id: 7, name: "Scarlet Melvin Reese Rogers", score: 57, date: "2025-01-25" },
//         { id: 8, name: "Jerome Grace Willis Terry", score: 59, date: "2025-01-07" },
//     ]);

//     const [showForm, setShowForm] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [search, setSearch] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [form, setForm] = useState({ name: "", score: "", date: "" });

//     const entriesPerPage = 5;

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (editId) {
//             setData((prev) => prev.map((item) => (item.id === editId ? { ...item, ...form } : item)));
//         } else {
//             setData((prev) => [{ id: Date.now(), ...form }, ...prev]);
//         }
//         setForm({ name: "", score: "", date: "" });
//         setEditId(null);
//         setShowForm(false);
//     };

//     const handleEdit = (item) => {
//         setForm(item);
//         setEditId(item.id);
//         setShowForm(true);
//     };

//     const handleDelete = (id) => {
//         if (window.confirm("Are you sure you want to delete this performance record?")) {
//             setData((prev) => prev.filter((i) => i.id !== id));
//         }
//     };

//     const filteredData = useMemo(() => {
//         return data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
//     }, [data, search]);

//     const totalPages = Math.ceil(filteredData.length / entriesPerPage);
//     const start = (currentPage - 1) * entriesPerPage;
//     const paginatedData = filteredData.slice(start, start + entriesPerPage);

//     return (
//         <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
//             <div className="max-w-6xl mx-auto">

//                 {/* HEADER SECTION */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//                             <div className="p-2 bg-amber-100 rounded-xl">
//                                 <Trophy className="text-amber-600" size={24} />
//                             </div>
//                             Performance Analytics
//                         </h1>
//                         <p className="text-slate-500 text-sm font-medium mt-1">Track and evaluate employee contributions</p>
//                     </div>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
//                     >
//                         <Plus size={18} /> Add Performance
//                     </button>
//                 </div>

//                 {/* INLINE FORM (Modern Style) */}
//                 {showForm && (
//                     <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 animate-in zoom-in-95 duration-200">
//                         <div className="flex justify-between items-center mb-6 px-2">
//                             <h3 className="font-bold text-slate-800">{editId ? "Update Record" : "New Performance Entry"}</h3>
//                             <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
//                         </div>
//                         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Employee Name</label>
//                                 <div className="relative">
//                                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                                     <input required placeholder="Search name..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
//                                         className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all" />
//                                 </div>
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Performance Score</label>
//                                 <div className="relative">
//                                     <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                                     <input required type="number" placeholder="0 - 1000" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })}
//                                         className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all" />
//                                 </div>
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Record Date</label>
//                                 <div className="relative">
//                                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                                     <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
//                                         className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-4 ring-emerald-50 outline-none transition-all" />
//                                 </div>
//                             </div>
//                             <div className="md:col-span-3 flex justify-end gap-3 mt-2">
//                                 <button type="submit" className="bg-[#0a4d44] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all active:scale-95">
//                                     {editId ? "Update Analytics" : "Submit Performance"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 )}

//                 {/* SEARCH BAR */}
//                 <div className="relative w-full max-w-md ml-auto mb-6">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                     <input placeholder="Search employee..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//                         className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-4 ring-emerald-50 transition-all" />
//                 </div>

//                 {/* DESKTOP TABLE */}
//                 <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//                     <table className="w-full text-left">
//                         <thead>
//                             <tr className="bg-slate-50/50 border-b border-slate-100">
//                                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Sl No.</th>
//                                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Employee Details</th>
//                                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Score Analytics</th>
//                                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Create Date</th>
//                                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-50">
//                             {paginatedData.map((item, i) => (
//                                 <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
//                                     <td className="px-6 py-5 text-sm font-bold text-slate-300">{String(start + i + 1).padStart(2, '0')}</td>
//                                     <td className="px-6 py-5">
//                                         <p className="text-sm font-bold text-slate-700">{item.name}</p>
//                                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Personnel Record</p>
//                                     </td>
//                                     <td className="px-6 py-5">
//                                         <div className="flex items-center gap-3">
//                                             <span className={`text-sm font-black ${item.score > 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{item.score}</span>
//                                             <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                                                 <div className={`h-full rounded-full ${item.score > 100 ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ width: `${Math.min((item.score / 600) * 100, 100)}%` }} />
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-5 text-sm font-medium text-slate-500 italic">{item.date}</td>
//                                     <td className="px-6 py-5">
//                                         <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <button onClick={() => handleEdit(item)} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 transition-all"><Pencil size={16} /></button>
//                                             <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white border border-slate-100 text-red-600 rounded-xl hover:border-red-200 transition-all"><Trash2 size={16} /></button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* MOBILE CARDS */}
//                 <div className="md:hidden space-y-4">
//                     {paginatedData.map((item) => (
//                         <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
//                                     <Trophy size={20} />
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-xs font-black text-emerald-600">{item.score} Points</p>
//                                     <p className="text-[9px] text-slate-400 font-bold uppercase">{item.date}</p>
//                                 </div>
//                             </div>
//                             <h3 className="font-bold text-slate-800 text-lg mb-6 leading-tight">{item.name}</h3>
//                             <div className="flex gap-2 border-t border-slate-50 pt-4">
//                                 <button onClick={() => handleEdit(item)} className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Pencil size={14} /> Edit</button>
//                                 <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Trash2 size={14} /> Delete</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* PAGINATION */}
//                 {totalPages > 1 && (
//                     <div className="flex justify-between items-center mt-8 px-2">
//                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Page {currentPage} of {totalPages}</p>
//                         <div className="flex gap-2">
//                             <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
//                                 className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all">
//                                 <ChevronLeft size={20} />
//                             </button>
//                             <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
//                                 className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all">
//                                 <ChevronRight size={20} />
//                             </button>
//                         </div>
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// };

// export default EmployeePerformance;





import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Trophy, Search, Calendar, User, X, BarChart3, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const EmployeePerformance = () => {
    // States
    const [performanceData, setPerformanceData] = useState([]); // From Backend
    const [employees, setEmployees] = useState([]); // For the name dropdown
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [form, setForm] = useState({ employeeId: "", score: "", date: "" });

    const entriesPerPage = 5;

    // --- 1. Fetch Data from Backend ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Dono APIs se ek saath data mangwana
            const [perfRes, empRes] = await Promise.all([
                axios.get("http://localhost:5000/api/performance"),
                axios.get("http://localhost:5000/api/employees")
            ]);
            setPerformanceData(perfRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- 2. Create / Update Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/performance/${editId}`, form);
            } else {
                await axios.post("http://localhost:5000/api/performance", form);
            }
            fetchData(); // Refresh list after change
            resetForm();
        } catch (err) {
            alert("Error saving record");
        }
    };

    const resetForm = () => {
        setForm({ employeeId: "", score: "", date: "" });
        setEditId(null);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this record?")) {
            try {
                await axios.delete(`http://localhost:5000/api/performance/${id}`);
                fetchData();
            } catch (err) { console.error(err); }
        }
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        return performanceData.filter((item) =>
            item.employeeId?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [performanceData, search]);

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const start = (currentPage - 1) * entriesPerPage;
    const paginatedData = filteredData.slice(start, start + entriesPerPage);

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-xl"><Trophy className="text-amber-600" size={24} /></div>
                            Performance Analytics
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Real-time backend synchronization</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="w-full md:w-auto bg-[#0a4d44] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-900/10">
                        <Plus size={18} /> Add Performance
                    </button>
                </div>

                {/* FORM SECTION */}
                {showForm && (
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-8 animate-in zoom-in-95">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Select Employee</label>
                                <select
                                    required
                                    value={form.employeeId}
                                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-4 ring-emerald-50"
                                >
                                    <option value="">Choose Employee...</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Score (0-1000)</label>
                                <input type="number" required value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Date</label>
                                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm" />
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-3">
                                <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-400">Cancel</button>
                                <button type="submit" className="bg-[#0a4d44] text-white px-8 py-3 rounded-xl font-bold">Save Changes</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* DATA TABLE */}
                {loading ? (
                    <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Employee</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Analytics</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedData.map((item) => (
                                    <tr key={item._id} className="group hover:bg-slate-50/50">
                                        <td className="px-6 py-5 font-bold text-slate-700">
                                            {item.employeeId?.name || "Deleted Employee"}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black text-emerald-600">{item.score}</span>
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400" style={{ width: `${(item.score / 1000) * 100}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 flex justify-center gap-2">
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeePerformance;