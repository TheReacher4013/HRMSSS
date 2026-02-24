import { useState, useEffect } from "react";
import { Pencil, Trash2, Building2, Plus, AlertCircle, X } from "lucide-react";
import { departmentAPI } from "../../utils/api";

export default function Department() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [status, setStatus] = useState("Active");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PER = 5;

  const load = async () => {
    setLoading(true);
    try { const r = await departmentAPI.getAll(); setList(r.data); } catch(e){console.error(e);}
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const totalPages = Math.ceil(list.length / PER);
  const pageData = list.slice((page-1)*PER, page*PER);

  const save = async () => {
    if (!deptName.trim()) return;
    setSaving(true);
    try {
      current ? await departmentAPI.update(current._id,{name:deptName,status})
              : await departmentAPI.create({name:deptName,status});
      setModalOpen(false); load();
    } catch(e){alert(e.message);}
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await departmentAPI.remove(current._id); setDeleteOpen(false); load(); }
    catch(e){alert(e.message);}
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Building2 className="text-emerald-600" size={28}/> Department Management</h1>
            <p className="text-slate-500 text-sm">Organize your company structure</p>
          </div>
          <button onClick={()=>{setCurrent(null);setDeptName("");setStatus("Active");setModalOpen(true);}} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg active:scale-95 transition-all">
            <Plus size={20}/> Add Department
          </button>
        </div>

        {loading ? <div className="bg-white rounded-[2rem] p-20 text-center text-slate-400">Loading...</div> : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {["Sl","Department Name","Status","Action"].map(h=><th key={h} className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {pageData.length===0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No departments found</td></tr>
                : pageData.map((d,i)=>(
                  <tr key={d._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-5 text-sm font-bold text-slate-400">{String((page-1)*PER+i+1).padStart(2,"0")}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700">{d.name}</td>
                    <td className="px-6 py-5"><span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg ${d.status==="Active"?"bg-emerald-50 text-emerald-600":"bg-slate-100 text-slate-500"}`}>{d.status}</span></td>
                    <td className="px-6 py-5"><div className="flex gap-2">
                      <button onClick={()=>{setCurrent(d);setDeptName(d.name);setStatus(d.status);setModalOpen(true);}} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 transition-all"><Pencil size={16}/></button>
                      <button onClick={()=>{setCurrent(d);setDeleteOpen(true);}} className="p-2.5 bg-white border border-slate-100 text-red-600 rounded-xl hover:border-red-200 transition-all"><Trash2 size={16}/></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages>1 && <div className="flex justify-center gap-2 mt-8">
          {Array.from({length:totalPages},(_,i)=><button key={i} onClick={()=>setPage(i+1)} className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${page===i+1?"bg-[#0a4d44] text-white":"bg-white text-slate-400 border border-slate-100"}`}>{i+1}</button>)}
        </div>}

        {modalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={()=>setModalOpen(false)}/>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">{current?"Edit":"New"} Department</h3>
                <button onClick={()=>setModalOpen(false)}><X size={20} className="text-slate-400"/></button>
              </div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Department Name *</label>
              <input className="w-full mt-1 mb-5 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 ring-emerald-50" placeholder="e.g. HR Team" value={deptName} onChange={e=>setDeptName(e.target.value)}/>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Active","Inactive"].map(s=><button key={s} onClick={()=>setStatus(s)} className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all ${status===s?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-slate-100 text-slate-400"}`}>{s}</button>)}
              </div>
              <button onClick={save} disabled={saving} className="w-full bg-[#0a4d44] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60">
                {saving?"Saving...":"Confirm & Save"}
              </button>
            </div>
          </div>
        )}

        {deleteOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={()=>setDeleteOpen(false)}/>
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40}/></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h2>
              <p className="text-slate-500 text-sm mb-8">This department will be permanently deleted.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setDeleteOpen(false)} className="py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">Cancel</button>
                <button onClick={confirmDelete} className="py-4 rounded-2xl font-bold bg-red-500 text-white active:scale-95">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
