import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, Loader2, Download } from "lucide-react";
import { payrollAPI } from "../../../services/api";

const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const UserSalary = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [advances, setAdvances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("salary"); // "salary" | "advance"

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [payRes, advRes] = await Promise.all([
                    payrollAPI.getAll(),
                    payrollAPI.getAdvances(),
                ]);
                setPayrolls(payRes.data);
                setAdvances(advRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, []);

    const totalPaid = payrolls.filter(p => p.status === "Paid").reduce((s, p) => s + (p.netSalary || 0), 0);
    const totalPending = payrolls.filter(p => p.status !== "Paid").reduce((s, p) => s + (p.netSalary || 0), 0);

    return (
        <div className="min-h-screen bg-[#f8fafa] p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-black text-[#0f2e2e]">My Salary</h1>
                    <p className="text-gray-400 text-sm mt-1">Salary slips and advance requests</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Received</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalPaid.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">{payrolls.filter(p => p.status === "Paid").length} slips paid</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
                        <p className="text-2xl font-black text-orange-500 mt-1">₹{totalPending.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">{payrolls.filter(p => p.status !== "Paid").length} slips pending</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Salary Advances</p>
                        <p className="text-2xl font-black text-blue-600 mt-1">{advances.length}</p>
                        <p className="text-xs text-gray-400 mt-1">{advances.filter(a => a.status === "Approved").length} approved</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {["salary", "advance"].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === t ? "bg-[#0f2e2e] text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                                }`}>
                            {t === "salary" ? "Salary Slips" : "Salary Advances"}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-emerald-600" size={36} />
                    </div>
                ) : tab === "salary" ? (
                    <div className="space-y-3">
                        {payrolls.length === 0 ? (
                            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                                <DollarSign size={40} className="mx-auto mb-3 text-gray-200" />
                                <p className="font-bold text-gray-500">No salary slips generated yet</p>
                                <p className="text-sm text-gray-400">Your admin will generate salary slips here</p>
                            </div>
                        ) : payrolls.map(p => (
                            <div key={p._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-emerald-100 rounded-xl">
                                                <DollarSign size={18} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#0f2e2e]">{MONTHS[p.month]} {p.year}</p>
                                                <p className="text-xs text-gray-400">Salary Slip</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Basic</p>
                                                <p className="text-sm font-black text-gray-700 mt-0.5">₹{(p.basicSalary || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-emerald-50 rounded-xl p-3">
                                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Allowances</p>
                                                <p className="text-sm font-black text-emerald-700 mt-0.5">+₹{(p.allowances || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-red-50 rounded-xl p-3">
                                                <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Deductions</p>
                                                <p className="text-sm font-black text-red-600 mt-0.5">-₹{((p.deductions || 0) + (p.tax || 0)).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-indigo-50 rounded-xl p-3 border-2 border-indigo-100">
                                                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Net Pay</p>
                                                <p className="text-sm font-black text-indigo-700 mt-0.5">₹{(p.netSalary || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${p.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                                                p.status === "Cancelled" ? "bg-red-100 text-red-600" :
                                                    "bg-orange-100 text-orange-600"}`}>
                                            {p.status}
                                        </span>
                                        {p.status === "Paid" && p.paidOn && (
                                            <p className="text-[10px] text-gray-400">
                                                Paid: {new Date(p.paidOn).toLocaleDateString("en-IN")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Advances tab */
                    <div className="space-y-3">
                        {advances.length === 0 ? (
                            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                                <Clock size={40} className="mx-auto mb-3 text-gray-200" />
                                <p className="font-bold text-gray-500">No salary advance requests</p>
                            </div>
                        ) : advances.map(a => (
                            <div key={a._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${a.status === "Approved" ? "bg-emerald-100" : a.status === "Rejected" ? "bg-red-100" : "bg-orange-100"}`}>
                                        {a.status === "Approved" ? <CheckCircle size={20} className="text-emerald-600" /> :
                                            <Clock size={20} className={a.status === "Rejected" ? "text-red-500" : "text-orange-500"} />}
                                    </div>
                                    <div>
                                        <p className="font-black text-[#0f2e2e]">₹{(a.amount || 0).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{a.reason || "Salary Advance"}</p>
                                        <p className="text-[10px] text-gray-300 mt-0.5">{new Date(a.requestDate || a.createdAt).toLocaleDateString("en-IN")}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase shrink-0 ${a.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                        a.status === "Rejected" ? "bg-red-100 text-red-600" :
                                            "bg-orange-100 text-orange-600"}`}>
                                    {a.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSalary;
