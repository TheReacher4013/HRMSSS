import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Search, CheckCircle, List, ArrowRight } from "lucide-react";

export function SalaryGenerate() {
    const navigate = useNavigate();
    const [month, setMonth] = useState("");
    const [list, setList] = useState([
        { id: 1, month: "2026-02", genDate: "2026-02-12", by: "Admin", status: "Approved" },
        { id: 2, month: "2026-01", genDate: "2026-01-29", by: "Admin", status: "Approved" },
        { id: 3, month: "2025-12", genDate: "2025-12-28", by: "Admin", status: "Approved" },
        { id: 4, month: "2025-11", genDate: "2025-11-26", by: "HR", status: "Approved" },
    ]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 3;

    const handleGenerate = () => {
        if (!month) return alert("Select month first");
        const today = new Date().toISOString().slice(0, 10);
        setList(prev => [{ id: Date.now(), month, genDate: today, by: "Admin", status: "Generated" }, ...prev]);
        setMonth("");
    };

    const filtered = useMemo(() => {
        return list.filter(r =>
            r.month.includes(search) ||
            r.by.toLowerCase().includes(search.toLowerCase()) ||
            r.status.toLowerCase().includes(search.toLowerCase())
        );
    }, [list, search]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const startIndex = (page - 1) * perPage;
    const pageData = filtered.slice(startIndex, startIndex + perPage);

    return (
        <section className="bg-[#f1f5f4] min-h-screen p-4 md:p-8 font-sans text-slate-700">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-200">
                    <button onClick={() => navigate("/Payroll/salary-advance")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Salary Advance</button>
                    <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/20">Salary Generate</button>
                    <button onClick={() => navigate("/Payroll/manage-employee-salary")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Manage Employee Salary</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-50 p-2.5 rounded-xl text-[#0a4d44]"><Calendar size={20} /></div>
                            <h2 className="font-bold text-lg text-slate-800">Generate Salary</h2>
                        </div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Select Month</label>
                        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 ring-emerald-100 outline-none transition-all mb-4" />
                        <button onClick={handleGenerate} className="w-full bg-[#0a4d44] hover:bg-[#063b34] text-white p-3.5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md">
                            Run Payroll <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-2">
                            <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2"><List size={20} className="text-emerald-600" /> History</h2>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input placeholder="Search records..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none focus:border-emerald-500 transition-all shadow-sm" />
                            </div>
                        </div>

                        <div className="bg-[#fcfdfd] border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                            <table className="w-full text-left hidden md:table">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        {["#", "Month", "Date", "By", "Status", "Action"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pageData.map((r, i) => (
                                        <tr key={r.id} className="hover:bg-emerald-50/30 transition-colors group">
                                            <td className="px-6 py-4 text-xs font-medium text-slate-400">{startIndex + i + 1}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700 text-sm">{r.month}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">{r.genDate}</td>
                                            <td className="px-6 py-4 text-slate-600 font-medium text-sm">{r.by}</td>
                                            <td className="px-6 py-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-tight">{r.status}</span></td>
                                            <td className="px-6 py-4"><CheckCircle size={18} className="text-slate-300 group-hover:text-emerald-500 cursor-pointer transition-colors" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="md:hidden divide-y divide-slate-100">
                                {pageData.map((r, i) => (
                                    <div key={r.id} className="p-5 space-y-2 bg-white">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-800">{r.month}</span>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold uppercase">{r.status}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 flex justify-between">
                                            <span>Generated by {r.by}</span>
                                            <span>{r.genDate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? "bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/20" : "bg-white text-slate-400 hover:bg-slate-100"}`}>{i + 1}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}