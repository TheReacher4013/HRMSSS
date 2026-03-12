import { useState, useEffect } from "react";
import {
    Wallet,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    Eye
} from "lucide-react";

import { loanAPI } from "../../../services/api";

const STATUS_CONFIG = {
    Active: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Approved: { bg: "bg-blue-50", text: "text-blue-700" },
    Pending: { bg: "bg-amber-50", text: "text-amber-700" },
    Rejected: { bg: "bg-red-50", text: "text-red-600" },
    Completed: { bg: "bg-slate-100", text: "text-slate-600" }
};

const UserLoan = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        const loadLoans = async () => {
            try {
                const res = await loanAPI.getAll();
                setLoans(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadLoans();
    }, []);

    const totalBorrowed = loans.reduce((s, l) => s + (l.amount || 0), 0);

    const activeLoans = loans.filter(
        l => l.status === "Active" || l.status === "Approved"
    ).length;

    const completedLoans = loans.filter(
        l => l.status === "Completed"
    ).length;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Wallet className="text-green-600" /> My Loans
            </h1>

            {loading ? (
                <Loader2 className="animate-spin" />
            ) : loans.length === 0 ? (
                <p>No Loans Assigned</p>
            ) : (
                <>
                    {/* SUMMARY */}

                    <div className="grid grid-cols-3 gap-4 mb-6">

                        <Card label="Total Borrowed" value={`₹${totalBorrowed}`} />

                        <Card label="Active Loans" value={activeLoans} />

                        <Card label="Completed Loans" value={completedLoans} />

                    </div>

                    {/* LOANS */}

                    <div className="space-y-4">

                        {loans.map(loan => {

                            const progress = loan.installments
                                ? Math.round(
                                    ((loan.paidInstallments || 0) /
                                        loan.installments) *
                                    100
                                )
                                : 0;

                            const cfg =
                                STATUS_CONFIG[loan.status] ||
                                STATUS_CONFIG.Pending;

                            return (
                                <div
                                    key={loan._id}
                                    className="bg-white p-5 rounded-xl shadow"
                                >

                                    <div className="flex justify-between mb-3">

                                        <div>
                                            <p className="font-bold text-lg">
                                                ₹{loan.amount}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {loan.reason}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 text-xs rounded ${cfg.bg} ${cfg.text}`}
                                        >
                                            {loan.status}
                                        </span>

                                    </div>

                                    <p className="text-sm mb-2">
                                        Installments: {loan.paidInstallments || 0} /
                                        {loan.installments}
                                    </p>

                                    {/* PROGRESS BAR */}

                                    <div className="w-full bg-gray-200 h-2 rounded mb-3">

                                        <div
                                            className="bg-green-500 h-2 rounded"
                                            style={{ width: `${progress}%` }}
                                        />

                                    </div>

                                    {/* VIEW BUTTON */}

                                    <button
                                        onClick={() => setSelectedLoan(loan)}
                                        className="flex items-center gap-2 text-blue-600 text-sm"
                                    >
                                        <Eye size={14} /> View Details
                                    </button>

                                </div>
                            );
                        })}

                    </div>
                </>
            )}

            {/* DETAILS MODAL */}

            {selectedLoan && (

                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

                    <div className="bg-white p-6 rounded-lg w-[350px]">

                        <h2 className="font-bold mb-4">
                            Loan Details
                        </h2>

                        <p>Amount: ₹{selectedLoan.amount}</p>

                        <p>
                            Installments: {selectedLoan.paidInstallments} /
                            {selectedLoan.installments}
                        </p>

                        <p>Status: {selectedLoan.status}</p>

                        <p>Interest: {selectedLoan.interestRate}%</p>

                        <p>Reason: {selectedLoan.reason}</p>

                        <button
                            onClick={() => setSelectedLoan(null)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

const Card = ({ label, value }) => (
    <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
    </div>
);

export default UserLoan;