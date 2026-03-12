import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Plus, X, Loader2 } from "lucide-react";
import { leaveAPI } from "../../../services/api";

const UserLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await leaveAPI.getAll();
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return alert("Please select dates");
    setSubmitting(true);
    try {
      const res = await leaveAPI.create(form);
      setLeaves([res.data, ...leaves]);
      setForm({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
      setShowForm(false);
      setMsg("Leave applied successfully! Admin will review it soon. ✅");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const statusCount = (s) => leaves.filter(l => l.status === s).length;

  return (
    <div className="bg-[#f8fafa] p-4 md:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#0f2e2e]">My Leave History</h1>
            <p className="text-gray-400 text-sm">Track all your leave applications</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
            <Plus size={16} /> Apply Leave
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending", count: statusCount("Pending"), color: "text-orange-500 bg-orange-50" },
            { label: "Approved", count: statusCount("Approved"), color: "text-emerald-600 bg-emerald-50" },
            { label: "Rejected", count: statusCount("Rejected"), color: "text-red-500 bg-red-50" },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-black">{s.count}</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {msg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">{msg}</div>}

        {/* Leave List */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
        ) : leaves.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm">
            <Clock size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No leave applications yet</p>
            <p className="text-sm">Click "Apply Leave" to submit your first request</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl ${l.status === "Approved" ? "bg-emerald-100" : l.status === "Rejected" ? "bg-red-100" : "bg-orange-100"}`}>
                    {l.status === "Approved" ? <CheckCircle size={20} className="text-emerald-600" /> :
                      l.status === "Rejected" ? <XCircle size={20} className="text-red-500" /> :
                        <Clock size={20} className="text-orange-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-[#0f2e2e] text-sm">{l.type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}
                      {l.days && <span className="ml-2 text-gray-500">({l.days} days)</span>}
                    </p>
                    {l.reason && <p className="text-xs text-gray-500 mt-1">"{l.reason}"</p>}
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${l.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                    l.status === "Rejected" ? "bg-red-100 text-red-600" :
                      "bg-orange-100 text-orange-600"}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-lg text-[#0f2e2e]">Leave Application</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Leave Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300">
                  <option>Casual Leave</option>
                  <option>Annual Leave</option>
                  <option>Medical Leave</option>
                  <option>Unpaid Leave</option>
                  <option>Maternity Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">From</label>
                  <input type="date" required value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">To</label>
                  <input type="date" required value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason for leave..." rows={3} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-emerald-300 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-[#0f2e2e] text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLeaves;