
// import { useState } from "react";
// import { Edit, Trash2, Save, Plus, Search } from "lucide-react";

// export default function DataTable({ title, addLabel, columns, data }) {
//     const [rows, setRows] = useState(data || []);
//     const [editingIndex, setEditingIndex] = useState(null);
//     const [form, setForm] = useState({});

//     const handleDelete = (index) => {
//         if (window.confirm("Delete this record?")) {
//             const copy = [...rows];
//             copy.splice(index, 1);
//             setRows(copy);
//         }
//     };

//     const handleEdit = (index) => {
//         setEditingIndex(index);
//         setForm(rows[index]);
//     };

//     const handleSave = () => {
//         const copy = [...rows];
//         copy[editingIndex] = form;
//         setRows(copy);
//         setEditingIndex(null);
//         setForm({});
//     };

//     const handleAdd = () => {
//         const empty = {};
//         columns.forEach(c => empty[c.key] = "");
//         setRows([...rows, empty]);
//         setEditingIndex(rows.length);
//         setForm(empty);
//     };

//     return (
//         /* BACKGROUND: Ab yeh pure dark nahi hai, ek soft slate-green tone hai */
//         <div className="p-4 md:p-10 bg-[#f1f5f4] min-h-screen text-slate-800 font-sans">
//             <div className="max-w-7xl mx-auto">

//                 {/* ================= HEADER ================= */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                     <div>
//                         <h2 className="text-2xl font-bold text-[#0a4d44] tracking-tight mb-1">
//                             {title}
//                         </h2>
//                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                             Overview & Management
//                         </p>
//                     </div>

//                     <button
//                         onClick={handleAdd}
//                         className="bg-[#0a4d44] hover:bg-[#063b34] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm shadow-md"
//                     >
//                         <Plus size={16} /> {addLabel}
//                     </button>
//                 </div>

//                 {/* TABLE CONTAINER: Off-white/Mint shade to reduce glare */}
//                 <div className="bg-[#fcfdfd] rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

//                     {/* ================= DESKTOP TABLE ================= */}
//                     <div className="hidden md:block">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="border-b border-slate-100 bg-slate-50/50">
//                                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
//                                     {columns.map(col => (
//                                         <th key={col.key} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                                             {col.label}
//                                         </th>
//                                     ))}
//                                     <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-slate-50">
//                                 {rows.map((row, i) => (
//                                     <tr key={i} className="hover:bg-[#f8faf9] transition-colors">
//                                         <td className="px-6 py-4 text-slate-400 font-medium text-xs">{i + 1}</td>

//                                         {columns.map(col => (
//                                             <td key={col.key} className="px-6 py-4">
//                                                 {editingIndex === i ? (
//                                                     <input
//                                                         className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm focus:border-[#0a4d44] outline-none transition-all font-medium"
//                                                         value={form[col.key] || ""}
//                                                         onChange={(e) => setForm({ ...form, [col.key]: e.target.value })}
//                                                     />
//                                                 ) : (
//                                                     <span className="font-semibold text-slate-600 text-sm">{row[col.key]}</span>
//                                                 )}
//                                             </td>
//                                         ))}

//                                         <td className="px-6 py-4 text-center">
//                                             <div className="flex justify-center gap-3">
//                                                 {editingIndex === i ? (
//                                                     <button onClick={handleSave} className="text-emerald-600 hover:scale-110 transition-transform">
//                                                         <Save size={18} />
//                                                     </button>
//                                                 ) : (
//                                                     <button onClick={() => handleEdit(i)} className="text-slate-400 hover:text-[#7ec1e5] transition-all">
//                                                         <Edit size={16} />
//                                                     </button>
//                                                 )}
//                                                 <button onClick={() => handleDelete(i)} className="text-slate-400 hover:text-rose-400 transition-all">
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* ================= MOBILE CARD VIEW ================= */}
//                     <div className="md:hidden p-4 space-y-4">
//                         {rows.map((row, i) => (
//                             <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
//                                 <div className="space-y-3">
//                                     {columns.map(col => (
//                                         <div key={col.key} className="flex justify-between items-center border-b border-slate-50 pb-2">
//                                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{col.label}</p>
//                                             {editingIndex === i ? (
//                                                 <input
//                                                     className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-right text-xs w-1/2"
//                                                     value={form[col.key] || ""}
//                                                     onChange={(e) => setForm({ ...form, [col.key]: e.target.value })}
//                                                 />
//                                             ) : (
//                                                 <p className="text-slate-600 font-bold text-xs">{row[col.key] || "—"}</p>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="flex gap-4 mt-4">
//                                     <button onClick={editingIndex === i ? handleSave : () => handleEdit(i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-[#0a4d44] bg-emerald-50 py-2 rounded-lg">
//                                         {editingIndex === i ? "Save" : "Edit"}
//                                     </button>
//                                     <button onClick={() => handleDelete(i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 py-2 rounded-lg">
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }







import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Save, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"

export default function DataTable({ title, addLabel, columns, apiEndpoint }) {
    const { token } = useAuth();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState({});

    // --- 1. GET: Fetch Data on Load ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(apiEndpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRows(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        if (apiEndpoint) fetchData();
    }, [apiEndpoint, token]);

    // --- 2. DELETE: Remove from DB ---
    const handleDelete = async (id, index) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;

        try {
            await axios.delete(`${apiEndpoint}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const copy = [...rows];
            copy.splice(index, 1);
            setRows(copy);
        } catch (err) {
            alert("Delete failed. Please try again.");
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setForm(rows[index]);
    };

    // --- 3. SAVE (Create or Update): Sync with DB ---
    const handleSave = async () => {
        setLoading(true);
        try {
            const isNew = !form._id;
            let response;

            if (isNew) {
                // POST request for new record
                response = await axios.post(apiEndpoint, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRows([...rows, response.data]);
            } else {
                // PUT request for updating existing record
                response = await axios.put(`${apiEndpoint}/${form._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const copy = [...rows];
                copy[editingIndex] = response.data;
                setRows(copy);
            }

            setEditingIndex(null);
            setForm({});
        } catch (err) {
            alert("Save failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        const empty = {};
        columns.forEach(c => empty[c.key] = "");
        setEditingIndex("new"); // Special index for new row
        setForm(empty);
        // Temporary push for UI
        setRows([...rows, empty]);
        setEditingIndex(rows.length);
    };

    const cancelEdit = () => {
        if (!form._id) {
            setRows(rows.filter((_, i) => i !== editingIndex));
        }
        setEditingIndex(null);
        setForm({});
    };

    return (
        <div className="p-4 md:p-6 bg-[#f1f5f4] min-h-screen text-slate-800 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0a4d44] tracking-tight mb-1">{title}</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Database Management</p>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={editingIndex !== null}
                        className="bg-[#0a4d44] hover:bg-[#063b34] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm shadow-md"
                    >
                        <Plus size={16} /> {addLabel}
                    </button>
                </div>

                {/* TABLE CONTAINER */}
                <div className="bg-[#fcfdfd] rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {loading && rows.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">Loading data...</div>
                    ) : (
                        <>
                            {/* DESKTOP VIEW */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                            {columns.map(col => (
                                                <th key={col.key} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{col.label}</th>
                                            ))}
                                            <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {rows.map((row, i) => (
                                            <tr key={row._id || i} className="hover:bg-[#f8faf9] transition-colors">
                                                <td className="px-6 py-4 text-slate-400 font-medium text-xs">{i + 1}</td>
                                                {columns.map(col => (
                                                    <td key={col.key} className="px-6 py-4">
                                                        {editingIndex === i ? (
                                                            <input
                                                                className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm focus:border-[#0a4d44] outline-none transition-all font-medium"
                                                                value={form[col.key] || ""}
                                                                onChange={(e) => setForm({ ...form, [col.key]: e.target.value })}
                                                            />
                                                        ) : (
                                                            <span className="font-semibold text-slate-600 text-sm">{row[col.key]}</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-3">
                                                        {editingIndex === i ? (
                                                            <>
                                                                <button onClick={handleSave} className="text-emerald-600 hover:scale-110"><Save size={18} /></button>
                                                                <button onClick={cancelEdit} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleEdit(i)} className="text-slate-400 hover:text-[#7ec1e5]"><Edit size={16} /></button>
                                                                <button onClick={() => handleDelete(row._id, i)} className="text-slate-400 hover:text-rose-400"><Trash2 size={16} /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE VIEW */}
                            <div className="md:hidden p-4 space-y-4">
                                {rows.map((row, i) => (
                                    <div key={row._id || i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                        <div className="space-y-3">
                                            {columns.map(col => (
                                                <div key={col.key} className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{col.label}</p>
                                                    {editingIndex === i ? (
                                                        <input
                                                            className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-right text-xs w-1/2"
                                                            value={form[col.key] || ""}
                                                            onChange={(e) => setForm({ ...form, [col.key]: e.target.value })}
                                                        />
                                                    ) : (
                                                        <p className="text-slate-600 font-bold text-xs">{row[col.key] || "—"}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 mt-4">
                                            <button onClick={editingIndex === i ? handleSave : () => handleEdit(i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-[#0a4d44] bg-emerald-50 py-2 rounded-lg">
                                                {editingIndex === i ? "Save" : "Edit"}
                                            </button>
                                            <button onClick={editingIndex === i ? cancelEdit : () => handleDelete(row._id, i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 py-2 rounded-lg">
                                                {editingIndex === i ? "Cancel" : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}