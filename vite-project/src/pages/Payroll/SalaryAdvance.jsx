import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { payrollAPI } from "../../utils/api";

export default function SalaryAdvance() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ employee: "", amount: "", release: "", month: "", status: "Active" });
  const perPage = 5;

  const fetchAdvances = async () => {
    setLoading(true);
    try { const res = await payrollAPI.getAdvances(); setAllData(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAdvances(); }, []);

  const filtered = useMemo(() => allData.filter(r => r.employee.toLowerCase().includes(search.toLowerCase())), [allData, search]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page-1)*perPage, page*perPage);

  const saveRow = async () => {
    if (!form.employee || !form.amount || !form.month) { alert("Fill required fields"); return; }
    try {
      if (editId) { await payrollAPI.updateAdvance(editId, form); }
      else { await payrollAPI.createAdvance(form); }
      setShowModal(false); fetchAdvances();
    } catch (err) { alert(err.message); }
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try { await payrollAPI.deleteAdvance(id); fetchAdvances(); }
    catch (err) { alert(err.message); }
  };

  return (
    <section className="bg-[#f1f5f4] min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-200">
          <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0a4d44] text-white shadow-lg">Salary Advance</button>
          <button onClick={() => navigate("/payroll/salary-generate")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white">Salary Generate</button>
          <button onClick={() => navigate("/payroll/manage-employee-salary")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white">Manage Salary</button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-slate-800">Salary Advance</h1>
          <div className="flex gap-3">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input placeholder="Search..." value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} className="bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none w-64" /></div>
            <button onClick={() => {setEditId(null); setForm({employee:"",amount:"",release:"",month:"",status:"Active"}); setShowModal(true);}} className="bg-[#0a4d44] text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2"><Plus size={18}/> Add</button>
          </div>
        </div>

        {loading ? <div className="bg-white rounded-3xl p-20 text-center text-slate-400">Loading...</div> : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50 border-b text-[11px] font-black uppercase text-slate-400">
                <th className="px-6 py-4">#</th><th className="px-6 py-4">Employee</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Month</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {pageData.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No advances found</td></tr>
                : pageData.map((r,i) => (
                  <tr key={r._id} className="group hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-400">{(page-1)*perPage+i+1}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{r.employee}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">₹{r.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{r.month}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${r.status==="Active"?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-500"}`}>{r.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>{setForm(r);setEditId(r._id);setShowModal(true);}} className="p-2 bg-white border text-blue-600 rounded-xl"><Pencil size={16}/></button>
                        <button onClick={()=>deleteRow(r._id)} className="p-2 bg-white border text-red-500 rounded-xl"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b flex justify-between"><h2 className="font-black text-slate-800">{editId?"Edit Advance":"New Advance"}</h2><button onClick={()=>setShowModal(false)}><X size={24} className="text-slate-400"/></button></div>
              <div className="p-8 space-y-4">
                {[["employee","Employee Name*"],["amount","Amount*"],["release","Release Amount"],["month","Month (YYYY-MM)*"]].map(([key,label])=>(
                  <div key={key}><label className="text-[10px] font-black uppercase text-slate-400">{label}</label><input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none"/></div>
                ))}
              </div>
              <div className="p-8 border-t flex gap-3"><button onClick={()=>setShowModal(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button><button onClick={saveRow} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold">Save</button></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
