import { useState } from "react";
import { Edit, Trash2, Save, Plus, Search } from "lucide-react";

export default function DataTable({ title, addLabel, columns, data }) {
    const [rows, setRows] = useState(data || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState({});

    const handleDelete = (index) => {
        if (window.confirm("Delete this record?")) {
            const copy = [...rows];
            copy.splice(index, 1);
            setRows(copy);
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setForm(rows[index]);
    };

    const handleSave = () => {
        const copy = [...rows];
        copy[editingIndex] = form;
        setRows(copy);
        setEditingIndex(null);
        setForm({});
    };

    const handleAdd = () => {
        const empty = {};
        columns.forEach(c => empty[c.key] = "");
        setRows([...rows, empty]);
        setEditingIndex(rows.length);
        setForm(empty);
    };

    return (
        
        <div className="p-4 md:p-10 bg-[#f1f5f4] min-h-screen text-slate-800 font-sans">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0a4d44] tracking-tight mb-1">
                            {title}
                        </h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Overview & Management
                        </p>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="bg-[#0a4d44] hover:bg-[#063b34] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm shadow-md"
                    >
                        <Plus size={16} /> {addLabel}
                    </button>
                </div>

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
                                {rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#f8faf9] transition-colors">
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
                                                    <button onClick={handleSave} className="text-emerald-600 hover:scale-110 transition-transform">
                                                        <Save size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleEdit(i)} className="text-slate-400 hover:text-[#7ec1e5] transition-all">
                                                        <Edit size={16} />
                                                    </button>
                                                )}
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

                   
                    <div className="md:hidden p-4 space-y-4">
                        {rows.map((row, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
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
                                    <button onClick={() => handleDelete(i)} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 py-2 rounded-lg">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}