// import { useMemo, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, Download, FileText, User, CreditCard } from "lucide-react";

// export function ManageEmployeeSalary() {
//     const navigate = useNavigate();
//     const allData = [
//         { id: 1, name: "Honorato Terry", month: "2024-04", total: 5500 },
//         { id: 2, name: "Maisha Lucy", month: "2024-04", total: 4200 },
//         { id: 3, name: "Rahul Sharma", month: "2024-05", total: 6100 },
//         { id: 4, name: "Amit Kumar", month: "2024-05", total: 3900 },
//         { id: 5, name: "Sneha Patel", month: "2024-06", total: 7200 },
//         { id: 6, name: "Kiran Singh", month: "2024-06", total: 4800 },
//     ];

//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const perPage = 3;

//     const filtered = useMemo(() => allData.filter(r => r.name.toLowerCase().includes(search.toLowerCase())), [search]);
//     useEffect(() => { if (page > Math.ceil(filtered.length / perPage)) setPage(1); }, [filtered]);

//     const totalPages = Math.ceil(filtered.length / perPage);
//     const startIndex = (page - 1) * perPage;
//     const pageData = filtered.slice(startIndex, startIndex + perPage);

//     return (
//         <section className="bg-[#f1f5f4] min-h-screen p-4 md:p-8 text-slate-700">
//             <div className="max-w-7xl mx-auto">
//                 {/* TABS */}
//                 <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-200">
//                     <button onClick={() => navigate("/Payroll/salary-advance")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Salary Advance</button>
//                     <button onClick={() => navigate("/Payroll/salary-generate")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Salary Generate</button>
//                     <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/20">Manage Employee Salary</button>
//                 </div>

//                 <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-2xl font-black text-slate-800 tracking-tight">Employee Payroll</h1>
//                         <p className="text-sm text-slate-500 font-medium">Manage and download monthly salary slips</p>
//                     </div>
//                     <div className="relative w-full md:w-80">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                         <input placeholder="Search employee..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-[1.25rem] shadow-sm outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-50 transition-all" />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4">
//                     {pageData.length > 0 ? (
//                         pageData.map((r, i) => (
//                             <div key={r.id} className="bg-white rounded-3xl p-2 pr-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow group">
//                                 <div className="h-24 w-24 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-[#0a4d44] group-hover:bg-emerald-50 transition-colors shrink-0 m-2">
//                                     <User size={32} />
//                                 </div>

//                                 <div className="flex-1 text-center md:text-left">
//                                     <h3 className="text-lg font-bold text-slate-800">{r.name}</h3>
//                                     <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
//                                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><FileText size={12} /> {r.month}</span>
//                                         <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5"><CreditCard size={12} /> Paid</span>
//                                     </div>
//                                 </div>

//                                 <div className="text-center md:text-right px-6 border-x border-slate-50 hidden lg:block">
//                                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">Total Net Salary</p>
//                                     <p className="text-2xl font-black text-slate-800">₹ {r.total.toLocaleString()}</p>
//                                 </div>

//                                 <div className="flex gap-3 mb-4 md:mb-0">
//                                     <button onClick={() => alert(`Payslip: ${r.name}`)} className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2">
//                                         View Slip
//                                     </button>
//                                     <button onClick={() => alert(`Downloading: ${r.name}`)} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95">
//                                         <Download size={16} /> Download
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100">
//                             <p className="text-slate-400 font-medium">No records found for "{search}"</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* PAGINATION */}
//                 {totalPages > 1 && (
//                     <div className="mt-10 flex justify-center items-center gap-4">
//                         <button onClick={() => setPage(p => Math.max(p - 1, 1))} className="text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30" disabled={page === 1}>Previous</button>
//                         <div className="flex gap-2">
//                             {Array.from({ length: totalPages }, (_, i) => (
//                                 <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-[12px] font-black text-xs transition-all ${page === i + 1 ? "bg-[#0a4d44] text-white" : "bg-white text-slate-400"}`}>{i + 1}</button>
//                             ))}
//                         </div>
//                         <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} className="text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30" disabled={page === totalPages}>Next Page</button>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// }

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, FileText, User, CreditCard, Loader2 } from "lucide-react";

// Update this path based on your exact folder
import { salaryService } from "../../api/salaryService";

export function ManageEmployeeSalary() {
    const navigate = useNavigate();
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 5;

    // --- Fetch Data using the Service File ---
    useEffect(() => {
        const fetchSalaries = async () => {
            setLoading(true);
            try {
                // Using the service instead of direct axios
                const res = await salaryService.list();
                setSalaryData(res.data);
            } catch (err) {
                console.error("Error fetching payroll:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSalaries();
    }, []);

    // --- Search Logic ---
    const filtered = useMemo(() =>
        salaryData.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
        [search, salaryData]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const pageData = filtered.slice((page - 1) * perPage, page * perPage);

    const handleDownload = (id, name) => {
        // This should ideally come from your apiClient baseURL
        const DOWNLOAD_URL = `http://localhost:5000/api/salary/download-payslip/${id}`;
        alert(`Downloading Payslip for ${name}...`);
        window.open(DOWNLOAD_URL, "_blank");
    };

    return (
        <section className="bg-[#f1f5f4] min-h-screen p-4 md:p-8 text-slate-700">
            <div className="max-w-7xl mx-auto">

                {/* TABS */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-200">
                    <button onClick={() => navigate("/Payroll/salary-advance")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Salary Advance</button>
                    <button onClick={() => navigate("/Payroll/salary-generate")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Salary Generate</button>
                    <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0a4d44] text-white shadow-lg">Manage Employee Salary</button>
                </div>

                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Employee Payroll</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage and download monthly salary slips</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Search employee..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-[1.25rem] shadow-sm outline-none focus:ring-4 ring-emerald-50 transition-all"
                        />
                    </div>
                </div>

                {/* DATA DISPLAY */}
                {loading ? (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 className="animate-spin text-emerald-600 mb-2" size={40} />
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Payroll...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pageData.length > 0 ? (
                            pageData.map((r) => (
                                <div key={r._id} className="bg-white rounded-3xl p-2 pr-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow group">
                                    <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0a4d44] group-hover:bg-emerald-50 transition-colors shrink-0 m-2">
                                        <User size={28} />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-lg font-bold text-slate-800">{r.name}</h3>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <FileText size={12} /> {r.month}
                                            </span>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                                <CreditCard size={12} /> {r.status || 'Paid'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-center md:text-right px-8 border-x border-slate-50 hidden lg:block">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">Total Net Salary</p>
                                        <p className="text-xl font-black text-slate-800">₹ {r.total?.toLocaleString()}</p>
                                    </div>

                                    <div className="flex gap-3 mb-4 md:mb-0">
                                        <button className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 px-5 py-2.5 rounded-2xl text-xs font-black uppercase transition-all">
                                            View Slip
                                        </button>
                                        <button
                                            onClick={() => handleDownload(r._id, r.name)}
                                            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <Download size={14} /> Download
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-medium">No records found for "{search}"</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="mt-10 flex justify-center items-center gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === i + 1 ? "bg-[#0a4d44] text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}