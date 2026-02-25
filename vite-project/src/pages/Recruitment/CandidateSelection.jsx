import React, { useState } from 'react';
import { Plus, FileText, Download, Edit, Trash2, X, Search, CheckCircle, Briefcase } from 'lucide-react';

const CandidateSelection = () => {
    const [selections, setSelections] = useState([
        { id: 1, name: "Anastasia Whitney", candidateId: "2121895214", employeeId: "EMP-901", position: "DevOps", terms: "Full Time" },
        { id: 2, name: "Md Naim", candidateId: "5078176922", employeeId: "EMP-442", position: "Manager", terms: "Contract" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({ id: null, name: "", candidateId: "", employeeId: "", position: "", terms: "Full Time" });

    const handleOpenModal = (item = null) => {
        if (item) setFormData(item);
        else setFormData({ id: null, name: "", candidateId: "", employeeId: "", position: "", terms: "Full Time" });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (formData.id) {
            setSelections(selections.map(s => s.id === formData.id ? formData : s));
        } else {
            setSelections([...selections, { ...formData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Confirm deletion of this record?")) {
            setSelections(selections.filter(s => s.id !== id));
        }
    };

    const filteredData = selections.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <Briefcase size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Hiring Board</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Selection Workflow</p>
                        </div>
                    </div>
                    <button onClick={() => handleOpenModal()} className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                        <Plus size={20} /> New Selection
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-[1.5rem] p-4 border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                            <FileText size={14} /> CSV
                        </button>
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                            <Download size={14} /> Excel
                        </button>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find by name or EMP ID..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-black text-slate-800 text-lg leading-tight">{item.name}</div>
                                        <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase">CID: {item.candidateId}</div>
                                    </td>
                                    <td className="p-6 font-mono text-indigo-600 font-bold">{item.employeeId}</td>
                                    <td className="p-6 text-slate-600 font-medium">{item.position}</td>
                                    <td className="p-6 text-center">
                                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                                            {item.terms}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-slate-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {filteredData.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-slate-800 text-xl">{item.name}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.position}</span>
                                </div>
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">{item.employeeId}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Candidate ID</p>
                                    <p className="font-mono text-sm font-bold">{item.candidateId}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Hiring Terms</p>
                                    <p className="font-bold text-sm text-emerald-600 italic">{item.terms}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(item)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-sm">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-sm">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-slate-800 text-xl flex items-center gap-3">
                                <CheckCircle size={24} className="text-emerald-500" />
                                {formData.id ? "Edit Record" : "Hiring Selection"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Candidate Name</label>
                                <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Employee ID</label>
                                <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-mono" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">System Candidate ID</label>
                                <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-mono" value={formData.candidateId} onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Designation</label>
                                <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Employment Terms</label>
                                <select className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold" value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })}>
                                    <option>Full Time</option>
                                    <option>Contract</option>
                                    <option>Probation</option>
                                    <option>Remote</option>
                                </select>
                            </div>
                            <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
                                Confirm Selection
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CandidateSelection;