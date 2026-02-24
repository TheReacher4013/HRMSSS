import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, FileText, User, CreditCard } from "lucide-react";
import { payrollAPI } from "../../utils/api";

export function ManageEmployeeSalary() {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const res = await payrollAPI.getSalaries(); setSalaries(res.data); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => salaries.filter(r => (r.name || r.employee?.name || "").toLowerCase().includes(search.toLowerCase())), [salaries, search]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="bg-[#f1f5f4] min-h-screen p-4 md:p-8 text-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-200">
          <button onClick={() => navigate("/payroll/salary-advance")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white">Salary Advance</button>
          <button onClick={() => navigate("/payroll/salary-generate")} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white">Salary Generate</button>
          <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0a4d44] text-white shadow-lg">Manage Employee Salary</button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div><h1 className="text-2xl font-black text-slate-800">Employee Payroll</h1><p className="text-sm text-slate-500">Manage and download monthly salary slips</p></div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Search employee..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-[1.25rem] shadow-sm outline-none focus:border-emerald-500" />
          </div>
        </div>

        {loading ? <div className="bg-white rounded-3xl p-20 text-center text-slate-400">Loading salaries...</div> : (
          <div className="grid grid-cols-1 gap-4">
            {pageData.length > 0 ? pageData.map((r) => (
              <div key={r._id} className="bg-white rounded-3xl p-2 pr-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow group">
                <div className="h-24 w-24 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-[#0a4d44] group-hover:bg-emerald-50 transition-colors shrink-0 m-2"><User size={32} /></div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-slate-800">{r.name || r.employee?.name}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><FileText size={12} />{r.month}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${r.status === "Paid" ? "text-emerald-600" : "text-orange-500"}`}><CreditCard size={12} />{r.status}</span>
                  </div>
                </div>
                <div className="text-center md:text-right px-6 border-x border-slate-50 hidden lg:block">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">Total Net Salary</p>
                  <p className="text-2xl font-black text-slate-800">₹ {r.totalSalary?.toLocaleString()}</p>
                </div>
                <div className="flex gap-3 mb-4 md:mb-0">
                  <button className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all">View Slip</button>
                  <button className="bg-[#0a4d44] hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 active:scale-95"><Download size={16} />Download</button>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100"><p className="text-slate-400">No salary records found</p></div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1} className="text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30">Previous</button>
            {Array.from({length: totalPages}, (_,i) => <button key={i} onClick={() => setPage(i+1)} className={`w-10 h-10 rounded-[12px] font-black text-xs ${page===i+1 ? "bg-[#0a4d44] text-white" : "bg-white text-slate-400"}`}>{i+1}</button>)}
            <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages} className="text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </section>
  );
}
