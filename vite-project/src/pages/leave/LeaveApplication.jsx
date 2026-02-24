import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { leaveAPI } from "../../utils/api";

const LeaveApplication = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const emptyForm = { employee: "", type: "", applyDate: "", startDate: "", endDate: "", days: "", reason: "", status: "Pending" };
  const [form, setForm] = useState(emptyForm);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = search ? `search=${search}` : "";
      const res = await leaveAPI.getAll(params);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaves(); }, [search]);

  const filtered = data.filter(item => item.employee.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async () => {
    try {
      if (editId) { await leaveAPI.update(editId, form); }
      else { await leaveAPI.create(form); }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      fetchLeaves();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (item) => { setForm(item); setEditId(item._id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this leave application?")) return;
    try { await leaveAPI.remove(id); fetchLeaves(); }
    catch (err) { alert(err.message); }
  };

  const handleApprove = async (id, status) => {
    try { await leaveAPI.update(id, { status }); fetchLeaves(); }
    catch (err) { alert(err.message); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Clock size={24} /></div>
              Leave Requests
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage and track employee absences</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg font-bold">
            <Plus size={18} /> Apply Leave
          </button>
        </div>

        <div className="relative w-full max-w-sm ml-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input placeholder="Search employee..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-indigo-50" />
        </div>

        {loading ? <div className="bg-white rounded-[2rem] p-20 text-center text-slate-400">Loading...</div> : (
          <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                  <th className="px-6 py-5">Employee</th><th className="px-6 py-5">Leave Type</th>
                  <th className="px-6 py-5">Duration</th><th className="px-6 py-5 text-center">Days</th>
                  <th className="px-6 py-5">Status</th><th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No leave applications found</td></tr>
                ) : paginatedData.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-5 font-bold text-slate-700">{item.employee}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.type}</td>
                    <td className="px-6 py-5 text-[11px] font-bold text-slate-600">{item.startDate?.slice(0,10)} → {item.endDate?.slice(0,10)}</td>
                    <td className="px-6 py-5 text-center"><span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">{item.days}</span></td>
                    <td className="px-6 py-5">
                      <select value={item.status} onChange={(e) => handleApprove(item._id, e.target.value)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border-0 outline-none cursor-pointer ${item.status === "Approved" ? "bg-emerald-100 text-emerald-600" : item.status === "Rejected" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-100 text-indigo-600 rounded-xl hover:border-indigo-200 shadow-sm"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl disabled:opacity-30"><ChevronLeft size={20} /></button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-sm ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white text-slate-400"}`}>{i + 1}</button>
          ))}
          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl disabled:opacity-30"><ChevronRight size={20} /></button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-black text-slate-800">{editId ? "Edit Application" : "New Leave Application"}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                {[["employee","Employee Name"],["type","Leave Type"],["startDate","Start Date"],["endDate","End Date"],["days","No. of Days"],["reason","Reason"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label}</label>
                    <input type={key.includes("Date") ? "date" : "text"} placeholder={`Enter ${label}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none focus:ring-4 ring-indigo-50" />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none">
                    <option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="p-8 bg-slate-50/50 border-t flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button onClick={handleSubmit} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold shadow-lg">Submit Application</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default LeaveApplication;
