import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Plus, X, Star, Loader2, Search, AlertCircle, CheckCircle2, Calendar, Briefcase, User, Mail, Phone, Clock } from "lucide-react";
import { recruitmentAPI } from "../../services/api";

/* ─────────────────── VALIDATION RULES ─────────────────── */
const NAME_REGEX = /^[a-zA-Z\s'.,-]{2,100}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const DEPT_LIST = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations", "Product", "Legal", "Support", "Other"];
const EXP_LIST = ["Fresher", "< 1 year", "1–2 years", "2–4 years", "4–6 years", "6–10 years", "10+ years"];
const TODAY = new Date().toISOString().slice(0, 10);

const EMPTY_FORM = {
    name: "", position: "", email: "", phone: "",
    department: "", experience: "", applyDate: TODAY,
};

const validate = (form) => {
    const errors = {};

    // ── Name ──────────────────────────────────────────────
    if (!form.name.trim()) {
        errors.name = "Candidate name is required.";
    } else if (form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters.";
    } else if (form.name.trim().length > 100) {
        errors.name = "Name must not exceed 100 characters.";
    } else if (!NAME_REGEX.test(form.name.trim())) {
        errors.name = "Name may only contain letters, spaces, and basic punctuation.";
    }

    // ── Target Position ────────────────────────────────────
    if (!form.position.trim()) {
        errors.position = "Target position is required.";
    } else if (form.position.trim().length < 2) {
        errors.position = "Position must be at least 2 characters.";
    } else if (form.position.trim().length > 100) {
        errors.position = "Position must not exceed 100 characters.";
    }

    // ── Date Added ──────────────────────────────────────────
    if (!form.applyDate) {
        errors.applyDate = "Date added is required.";
    } else if (form.applyDate > TODAY) {
        errors.applyDate = "Date added cannot be in the future.";
    } else {
        const d = new Date(form.applyDate);
        if (isNaN(d.getTime())) errors.applyDate = "Please enter a valid date.";
    }

    // ── Email (optional) ───────────────────────────────────
    if (form.email && !EMAIL_REGEX.test(form.email)) {
        errors.email = "Please enter a valid email address.";
    }

    // ── Phone (optional) ───────────────────────────────────
    if (form.phone && !PHONE_REGEX.test(form.phone)) {
        errors.phone = "Phone must be 7–20 digits (may include +, -, spaces, parentheses).";
    }

    return errors;
};

/* ─────────────────── TINY HELPERS ──────────────────────── */
const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const FieldError = ({ msg }) =>
    msg ? (
        <p className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-1 ml-1">
            <AlertCircle size={11} /> {msg}
        </p>
    ) : null;

const inputBase =
    "w-full bg-slate-50 border rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-300";
const inputCls = (err) =>
    `${inputBase} ${err ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10" : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"}`;

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const ShortlistTable = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);    // id being deleted
    const [toast, setToast] = useState(null);    // { type, msg }

    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState(null);        // null = add, id = edit
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /* ── fetch ─────────────────────────────────────────── */
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await recruitmentAPI.getAll("?status=Shortlisted");
            setCandidates(res.data || []);
        } catch (e) {
            showToast("error", "Failed to load shortlist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    /* ── toast helper ──────────────────────────────────── */
    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    /* ── open modal ────────────────────────────────────── */
    const openAdd = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setTouched({});
        setEditId(null);
        setIsOpen(true);
    };

    const openEdit = (row) => {
        setForm({
            name: row.name || "",
            position: row.position || "",
            email: row.email || "",
            phone: row.phone || "",
            department: row.department || "",
            experience: row.experience || "",
            applyDate: row.applyDate ? new Date(row.applyDate).toISOString().slice(0, 10) : TODAY,
        });
        setErrors({});
        setTouched({});
        setEditId(row._id);
        setIsOpen(true);
    };

    const closeModal = () => { setIsOpen(false); setErrors({}); setTouched({}); };

    /* ── live field change — validate touched fields ─── */
    const handleChange = (field, value) => {
        const next = { ...form, [field]: value };
        setForm(next);
        if (touched[field]) {
            const e = validate(next);
            setErrors(prev => ({ ...prev, [field]: e[field] }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const e = validate(form);
        setErrors(prev => ({ ...prev, [field]: e[field] }));
    };

    /* ── save ──────────────────────────────────────────── */
    const handleSave = async (e) => {
        e.preventDefault();
        // mark all fields touched
        const allFields = Object.keys(EMPTY_FORM);
        setTouched(Object.fromEntries(allFields.map(k => [k, true])));

        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                position: form.position.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                department: form.department,
                experience: form.experience,
                applyDate: form.applyDate,
                status: "Shortlisted",
            };

            if (editId) {
                await recruitmentAPI.update(editId, payload);
                showToast("success", "Candidate updated successfully.");
            } else {
                await recruitmentAPI.create(payload);
                showToast("success", "Candidate added to shortlist.");
            }
            closeModal();
            fetchData();
        } catch (err) {
            showToast("error", err?.response?.data?.message || "Save failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    /* ── delete ────────────────────────────────────────── */
    const handleDelete = async (row) => {
        if (!window.confirm(`Remove "${row.name}" from shortlist?`)) return;
        setDeleting(row._id);
        try {
            await recruitmentAPI.delete(row._id);
            showToast("success", `${row.name} removed from shortlist.`);
            fetchData();
        } catch {
            showToast("error", "Failed to remove candidate.");
        } finally {
            setDeleting(null);
        }
    };

    /* ── search filter ─────────────────────────────────── */
    const filtered = useMemo(() =>
        candidates.filter(c =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.position?.toLowerCase().includes(search.toLowerCase()) ||
            c.department?.toLowerCase().includes(search.toLowerCase())
        ), [candidates, search]
    );

    /* ═══════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-3 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10">

                {/* ── Toast ───────────────────────────────────── */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-[60] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm transition-all animate-in slide-in-from-top-2 duration-300
            ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                        {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {toast.msg}
                    </div>
                )}

                {/* ── Page header ─────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Star className="text-amber-400 fill-amber-400" size={15} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Pipeline</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                            Shortlist
                        </h2>
                        {!loading && (
                            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
                                {filtered.length} candidate{filtered.length !== 1 ? "s" : ""} shortlisted
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                        {/* Search */}
                        <div className="relative flex-1 xs:w-52">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                placeholder="Search candidates…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition"
                            />
                        </div>
                        {/* Add button */}
                        <button
                            onClick={openAdd}
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={16} /> Add to Shortlist
                        </button>
                    </div>
                </div>

                {/* ── Content panel ───────────────────────────── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center gap-3 py-20">
                            <Loader2 size={32} className="animate-spin text-emerald-500" />
                            <p className="text-slate-400 font-semibold text-sm">Loading shortlist…</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && filtered.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-20 px-4 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-1">
                                <Star size={24} className="text-slate-300" />
                            </div>
                            <p className="font-black text-slate-700">
                                {search ? "No matches found" : "No candidates shortlisted yet"}
                            </p>
                            <p className="text-slate-400 text-sm max-w-xs">
                                {search ? `No results for "${search}" — try a different name or position.` : "Click \u201cAdd to Shortlist\u201d to begin tracking promising candidates."}
                            </p>
                            {search && (
                                <button onClick={() => setSearch("")} className="text-xs font-black text-emerald-600 underline mt-1">
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── Desktop table ─────────────────────────── */}
                    {!loading && filtered.length > 0 && (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            {[
                                                { label: "Name", w: "w-[28%]" },
                                                { label: "Target Position", w: "w-[22%]" },
                                                { label: "Department", w: "w-[16%]" },
                                                { label: "Date Added", w: "w-[16%]" },
                                                { label: "Actions", w: "w-[18%]", center: true },
                                            ].map(h => (
                                                <th key={h.label}
                                                    className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${h.w} ${h.center ? "text-center" : ""}`}>
                                                    {h.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.map(row => (
                                            <tr key={row._id} className="hover:bg-slate-50/60 transition-colors group">

                                                {/* Name */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0">
                                                            <span className="text-emerald-700 font-black text-sm">
                                                                {row.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 text-sm truncate">{row.name}</p>
                                                            {row.email && (
                                                                <p className="text-[11px] text-slate-400 truncate">{row.email}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Target Position */}
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-100">
                                                        <Briefcase size={11} />
                                                        {row.position}
                                                    </span>
                                                </td>

                                                {/* Department */}
                                                <td className="px-6 py-4">
                                                    {row.department
                                                        ? <span className="text-xs text-slate-500 font-medium">{row.department}</span>
                                                        : <span className="text-xs text-slate-300">—</span>
                                                    }
                                                </td>

                                                {/* Date Added */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Calendar size={13} />
                                                        <span className="text-xs font-medium">{fmtDate(row.applyDate || row.createdAt)}</span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-1.5">
                                                        <button
                                                            onClick={() => openEdit(row)}
                                                            title="Edit candidate"
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100 active:scale-90"
                                                        >
                                                            <Edit size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(row)}
                                                            disabled={deleting === row._id}
                                                            title="Remove from shortlist"
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 active:scale-90 disabled:opacity-40"
                                                        >
                                                            {deleting === row._id
                                                                ? <Loader2 size={15} className="animate-spin" />
                                                                : <Trash2 size={15} />
                                                            }
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Mobile cards ──────────────────────── */}
                            <div className="md:hidden p-3 sm:p-4 space-y-3">
                                {filtered.map(row => (
                                    <div key={row._id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl" />

                                        <div className="flex justify-between items-start gap-2 pl-1">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                        <span className="text-emerald-700 font-black text-xs">{row.name?.charAt(0)}</span>
                                                    </div>
                                                    <p className="font-black text-slate-800 text-sm truncate">{row.name}</p>
                                                </div>
                                                {row.email && <p className="text-[11px] text-slate-400 ml-9">{row.email}</p>}
                                            </div>
                                            <span className="shrink-0 inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-indigo-100">
                                                <Briefcase size={10} />
                                                {row.position.length > 16 ? row.position.slice(0, 16) + "…" : row.position}
                                            </span>
                                        </div>

                                        <div className="mt-3 pl-1 flex flex-wrap gap-3 text-[11px] text-slate-400">
                                            {row.department && (
                                                <span className="flex items-center gap-1">
                                                    <User size={11} /> {row.department}
                                                </span>
                                            )}
                                            {row.experience && (
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} /> {row.experience}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} /> {fmtDate(row.applyDate || row.createdAt)}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex gap-2 pl-1">
                                            <button
                                                onClick={() => openEdit(row)}
                                                className="flex-1 py-2.5 bg-white rounded-xl border border-slate-200 font-black text-sm text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row)}
                                                disabled={deleting === row._id}
                                                className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-black text-sm border border-rose-100 hover:bg-rose-100 transition-all disabled:opacity-40"
                                            >
                                                {deleting === row._id
                                                    ? <Loader2 size={14} className="animate-spin mx-auto" />
                                                    : "Remove"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer count */}
                            <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/40">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {filtered.length} of {candidates.length} candidates
                                    {search && ` matching "${search}"`}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ═══════ MODAL ══════════════════════════════════ */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[95vh] overflow-y-auto">

                        {/* Modal header */}
                        <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 pt-6 pb-4 border-b border-slate-50">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                                    {editId ? "Edit Candidate" : "Add to Shortlist"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {editId ? "Update candidate details below." : "Fill in the candidate's details. Fields marked * are required."}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} noValidate className="px-6 pb-6 pt-4 space-y-4">

                            {/* ── Name * ──────────────────────────────── */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Candidate Name <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Rahul Sharma"
                                        value={form.name}
                                        onChange={e => handleChange("name", e.target.value)}
                                        onBlur={() => handleBlur("name")}
                                        maxLength={100}
                                        className={`${inputCls(errors.name)} pl-9`}
                                    />
                                </div>
                                <FieldError msg={errors.name} />
                                {touched.name && !errors.name && form.name && (
                                    <p className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1 ml-1">
                                        <CheckCircle2 size={11} /> Looks good
                                    </p>
                                )}
                            </div>

                            {/* ── Target Position * ───────────────────── */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Target Position <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Software Engineer"
                                        value={form.position}
                                        onChange={e => handleChange("position", e.target.value)}
                                        onBlur={() => handleBlur("position")}
                                        maxLength={100}
                                        className={`${inputCls(errors.position)} pl-9`}
                                    />
                                </div>
                                <FieldError msg={errors.position} />
                                {touched.position && !errors.position && form.position && (
                                    <p className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1 ml-1">
                                        <CheckCircle2 size={11} /> Looks good
                                    </p>
                                )}
                            </div>

                            {/* ── Date Added * ────────────────────────── */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Date Added <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={form.applyDate}
                                        max={TODAY}
                                        onChange={e => handleChange("applyDate", e.target.value)}
                                        onBlur={() => handleBlur("applyDate")}
                                        className={`${inputCls(errors.applyDate)} pl-9`}
                                    />
                                </div>
                                <FieldError msg={errors.applyDate} />
                                {touched.applyDate && !errors.applyDate && form.applyDate && (
                                    <p className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1 ml-1">
                                        <CheckCircle2 size={11} /> Valid date
                                    </p>
                                )}
                            </div>

                            {/* ── Email (optional) ────────────────────── */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Email <span className="text-slate-300 font-medium normal-case text-[10px]">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    <input
                                        type="email"
                                        placeholder="candidate@example.com"
                                        value={form.email}
                                        onChange={e => handleChange("email", e.target.value)}
                                        onBlur={() => handleBlur("email")}
                                        className={`${inputCls(errors.email)} pl-9`}
                                    />
                                </div>
                                <FieldError msg={errors.email} />
                            </div>

                            {/* ── Phone (optional) ────────────────────── */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Phone <span className="text-slate-300 font-medium normal-case text-[10px]">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    <input
                                        type="tel"
                                        placeholder="e.g. +91 98765 43210"
                                        value={form.phone}
                                        onChange={e => handleChange("phone", e.target.value)}
                                        onBlur={() => handleBlur("phone")}
                                        className={`${inputCls(errors.phone)} pl-9`}
                                    />
                                </div>
                                <FieldError msg={errors.phone} />
                            </div>

                            {/* ── Department + Experience (2-col) ──────── */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                        Department <span className="text-slate-300 font-medium normal-case text-[10px]">(opt.)</span>
                                    </label>
                                    <select
                                        value={form.department}
                                        onChange={e => handleChange("department", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition text-slate-700"
                                    >
                                        <option value="">Select…</option>
                                        {DEPT_LIST.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                        Experience <span className="text-slate-300 font-medium normal-case text-[10px]">(opt.)</span>
                                    </label>
                                    <select
                                        value={form.experience}
                                        onChange={e => handleChange("experience", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition text-slate-700"
                                    >
                                        <option value="">Select…</option>
                                        {EXP_LIST.map(x => <option key={x}>{x}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* ── Summary validation banner ────────────── */}
                            {Object.keys(errors).length > 0 && Object.values(touched).some(Boolean) && (
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                                    <AlertCircle size={15} className="text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-black text-rose-700">Please fix the following:</p>
                                        <ul className="mt-1 space-y-0.5">
                                            {Object.values(errors).filter(Boolean).map((e, i) => (
                                                <li key={i} className="text-[11px] text-rose-600">• {e}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* ── Footer buttons ──────────────────────── */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3.5 bg-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving && <Loader2 size={14} className="animate-spin" />}
                                    {saving ? "Saving…" : editId ? "Update Record" : "Add to Shortlist"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortlistTable;