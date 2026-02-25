import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, IndianRupee, X } from "lucide-react";

export default function SalaryAdvance() {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([
        { id: 31, name: "Maisha Lucy Zamora Gonzales", amount: 500, release: 0, month: "2025-09", status: "Active" },
        { id: 32, name: "Uma Stafford", amount: 26, release: 0, month: "1999-04", status: "Active" },
        { id: 33, name: "Amy Peck", amount: 200, release: 0, month: "2025-10", status: "Active" },
    ]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: "", amount: "", release: "", month: "", status: "Active" });

    const perPage = 5;
    const filtered = useMemo(() => allData.filter(r => r.name.toLowerCase().includes(search.toLowerCase())), [allData, search]);
    const totalPages = Math.ceil(filtered.length / perPage);
    const startIndex = (page - 1) * perPage;
    const pageData = filtered.slice(startIndex, startIndex + perPage);

    const openAdd = () => { setEditId(null); setForm({ name: "", amount: "", release: "", month: "", status: "Active" }); setShowModal(true); };
    const openEdit = (row) => { setEditId(row.id); setForm(row); setShowModal(true); };
    const saveRow = () => {
        if (!form.name || !form.amount || !form.month) return alert("Fill required fields");
        if (editId) {
            setAllData(prev => prev.map(r => r.id === editId ? { ...r, ...form, amount: +form.amount, release: +form.release } : r));
        } else {
            setAllData(prev => [{ id: Date.now(), ...form, amount: +form.amount, release: +(form.release || 0) }, ...prev]);
        }
        setShowModal(false);
    };
    const deleteRow = (id) => { if (window.confirm("Delete this record?")) setAllData(prev => prev.filter(r => r.id !== id)); };

    return (
        <section className="bg-[#f8faf9] min-h-screen p-4 md:p-8 text-slate-700">
            <div className="max-w-7xl mx-auto">
                {/* TABS */}
                <div className="flex flex-wrap gap-2 mb-6 bg-white/80 p-1.5 rounded-2xl w-fit border border-slate-200">
                    <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/20">Salary Advance</button>
                    <button onClick={() => navigate("/Payroll/salary-generate")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Salary Generate</button>
                    <button onClick={() => navigate("/Payroll/manage-employee-salary")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all">Manage Employee Salary</button>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Advance Requests</h2>
                        <div className="flex w-full md:w-auto gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input placeholder="Search name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:ring-2 ring-emerald-50 outline-none transition-all" />
                            </div>
                            <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 md:px-4 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-200">
                                <Plus size={18} /> <span className="hidden md:inline font-semibold">Add New</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pageData.map((r, i) => (
                            <div key={r.id} className="bg-[#fcfdfd] border border-slate-100 rounded-3xl p-5 hover:border-emerald-200 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-100 transition-colors" />
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-slate-400 text-xs font-bold">#{startIndex + i + 1}</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{r.status}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-4 line-clamp-1">{r.name}</h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Month</span>
                                            <span className="font-semibold">{r.month}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Advance</span>
                                            <span className="text-emerald-700 font-black flex items-center gap-1"><IndianRupee size={14} /> {r.amount}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(r)} className="flex-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium"><Edit2 size={14} /> Edit</button>
                                        <button onClick={() => deleteRow(r.id)} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-6 border-t border-slate-50 flex justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1 ? "bg-[#0a4d44] text-white shadow-lg shadow-emerald-900/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>{i + 1}</button>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">{editId ? "Update Advance" : "New Advance"}</h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Employee Name</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 ring-emerald-50 outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Amount</label>
                                        <input type="number" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 ring-emerald-50 outline-none" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Month</label>
                                        <input type="month" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 ring-emerald-50 outline-none" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
                                    </div>
                                </div>
                                <button onClick={saveRow} className="w-full bg-[#0a4d44] hover:bg-slate-800 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 transition-all mt-4">Confirm & Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}