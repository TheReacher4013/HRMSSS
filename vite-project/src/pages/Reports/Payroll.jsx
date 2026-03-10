import React, { useState } from "react";
import {
    Calculator,
    Landmark,
    TrendingUp,
    Loader2,
    RefreshCw
} from "lucide-react";
import { payrollAPI } from "../../services/api";

const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(num || 0);

const Payroll = () => {

    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [payrollData, setPayrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {

        if (!month) {
            setError("Please select a month first.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {

            const [yr, mo] = month.split("-");
            const res = await payrollAPI.getAll(`?year=${yr}&month=${parseInt(mo)}`);

            const all = res.data || [];

            const filtered = all.filter(p => {
                return String(p.year) === yr && Number(p.month) === parseInt(mo);
            });

            setPayrollData(filtered);
            setGenerated(true);

        } catch (err) {

            setError("Failed to load payroll data. Please try again.");
            console.error(err);

        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMonth(new Date().toISOString().slice(0, 7));
        setPayrollData([]);
        setGenerated(false);
        setError("");
    };

    const totalBasic = payrollData.reduce((s, e) => s + (e.basicSalary || 0), 0);
    const totalAllowances = payrollData.reduce((s, e) => s + (e.allowances || 0), 0);
    const totalDeductions = payrollData.reduce((s, e) => s + (e.deductions || 0), 0);
    const totalNet = payrollData.reduce((s, e) => s + (e.netSalary || 0), 0);

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [yr, mo] = month.split("-");
    const monthLabel = mo && yr ? `${MONTHS[parseInt(mo) - 1]} ${yr}` : "";

    return (

        <div className="px-3 py-4 sm:p-6 md:p-10 bg-slate-50 min-h-screen">

            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}

                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0">
                            <Landmark className="text-emerald-600" size={24} />
                        </div>

                        <div>
                            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 italic">
                                Payroll Engine
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                Monthly salary report
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">

                        <input
                            type="month"
                            value={month}
                            onChange={(e) => {
                                setMonth(e.target.value);
                                setError("");
                            }}
                            className="w-full sm:w-auto bg-slate-50 border border-slate-200 focus:ring-2 ring-emerald-300 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none"
                        />

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <TrendingUp size={14} />
                            )}
                            {isLoading ? "Loading..." : "Run Payroll"}
                        </button>

                        {generated && (
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-600 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                <RefreshCw size={13} /> Reset
                            </button>
                        )}

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl">
                        ⚠️ {error}
                    </div>
                )}

                {/* LOADING */}

                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-500" size={40} />
                    </div>
                )}

                {/* SUMMARY CARDS */}

                {generated && !isLoading && payrollData.length > 0 && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        {[
                            { label: "Total Basic", val: formatCurrency(totalBasic) },
                            { label: "Allowances", val: formatCurrency(totalAllowances) },
                            { label: "Deductions", val: formatCurrency(totalDeductions) },
                            { label: "Net Disbursal", val: formatCurrency(totalNet) }
                        ].map((s) => (

                            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">

                                <p className="text-[10px] uppercase text-slate-400 font-bold">
                                    {s.label}
                                </p>

                                <p className="text-base sm:text-lg font-black text-slate-800 break-words">
                                    {s.val}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    {payrollData.length} employees • {monthLabel}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Payroll;