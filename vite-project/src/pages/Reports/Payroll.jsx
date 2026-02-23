import React, { useState } from "react";
import { Download, Calculator, Landmark, IndianRupee, TrendingUp, AlertCircle, Users } from "lucide-react";

const Payroll = () => {
    const [month, setMonth] = useState("2026-02");
    const [payrollData, setPayrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mockPayroll = [
        { id: "EMP001", name: "Honorato Curry", basic: 50000, allowance: 5000, deductions: 2000 },
        { id: "EMP002", name: "Maisha Gonzales", basic: 65000, allowance: 8000, deductions: 3500 },
        { id: "EMP003", name: "Arjun Mehta", basic: 45000, allowance: 4000, deductions: 1500 },
    ];

    const handleGenerate = () => {
        if (!month) return alert("Please select a month first!");
        setIsLoading(true);
        setTimeout(() => {
            setPayrollData(mockPayroll);
            setIsLoading(false);
        }, 800);
    };

    const formatCurrency = (num) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(num);

    const totalPayout = payrollData.reduce(
        (acc, curr) => acc + (curr.basic + curr.allowance - curr.deductions),
        0
    );

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Glassmorphic Header */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <Landmark className="text-emerald-600" size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Payroll Engine</h2>
                            <p className="text-slate-500 font-medium">Verified Salary Processing Hub</p>
                        </div>
                    </div>

                    <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-white border-none focus:ring-0 p-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm outline-none"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? "CALCULATING..." : "RUN PAYROLL"}
                        </button>
                    </div>
                </div>

                {/* Summary Stat Card */}
                {payrollData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-indigo-200">
                            <TrendingUp className="absolute right-[-10%] bottom-[-10%] text-white/10" size={200} />
                            <div>
                                <p className="text-indigo-100 uppercase text-xs font-black tracking-widest">Total Net Disbursal</p>
                                <h3 className="text-5xl font-black mt-2">{formatCurrency(totalPayout)}</h3>
                            </div>
                            <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                                <Users size={16} />
                                <span className="text-sm font-bold italic">{payrollData.length} Personnel processed</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="text-amber-600" size={32} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight">Compliance Status</h4>
                            <p className="text-slate-400 text-sm mt-2 font-medium">All tax deductions (TDS) calculated per FY 2026-27 norms.</p>
                        </div>
                    </div>
                )}

                {/* Payroll Table (Desktop) */}
                <div className="hidden md:block bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="p-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                <th className="p-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Basic Salary</th>
                                <th className="p-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Allowances</th>
                                <th className="p-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Deductions</th>
                                <th className="p-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Net Payable</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {payrollData.map((emp) => {
                                const net = emp.basic + emp.allowance - emp.deductions;
                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="p-8">
                                            <div className="font-black text-slate-800">{emp.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{emp.id}</div>
                                        </td>
                                        <td className="p-8 text-right font-medium text-slate-600">{formatCurrency(emp.basic)}</td>
                                        <td className="p-8 text-right font-bold text-blue-600">+{formatCurrency(emp.allowance)}</td>
                                        <td className="p-8 text-right font-bold text-rose-500">-{formatCurrency(emp.deductions)}</td>
                                        <td className="p-8 text-right">
                                            <span className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-xl font-black text-base border border-emerald-100">
                                                {formatCurrency(net)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Optional: simplified) */}
                {payrollData.length === 0 && !isLoading && (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 flex flex-col items-center justify-center text-center">
                        <div className="p-5 bg-slate-50 rounded-3xl mb-4">
                            <Calculator size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">System Ready</h3>
                        <p className="text-slate-400 max-w-xs mt-2">Select a month and click 'Run Payroll' to initiate the salary distribution engine.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Payroll;