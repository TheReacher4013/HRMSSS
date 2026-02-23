// import React, { useState } from "react";
// import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, X, Wallet, User, Calendar } from "lucide-react";

// const ITEMS_PER_PAGE = 5;

// const Loan = () => {
//   const [loans, setLoans] = useState([
//     { id: 1, employee: "Maisha Lucy Zamora Gonzales", permittedBy: "Jerome Grace Willis Terry", amount: 48000, interest: 0, period: 48, repaymentAmount: 48000, approvedDate: "2026-01-28", repaymentFrom: "2026-01-14", status: "Active" },
//   ]);

//   const emptyForm = { employee: "", permittedBy: "", amount: "", interest: "", period: "", repaymentAmount: "", approvedDate: "", repaymentFrom: "", status: "Active" };

//   const [form, setForm] = useState(emptyForm);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [filter, setFilter] = useState("");
//   const [page, setPage] = useState(1);

//   const filteredLoans = loans.filter((l) => l.employee.toLowerCase().includes(filter.toLowerCase()));
//   const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
//   const paginatedLoans = filteredLoans.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//   const handleSave = () => {
//     if (editId) {
//       setLoans(loans.map((l) => (l.id === editId ? { ...l, ...form } : l)));
//     } else {
//       setLoans([{ ...form, id: Date.now() }, ...loans]);
//     }
//     setForm(emptyForm); setEditId(null); setShowForm(false);
//   };

//   return (
//     <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans">
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Wallet size={24} /></div>
//               Loan Management
//             </h1>
//             <p className="text-slate-500 text-sm font-medium mt-1">Track employee loans and repayments</p>
//           </div>
//           <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg font-bold">
//             <Plus size={18} /> Add New Loan
//           </button>
//         </div>

//         {/* FILTER */}
//         <div className="relative w-full max-w-sm ml-auto mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//           <input placeholder="Search by employee..." value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-emerald-50 transition-all" />
//         </div>

//         {/* TABLE */}
//         <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
//                 <th className="px-6 py-5">Employee Info</th>
//                 <th className="px-6 py-5">Amount Details</th>
//                 <th className="px-6 py-5 text-center">Installments</th>
//                 <th className="px-6 py-5">Approved Date</th>
//                 <th className="px-6 py-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginatedLoans.map((loan) => (
//                 <tr key={loan.id} className="group hover:bg-slate-50/50 transition-all">
//                   <td className="px-6 py-5">
//                     <div className="font-bold text-slate-700">{loan.employee}</div>
//                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">By: {loan.permittedBy}</div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="text-sm font-black text-slate-800">${loan.amount}</div>
//                     <div className="text-[10px] text-emerald-600 font-bold uppercase">Int: {loan.interest}%</div>
//                   </td>
//                   <td className="px-6 py-5 text-center">
//                     <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">{loan.period} Months</span>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
//                       <Calendar size={14} /> {loan.approvedDate}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => { setForm(loan); setEditId(loan.id); setShowForm(true); }} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl shadow-sm hover:border-blue-200"><Pencil size={16} /></button>
//                       <button onClick={() => setDeleteId(loan.id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl shadow-sm hover:border-red-200"><Trash2 size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE CARDS */}
//         <div className="md:hidden space-y-4">
//           {paginatedLoans.map((loan) => (
//             <div key={loan.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
//               <div className="flex justify-between items-start mb-4">
//                 <h3 className="font-bold text-slate-800 pr-4 leading-tight">{loan.employee}</h3>
//                 <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{loan.status}</span>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="p-3 bg-slate-50 rounded-2xl text-center">
//                   <p className="text-[10px] text-slate-400 font-black uppercase">Amount</p>
//                   <p className="text-sm font-black text-slate-800">${loan.amount}</p>
//                 </div>
//                 <div className="p-3 bg-slate-50 rounded-2xl text-center">
//                   <p className="text-[10px] text-slate-400 font-black uppercase">Months</p>
//                   <p className="text-sm font-black text-slate-800">{loan.period}</p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => { setForm(loan); setEditId(loan.id); setShowForm(true); }} className="flex-1 bg-blue-50 text-blue-600 font-bold py-3 rounded-2xl text-xs">Edit</button>
//                 <button onClick={() => setDeleteId(loan.id)} className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl text-xs">Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* MODAL */}
//         {showForm && (
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
//             <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//               <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
//                 <h2 className="font-black text-slate-800 tracking-tight">{editId ? "Update Loan Record" : "New Loan Application"}</h2>
//                 <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
//               </div>
//               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
//                 {Object.keys(emptyForm).map((key) => (
//                   <div key={key} className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
//                     <input name={key} value={form[key]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder={`Enter ${key}...`} className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none focus:ring-4 ring-emerald-50 transition-all" />
//                   </div>
//                 ))}
//               </div>
//               <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-3">
//                 <button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
//                 <button onClick={handleSave} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 tracking-wide">
//                   {editId ? "Update Loan" : "Process Loan"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* DELETE MODAL (Same theme) */}
//         {deleteId && (
//           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
//             <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
//               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><Trash2 size={40} /></div>
//               <h2 className="text-xl font-black text-slate-800 mb-2">Delete Record?</h2>
//               <p className="text-slate-500 text-sm font-medium mb-8">This loan record will be permanently removed from the system.</p>
//               <div className="flex flex-col gap-2">
//                 <button onClick={() => { setLoans(loans.filter((l) => l.id !== deleteId)); setDeleteId(null); }} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg">Confirm Delete</button>
//                 <button onClick={() => setDeleteId(null)} className="w-full py-4 rounded-2xl font-bold text-slate-400">Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Loan;



import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, X, Wallet, Calendar, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/loans"; // Make sure to create this route

const Loan = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("");

  const emptyForm = {
    employee: "",
    permittedBy: "",
    amount: 0,
    interest: 0,
    period: 12,
    repaymentAmount: 0,
    approvedDate: new Date().toISOString().split('T')[0],
    repaymentFrom: "",
    status: "Active"
  };

  const [form, setForm] = useState(emptyForm);

  // --- API: Fetch Loans ---
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setLoans(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLoans(); }, []);

  // --- Logic: Auto-Calculate Repayment ---
  // Simple Interest Formula: P + (P * R * T / 100)
  useEffect(() => {
    const p = parseFloat(form.amount) || 0;
    const r = parseFloat(form.interest) || 0;
    const t = (parseFloat(form.period) || 0) / 12; // Period in years
    const total = p + (p * r * t / 100);
    setForm(prev => ({ ...prev, repaymentAmount: total.toFixed(2) }));
  }, [form.amount, form.interest, form.period]);

  const handleSave = async () => {
    if (!form.employee || !form.amount) return alert("Fill required fields");
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchLoans();
      setShowForm(false);
      setEditId(null);
    } catch (err) { alert("Save failed"); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Wallet size={24} /></div>
              Loan Portal
            </h1>
            <p className="text-slate-500 text-sm font-medium">Automated Interest & Repayment Tracking</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl font-black text-xs uppercase">
            <Plus size={18} /> Issue New Loan
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full max-w-sm ml-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input placeholder="Search employee..." onChange={(e) => setFilter(e.target.value)} className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-emerald-50 font-bold" />
        </div>

        {/* DATA TABLE */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-6">Employee & Authority</th>
                  <th className="px-8 py-6">Financials</th>
                  <th className="px-8 py-6">Tenure</th>
                  <th className="px-8 py-6">Total Due</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loans.filter(l => l.employee.toLowerCase().includes(filter.toLowerCase())).map((loan) => (
                  <tr key={loan._id} className="group hover:bg-slate-50/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-700">{loan.employee}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Approved by: {loan.permittedBy}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-800">₹{loan.amount}</div>
                      <div className="text-[10px] text-emerald-600 font-black tracking-tighter">@{loan.interest}% INTEREST</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-600 uppercase">{loan.period} Months</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-indigo-600">₹{loan.repaymentAmount}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">EMI: ₹{(loan.repaymentAmount / loan.period).toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => { setForm(loan); setEditId(loan._id); setShowForm(true); }} className="p-2 text-blue-600 hover:bg-white rounded-xl shadow-sm"><Pencil size={16} /></button>
                        <button onClick={() => setDeleteId(loan._id)} className="p-2 text-red-500 hover:bg-white rounded-xl shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">{editId ? "Edit Loan" : "New Loan Request"}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
              </div>

              <div className="p-10 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto font-bold">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Employee Name</label>
                  <input value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm outline-none" placeholder="Search employee..." />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Permitted By</label>
                  <input value={form.permittedBy} onChange={(e) => setForm({ ...form, permittedBy: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm outline-none" placeholder="Manager name..." />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Loan Amount (Principal)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Interest Rate (%)</label>
                  <input type="number" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 ml-1">Period (Months)</label>
                  <input type="number" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm outline-none" />
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <label className="text-[10px] uppercase text-indigo-400 block">Total Repayment (Auto)</label>
                  <span className="text-lg font-black text-indigo-700">₹{form.repaymentAmount}</span>
                </div>
              </div>

              <div className="px-10 pb-10 flex gap-4">
                <button onClick={handleSave} className="flex-1 bg-[#0a4d44] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  Confirm & Process Loan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loan;