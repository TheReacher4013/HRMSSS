import { useState } from "react";
import { Edit, Trash2, Plus, X, Save } from "lucide-react";

export default function DataTable({ title, addLabel, columns, data }) {
    const [rows, setRows] = useState(data || []);
    const [modal, setModal] = useState(null); 

    const openAdd = () => {
        const empty = {};
        columns.forEach(c => empty[c.key] = "");
        setModal({ mode: "add", form: empty });
    };

    const openEdit = (index) => {
        setModal({ mode: "edit", index, form: { ...rows[index] } });
    };

    const handleSave = () => {
        if (!modal) return;
        const copy = [...rows];
        if (modal.mode === "add") {
            copy.push(modal.form);
        } else {
            copy[modal.index] = modal.form;
        }
        setRows(copy);
        setModal(null);
    };

  
    const handleDelete = (index) => {
        if (window.confirm("Delete this record?")) {
            const copy = [...rows];
            copy.splice(index, 1);
            setRows(copy);
        }
    };

    const updateForm = (key, value) =>
        setModal(prev => ({ ...prev, form: { ...prev.form, [key]: value } }));

    return (
        <div className="p-4 md:p-10 bg-[#f1f5f4] min-h-screen text-slate-800 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0a4d44] tracking-tight mb-1">{title}</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Overview & Management
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="bg-[#0a4d44] hover:bg-[#063b34] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm shadow-md"
                    >
                        <Plus size={16} /> {addLabel}
                    </button>
                </div>

                {/* Table — Desktop */}
                <div className="bg-[#fcfdfd] rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="hidden md:block">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                    {columns.map(col => (
                                        <th key={col.key} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 2} className="text-center py-12 text-slate-400 text-sm">
                                            No records found. Click "{addLabel}" to add one.
                                        </td>
                                    </tr>
                                ) : rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#f8faf9] transition-colors">
                                        <td className="px-6 py-4 text-slate-400 font-medium text-xs">{i + 1}</td>
                                        {columns.map(col => (
                                            <td key={col.key} className="px-6 py-4">
                                                <span className="font-semibold text-slate-600 text-sm">{row[col.key] || "—"}</span>
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => openEdit(i)} className="text-slate-400 hover:text-[#0a4d44] transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(i)} className="text-slate-400 hover:text-rose-400 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards — Mobile */}
                    <div className="md:hidden p-4 space-y-4">
                        {rows.map((row, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                <div className="space-y-3">
                                    {columns.map(col => (
                                        <div key={col.key} className="flex justify-between items-center border-b border-slate-50 pb-2">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{col.label}</p>
                                            <p className="text-slate-600 font-bold text-xs">{row[col.key] || "—"}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button onClick={() => openEdit(i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-[#0a4d44] bg-emerald-50 py-2 rounded-lg">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 py-2 rounded-lg">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CENTERED POPUP MODAL ── */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="font-black text-[#0a4d44] text-base">
                                {modal.mode === "add" ? `Add ${title}` : `Edit ${title}`}
                            </h3>
                            <button onClick={() => setModal(null)} className="p-1.5 hover:bg-slate-100 rounded-xl transition">
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-4">
                            {columns.map(col => (
                                <div key={col.key}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                                        {col.label}
                                    </label>
                                    <input
                                        type={col.type || "text"}
                                        placeholder={`Enter ${col.label.toLowerCase()}...`}
                                        value={modal.form[col.key] || ""}
                                        onChange={e => updateForm(col.key, e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a4d44]/30 focus:border-[#0a4d44] transition"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setModal(null)}
                                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-[#0a4d44] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#063b34] transition flex items-center justify-center gap-2"
                            >
                                <Save size={15} />
                                {modal.mode === "add" ? "Add" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}