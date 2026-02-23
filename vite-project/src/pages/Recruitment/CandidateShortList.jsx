// import React, { useState } from 'react';
// import { Edit, Trash2, Plus, X, Calendar, Star } from 'lucide-react';

// const ShortlistTable = () => {
//     const [data, setData] = useState([
//         { id: 1, name: "Md Naim", candidateId: "8094935283", position: "Software Engineer", sDate: "2026-02-10" },
//     ]);

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ id: null, name: "", position: "", candidateId: "" });

//     const handleEdit = (item) => {
//         setFormData(item);
//         setIsModalOpen(true);
//     };

//     const handleDelete = (id) => {
//         if (window.confirm("Remove candidate from shortlist?")) {
//             setData(data.filter(item => item.id !== id));
//         }
//     };

//     const handleSave = (e) => {
//         e.preventDefault();
//         if (formData.id) {
//             setData(data.map(d => d.id === formData.id ? formData : d));
//         } else {
//             setData([
//                 ...data,
//                 { ...formData, id: Date.now(), sDate: new Date().toISOString().split('T')[0] }
//             ]);
//         }
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
//             <div className="max-w-4xl mx-auto">
//                 <div className="flex justify-between items-end mb-8">
//                     <div>
//                         <div className="flex items-center gap-2 mb-2">
//                             <Star className="text-amber-500 fill-amber-500" size={18} />
//                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Pipeline</span>
//                         </div>
//                         <h2 className="text-4xl font-black text-slate-900 tracking-tight">Shortlist</h2>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setFormData({ id: null, name: "", position: "", candidateId: "" });
//                             setIsModalOpen(true);
//                         }}
//                         className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95"
//                     >
//                         <Plus size={20} /> Add to List
//                     </button>
//                 </div>

//                 <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
//                     <div className="hidden md:block">
//                         <table className="w-full text-left">
//                             <thead className="bg-slate-50 border-b border-slate-100">
//                                 <tr>
//                                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
//                                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Position</th>
//                                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Added</th>
//                                     <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-50">
//                                 {data.map((row) => (
//                                     <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
//                                         <td className="p-6 font-bold text-slate-800 text-base">{row.name}</td>
//                                         <td className="p-6"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">{row.position}</span></td>
//                                         <td className="p-6 text-slate-400 text-sm italic">{row.sDate}</td>
//                                         <td className="p-6">
//                                             <div className="flex justify-center gap-2">
//                                                 <button onClick={() => handleEdit(row)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-transparent hover:border-emerald-100"><Edit size={16} /></button>
//                                                 <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100"><Trash2 size={16} /></button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Mobile Grid */}
//                     <div className="md:hidden p-4 space-y-4">
//                         {data.map((row) => (
//                             <div key={row.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
//                                 <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
//                                 <h4 className="font-black text-slate-800 text-lg mb-1">{row.name}</h4>
//                                 <p className="text-indigo-600 font-bold text-xs uppercase mb-4">{row.position}</p>
//                                 <div className="flex items-center gap-2 text-slate-400 text-xs mb-5">
//                                     <Calendar size={14} /> Added on {row.sDate}
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button onClick={() => handleEdit(row)} className="flex-1 py-3 bg-white rounded-xl border border-slate-200 font-bold text-sm">Edit</button>
//                                     <button onClick={() => handleDelete(row.id)} className="flex-1 py-3 bg-rose-100 text-rose-600 rounded-xl font-bold text-sm">Remove</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Simple Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                     <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-xl font-black text-slate-800 tracking-tight">
//                                 {formData.id ? "Edit Entry" : "New Shortlist Entry"}
//                             </h3>
//                             <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
//                         </div>
//                         <form onSubmit={handleSave} className="space-y-4">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Candidate Name</label>
//                                 <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500 font-medium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Role Title</label>
//                                 <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500 font-medium" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
//                             </div>
//                             <div className="flex gap-3 pt-4">
//                                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
//                                 <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg">Save Record</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- ADDED THIS LINE ---
// export default ShortlistTable;














import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X, Calendar, Star } from 'lucide-react';
import { hiringService } from '../../api/hiringService';

const ShortlistTable = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ _id: null, name: "", position: "", candidateId: "" });

    // API se data load karne ka function
    const fetchShortlist = async () => {
        try {
            const res = await hiringService.getShortlist();
            setData(res.data);
        } catch (err) {
            console.error("Error fetching shortlist", err);
        }
    };

    useEffect(() => { fetchShortlist(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData._id) {
                await hiringService.updateShortlist(formData._id, formData);
            } else {
                await hiringService.addToShortlist(formData);
            }
            setIsModalOpen(false);
            fetchShortlist(); // Table refresh
        } catch (err) {
            alert("Saving failed!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove candidate from shortlist?")) {
            try {
                await hiringService.removeFromShortlist(id);
                fetchShortlist();
            } catch (err) {
                alert("Delete failed!");
            }
        }
    };

    return (
        <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="text-amber-500 fill-amber-500" size={18} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Pipeline</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Shortlist</h2>
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ _id: null, name: "", position: "", candidateId: "" });
                            setIsModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} /> Add to List
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                    <div className="hidden md:block">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Position</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Added</th>
                                    <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.map((row) => (
                                    <tr key={row._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-6 font-bold text-slate-800 text-base">{row.name}</td>
                                        <td className="p-6"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">{row.position}</span></td>
                                        <td className="p-6 text-slate-400 text-sm italic">{row.sDate}</td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => { setFormData(row); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-emerald-600"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(row._id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 mb-6">{formData._id ? "Edit Entry" : "New Shortlist Entry"}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <input type="text" placeholder="Candidate Name" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="text" placeholder="Role Title" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-black text-slate-500">Cancel</button>
                                <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ShortlistTable;