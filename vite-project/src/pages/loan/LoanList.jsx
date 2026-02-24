import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, X, Wallet, Calendar, AlertCircle } from "lucide-react";
import { loanAPI } from "../../utils/api";

const ITEMS_PER_PAGE = 5;

const Loan = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyForm = { employee: "", permittedBy: "", amount: "", interest: "", period: "", repaymentAmount: "", approvedDate: "", repaymentFrom: "", status: "Active" };
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchLoans = async () => {
    setLoading(true);
    try { const res = await loanAPI.getAll(); setLoans(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLoans(); }, []);

  const filteredLoans = loans.filter(l => l.employee.toLowerCase().includes(filter.toLowerCase()));
  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
  const paginatedLoans = filteredLoans.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = async () => {
    try {
      if (editId) { await loanAPI.update(editId, form); }
      else { await loanAPI.create(form); }
      setForm(emptyForm); setEditId(null); setShowForm(false); fetchLoans();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async () => {
    try { await loanAPI.remove(deleteId); setDeleteId(null); fetchLoans(); }
    catch (err) { alert(err.message); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Wallet size={24} /></div> Loan Management
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Track employee loans and repayments</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all">
            <Plus size={18} /> Add New Loan
          </button>
        </div>

        <div className="relative w-full max-w-sm ml-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input placeholder="Search by employee..." value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none" />
        </div>

        {loading ? <div className="bg-white rounded-[2rem] p-20 text-center text-slate-400">Loading...</div> : (
          <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                  <th className="px-6 py-5">Employee</th><th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5 text-center">Period</th><th className="px-6 py-5">Approved</th>
                  <th className="px-6 py-5 text-center">Status</th><th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedLoans.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No loans found</td></tr>
                ) : paginatedLoans.map((loan) => (
                  <tr key={loan._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-5"><div className="font-bold text-slate-700">{loan.employee}</div><div className="text-[10px] text-slate-400">By: {loan.permittedBy}</div></td>
                    <td className="px-6 py-5"><div className="text-sm font-black text-slate-800">₹{loan.amount}</div><div className="text-[10px] text-emerald-600 font-bold">Int: {loan.interest}%</div></td>
                    <td className="px-6 py-5 text-center"><span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">{loan.period} Months</span></td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500 flex items-center gap-2"><Calendar size={14} />{loan.approvedDate?.slice(0,10)}</td>
                    <td className="px-6 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${loan.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{loan.status}</span></td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setForm(loan); setEditId(loan._id); setShowForm(true); }} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 shadow-sm"><Pencil size={16} /></button>
                        <button onClick={() => setDeleteId(loan._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border rounded-xl disabled:opacity-30"><ChevronLeft size={20} /></button>
          {Array.from({ length: totalPages }, (_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-sm ${page === i + 1 ? "bg-[#0a4d44] text-white" : "bg-white text-slate-400 border"}`}>{i + 1}</button>)}
          <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border rounded-xl disabled:opacity-30"><ChevronRight size={20} /></button>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b flex justify-between items-center"><h2 className="font-black text-slate-800">{editId ? "Edit Loan" : "New Loan"}</h2><button onClick={() => setShowForm(false)}><X size={24} className="text-slate-400" /></button></div>
              <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                {[["employee","Employee Name"],["permittedBy","Permitted By"],["amount","Amount"],["interest","Interest %"],["period","Period (Months)"],["repaymentAmount","Repayment Amount"],["approvedDate","Approved Date"],["repaymentFrom","Repayment From"]].map(([key, label]) => (
                  <div key={key}><label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label}</label>
                    <input type={key.includes("Date") ? "date" : "text"} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none" /></div>
                ))}
              </div>
              <div className="p-8 border-t flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button><button onClick={handleSave} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold">Save Loan</button></div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h2>
              <p className="text-slate-500 text-sm mb-8">This loan record will be permanently deleted.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteId(null)} className="py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">Cancel</button>
                <button onClick={handleDelete} className="py-4 rounded-2xl font-bold bg-red-500 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Loan;
