import React, { useState } from 'react';
import { Edit, Trash2, Plus, X, Search, UserCircle } from 'lucide-react';

const CandidateTable = () => {
    const [candidates, setCandidates] = useState([
        { id: 1, name: "John Doe", candidateId: "8094935283", phone: "1234567890" },
        { id: 2, name: "Anastasia Whitney", candidateId: "2121895214", phone: "2811551672" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", candidateId: "", phone: "" });

    const handleSave = (e) => {
        e.preventDefault();
        if (formData.id) {
            setCandidates(candidates.map(c => (c.id === formData.id ? formData : c)));
        } else {
            setCandidates([...candidates, { ...formData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Candidate Directory</h2>
                    <p className="text-slate-500 font-medium">Manage and track your applicant pool</p>
                </div>

                <button
                    onClick={() => {
                        setFormData({ id: null, name: "", candidateId: "", phone: "" });
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                    <Plus size={20} className="mr-2" />
                    Add Candidate
                </button>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by name..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80">
                            <tr>
                                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sl</th>
                                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">System ID</th>
                                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                                <th className="p-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-5 text-slate-400 font-medium">{index + 1}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                                {item.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 font-mono text-sm text-slate-500">{item.candidateId}</td>
                                    <td className="p-5 text-slate-600 font-medium">{item.phone}</td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setFormData(item); setIsModalOpen(true); }} className="p-2.5 bg-white border border-slate-200 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => setCandidates(candidates.filter(c => c.id !== item.id))} className="p-2.5 bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Grid */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                    {filtered.map((item, index) => (
                        <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative">
                            <span className="absolute top-4 right-4 text-[10px] font-black text-slate-300">#{index + 1}</span>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800">{item.name}</h4>
                                    <p className="text-xs font-mono text-slate-400">{item.candidateId}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase">Phone</span>
                                <span className="text-sm font-bold text-slate-700">{item.phone}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setFormData(item); setIsModalOpen(true); }} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm shadow-sm">Edit</button>
                                <button onClick={() => setCandidates(candidates.filter(c => c.id !== item.id))} className="flex-1 py-3 bg-rose-50 rounded-xl font-bold text-rose-600 text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">
                                {formData.id ? "Update Profile" : "New Candidate"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-emerald-50 outline-none font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System ID</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-emerald-50 outline-none font-mono text-sm"
                                        value={formData.candidateId}
                                        onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-emerald-50 outline-none font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] mt-4">
                                Save Candidate
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CandidateTable;