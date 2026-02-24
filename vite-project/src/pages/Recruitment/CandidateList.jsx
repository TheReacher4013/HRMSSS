import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Search } from "lucide-react";
import { recruitmentAPI } from "../../utils/api";

const CandidateTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", position: "", experience: "", status: "Applied" });
  const [editId, setEditId] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try { const res = await recruitmentAPI.getCandidates(); setCandidates(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const filtered = candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await recruitmentAPI.updateCandidate(editId, formData); }
      else { await recruitmentAPI.createCandidate(formData); }
      setIsModalOpen(false); fetchCandidates();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="p-3 md:p-6 bg-[#f4f7f6] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Candidate List</h2>
        <button onClick={() => { setFormData({name:"",phone:"",position:"",experience:"",status:"Applied"}); setEditId(null); setIsModalOpen(true); }} className="w-full sm:w-auto bg-[#0a4d44] text-white px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 font-bold">
          <Plus size={18} /> Add New Candidate
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="mb-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input type="text" placeholder="Search name..." className="pl-10 pr-4 py-2 border rounded-xl text-sm w-full outline-none focus:ring-2 ring-green-500/20" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {loading ? <div className="py-20 text-center text-slate-400">Loading...</div> : (
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b text-gray-600 font-semibold uppercase text-[12px]">
                <tr><th className="p-4">Sl</th><th className="p-4">Name</th><th className="p-4">Candidate ID</th><th className="p-4">Phone</th><th className="p-4">Position</th><th className="p-4">Status</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? <tr><td colSpan={7} className="p-4 text-center text-gray-400">No candidates found</td></tr>
                : filtered.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50/50">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-500 font-mono text-xs">{item.candidateId}</td>
                    <td className="p-4 text-gray-500">{item.phone}</td>
                    <td className="p-4 text-gray-500">{item.position}</td>
                    <td className="p-4">
                      <select value={item.status} onChange={async (e) => { await recruitmentAPI.updateCandidate(item._id, {status: e.target.value}); fetchCandidates(); }} className={`px-2 py-1 rounded-full text-[10px] font-black border-0 outline-none cursor-pointer ${item.status==="Selected"?"bg-emerald-100 text-emerald-600":item.status==="Rejected"?"bg-red-100 text-red-600":item.status==="Shortlisted"?"bg-blue-100 text-blue-600":"bg-orange-100 text-orange-600"}`}>
                        <option>Applied</option><option>Shortlisted</option><option>Interview</option><option>Selected</option><option>Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => { setFormData(item); setEditId(item._id); setIsModalOpen(true); }} className="p-2 border rounded-xl text-emerald-600 hover:bg-emerald-50"><Edit size={16} /></button>
                      <button onClick={async () => { if(window.confirm("Delete?")) { await recruitmentAPI.deleteCandidate(item._id); fetchCandidates(); }}} className="p-2 border rounded-xl text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold">{editId ? "Edit Candidate" : "Add Candidate"}</h3><button onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[["name","Full Name"],["phone","Phone"],["position","Position"],["experience","Experience"]].map(([key, label]) => (
                <div key={key}><label className="text-sm font-medium text-gray-600">{label}</label><input value={formData[key]||""} onChange={(e) => setFormData({...formData,[key]:e.target.value})} className="w-full mt-1 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-emerald-400/30" /></div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#0a4d44] text-white rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CandidateTable;
