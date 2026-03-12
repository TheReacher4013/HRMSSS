import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, Plus, X, Search, UserCircle, AlertCircle, CheckCircle2, Phone, Hash, User, Mail, Briefcase, Loader2, Star } from 'lucide-react';
import { recruitmentAPI } from '../../services/api';

const NAME_RE = /^[a-zA-Z\s'.,-]{2,80}$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { name: '', phone: '', email: '', position: '', department: '', experience: '', status: 'Applied', interviewNotes: '' };

const STATUS_COLORS = { Applied: 'bg-blue-50 text-blue-700', Shortlisted: 'bg-violet-50 text-violet-700', Interview: 'bg-amber-50 text-amber-700', Selected: 'bg-emerald-50 text-emerald-700', Rejected: 'bg-red-50 text-red-600' };

const validate = (f, touched) => {
    const e = {};
    if (touched.name || f.name) { if (!f.name.trim()) e.name = 'Full name is required.'; else if (!NAME_RE.test(f.name.trim())) e.name = 'Name may only contain letters and basic punctuation.'; }
    if (touched.phone || f.phone) { if (!f.phone.trim()) e.phone = 'Phone is required.'; else if (!PHONE_RE.test(f.phone.trim())) e.phone = 'Enter a valid phone number.'; }
    if (touched.email && f.email.trim()) { if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email.'; }
    if (touched.position || f.position) { if (!f.position.trim()) e.position = 'Position is required.'; }
    return e;
};

const FieldErr = ({ msg }) => msg ? <p className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-1"><AlertCircle size={11} />{msg}</p> : null;
const inputCls = (err, ok) => `w-full bg-slate-50 border rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-300 ${err ? 'border-rose-300 focus:ring-2 focus:ring-rose-400/10' : ok ? 'border-emerald-300 focus:ring-2 focus:ring-emerald-400/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/10'}`;

const CandidateTable = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusF, setStatusF] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const toast = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000); };

    useEffect(() => {
        recruitmentAPI.getAll().then(r => setCandidates(r.data || [])).catch(() => toast('Failed to load candidates.', 'error')).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => candidates.filter(c => {
        const ms = statusF === 'All' || c.status === statusF;
        const mq = `${c.name} ${c.phone || ''} ${c.position || ''} ${c.department || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
        return ms && mq;
    }), [candidates, searchTerm, statusF]);

    const openAdd = () => { setForm(EMPTY); setErrors({}); setTouched({}); setSubmitted(false); setEditId(null); setIsModalOpen(true); };
    const openEdit = (r) => {
        setForm({ name: r.name, phone: r.phone || '', email: r.email || '', position: r.position || '', department: r.department || '', experience: r.experience || '', status: r.status || 'Applied', interviewNotes: r.interviewNotes || '' });
        setErrors({}); setTouched({}); setSubmitted(false); setEditId(r._id); setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setErrors({}); setTouched({}); };

    const handleChange = (field, value) => {
        const next = { ...form, [field]: value }; setForm(next);
        if (touched[field] || submitted) setErrors(validate(next, { ...touched, [field]: true }));
    };
    const handleBlur = (field) => { const t = { ...touched, [field]: true }; setTouched(t); setErrors(validate(form, t)); };

    const handleSave = async (e) => {
        e.preventDefault(); setSubmitted(true);
        const allTouched = Object.fromEntries(Object.keys(EMPTY).map(k => [k, true]));
        setTouched(allTouched);
        const errs = validate(form, allTouched); setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setSaving(true);
        try {
            if (editId) {
                const res = await recruitmentAPI.update(editId, form);
                setCandidates(c => c.map(x => x._id === editId ? res.data : x));
                toast('Candidate updated.');
            } else {
                const res = await recruitmentAPI.create(form);
                setCandidates(c => [res.data, ...c]);
                toast('Candidate added.');
            }
            closeModal();
        } catch (err) { toast(err.message || 'Save failed.', 'error'); }
        finally { setSaving(false); }
    };

    const quickStatus = async (id, status) => {
        try { const res = await recruitmentAPI.update(id, { status }); setCandidates(c => c.map(x => x._id === id ? res.data : x)); }
        catch { toast('Status update failed.', 'error'); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try { await recruitmentAPI.delete(deleteId); setCandidates(c => c.filter(x => x._id !== deleteId)); toast('Candidate deleted.'); }
        catch { toast('Delete failed.', 'error'); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-[#f8fafc]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-xl"><User className="text-blue-600" size={22} /></div>Candidate List</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage recruitment pipeline — track every applicant</p>
                    </div>
                    <button onClick={openAdd} className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95"><Plus size={18} />Add Candidate</button>
                </div>

                {msg.text && (<div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>{msg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}{msg.text}</div>)}

                <div className="flex flex-wrap gap-2 items-center mb-6">
                    {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(s => (
                        <button key={s} onClick={() => setStatusF(s)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition border ${statusF === s ? 'bg-[#0a4d44] text-white border-transparent' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                            {s} ({s === 'All' ? candidates.length : candidates.filter(c => c.status === s).length})
                        </button>
                    ))}
                    <div className="relative ml-auto"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 ring-blue-100 w-48" /></div>
                </div>

                {loading ? (<div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>) : (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead><tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">{['#', 'Name', 'Phone', 'Email', 'Position', 'Dept', 'Experience', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-5">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={9} className="px-6 py-16 text-center text-slate-400">{candidates.length === 0 ? 'No candidates yet.' : 'No results.'}</td></tr>
                                    ) : filtered.map((c, i) => (
                                        <tr key={c._id} className="group hover:bg-slate-50/50 transition">
                                            <td className="px-5 py-4 text-xs font-bold text-slate-300">{i + 1}</td>
                                            <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs">{c.name.charAt(0)}</div><p className="font-bold text-slate-800 text-sm">{c.name}</p></div></td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{c.phone || '—'}</td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{c.email || '—'}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-slate-700">{c.position || '—'}</td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{c.department || '—'}</td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{c.experience ? `${c.experience} yr` : '-'}</td>
                                            <td className="px-5 py-4">
                                                <select value={c.status} onChange={e => quickStatus(c._id, e.target.value)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer ${STATUS_COLORS[c.status] || 'bg-slate-100 text-slate-600'}`}>
                                                    {['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openEdit(c)} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200"><Edit size={13} /></button>
                                                    <button onClick={() => setDeleteId(c._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200"><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="md:hidden divide-y divide-slate-50">
                            {filtered.map(c => (
                                <div key={c._id} className="p-5">
                                    <div className="flex justify-between mb-2"><div><p className="font-bold text-slate-800">{c.name}</p><p className="text-xs text-slate-500">{c.position} {c.department ? `• ${c.department}` : ''}</p></div><span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg h-fit ${STATUS_COLORS[c.status]}`}>{c.status}</span></div>
                                    <p className="text-xs text-slate-400 mb-3">{c.phone} {c.email ? `• ${c.email}` : ''}</p>
                                    <div className="flex gap-2"><button onClick={() => openEdit(c)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-xs">Edit</button><button onClick={() => setDeleteId(c._id)} className="flex-1 bg-red-50 text-red-500 font-bold py-2 rounded-xl text-xs">Delete</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="text-lg font-black text-slate-800">{editId ? 'Edit Candidate' : 'New Candidate'}</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Full Name *</label><input value={form.name} onChange={e => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} className={inputCls(errors.name, !errors.name && touched.name && form.name)} placeholder="Full name" /><FieldErr msg={errors.name} /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Phone *</label><input value={form.phone} onChange={e => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} className={inputCls(errors.phone, !errors.phone && touched.phone && form.phone)} placeholder="+91 98765 43210" /><FieldErr msg={errors.phone} /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Email</label><input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} className={inputCls(errors.email, !errors.email && touched.email && form.email)} placeholder="name@example.com" /><FieldErr msg={errors.email} /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Position *</label><input value={form.position} onChange={e => handleChange('position', e.target.value)} onBlur={() => handleBlur('position')} className={inputCls(errors.position, !errors.position && touched.position && form.position)} placeholder="e.g. Software Engineer" /><FieldErr msg={errors.position} /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Department</label><input value={form.department} onChange={e => handleChange('department', e.target.value)} className={inputCls(false, false)} placeholder="e.g. Engineering" /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Experience (yrs)</label><input type="number" min="0" max="50" step="0.5" value={form.experience} onChange={e => handleChange('experience', e.target.value)} className={inputCls(false, false)} placeholder="0" /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label><select value={form.status} onChange={e => handleChange('status', e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm outline-none">{['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(s => <option key={s}>{s}</option>)}</select></div>
                                <div className="col-span-2"><label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Interview Notes</label><textarea value={form.interviewNotes} onChange={e => handleChange('interviewNotes', e.target.value)} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 ring-emerald-100" placeholder="Optional notes…" /></div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">{saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? 'Update Candidate' : 'Add Candidate'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Candidate?</h2>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={confirmDelete} disabled={deleting} className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">{deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : 'Confirm Delete'}</button>
                            <button onClick={() => setDeleteId(null)} className="w-full py-3.5 rounded-2xl font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateTable;