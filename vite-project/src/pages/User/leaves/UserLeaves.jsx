import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { leaveAPI } from "../../../utils/api";

const UserLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee: "", type: "Annual Leave", startDate: "", endDate: "", days: "", reason: "" });

  useEffect(() => {
    (async () => {
      try { const res = await leaveAPI.getAll(); setLeaves(res.data); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  const handleSubmit = async () => {
    try { await leaveAPI.create({ ...form, status: "Pending" }); setShowForm(false); const res = await leaveAPI.getAll(); setLeaves(res.data); }
    catch (err) { alert(err.message); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-slate-800">My Leave Requests</h1>
          <button onClick={() => setShowForm(true)} className="bg-[#0a4d44] text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2"><Plus size={18} /> Apply Leave</button>
        </div>

        {loading ? <div className="bg-white rounded-3xl p-20 text-center text-slate-400">Loading...</div> : (
          <div className="space-y-4">
            {leaves.length === 0 ? <div className="bg-white rounded-3xl p-20 text-center text-slate-400">No leave applications</div>
            : leaves.map((l) => (
              <div key={l._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div><h3 className="font-bold text-slate-800">{l.type}</h3><p className="text-sm text-slate-500 mt-1">{l.startDate?.slice(0,10)} → {l.endDate?.slice(0,10)} ({l.days} days)</p><p className="text-sm text-slate-400 mt-1 italic">"{l.reason}"</p></div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${l.status==="Approved"?"bg-emerald-100 text-emerald-600":l.status==="Rejected"?"bg-red-100 text-red-600":"bg-orange-100 text-orange-600"}`}>{l.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b flex justify-between"><h2 className="font-black text-slate-800">Apply for Leave</h2><button onClick={() => setShowForm(false)}><X size={24} className="text-slate-400" /></button></div>
              <div className="p-8 space-y-4">
                <div><label className="text-[10px] font-black uppercase text-slate-400">Your Name</label><input value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400">Leave Type</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none">
                    <option>Annual Leave</option><option>Medical Leave</option><option>Emergency Leave</option><option>Unpaid Leave</option>
                  </select></div>
                {[["startDate","Start Date"],["endDate","End Date"],["days","No. of Days"],["reason","Reason"]].map(([key,label]) => (
                  <div key={key}><label className="text-[10px] font-black uppercase text-slate-400">{label}</label><input type={key.includes("Date")?"date":"text"} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm outline-none" /></div>
                ))}
              </div>
              <div className="p-8 border-t flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button><button onClick={handleSubmit} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold">Submit</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserLeaves;
