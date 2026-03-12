import { useState, useEffect } from "react";
import { Gift, Loader2, AlertCircle, Calendar } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TYPE_COLORS = {
    National: "bg-blue-100 text-blue-700 border-blue-200",
    Religious: "bg-purple-100 text-purple-700 border-purple-200",
    Optional: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Company: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function UserHoliday() {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${BASE}/holidays`, { headers: { Authorization: `Bearer ${token()}` } })
            .then(r => r.json())
            .then(d => { if (!d.success) throw new Error(d.message); setHolidays(d.data || []); })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const thisYear = today.getFullYear();

    const upcoming = holidays.filter(h => { const d = new Date(h.date); return d.getFullYear() === thisYear && d >= today; });
    const past = holidays.filter(h => { const d = new Date(h.date); return d.getFullYear() === thisYear && d < today; });
    const nextHoliday = upcoming[0];

    const daysUntil = (date) => {
        const diff = new Date(date) - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-[#f0f4f4] p-4 md:p-8 pt-20">
            <div className="max-w-2xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#0a4d44] rounded-2xl shadow-lg">
                        <Gift className="text-emerald-300" size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#0f2e2e]">Holidays</h1>
                        <p className="text-slate-400 text-xs mt-0.5">{thisYear} — Company Holidays</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={28} /></div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-red-600 text-sm font-bold flex gap-2 items-center">
                        <AlertCircle size={14} />{error}
                    </div>
                ) : (
                    <>
                        {/* Next holiday banner */}
                        {nextHoliday && (
                            <div className="bg-gradient-to-br from-[#0f2e2e] to-[#0a4d44] rounded-[2rem] p-6 text-white relative overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-400/10 rounded-full" />
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-400/10 rounded-full" />
                                <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Next Holiday</p>
                                <h2 className="text-2xl font-black relative z-10">{nextHoliday.name}</h2>
                                <p className="text-emerald-200 text-sm mt-1 relative z-10">
                                    {new Date(nextHoliday.date).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                                </p>
                                <div className="mt-4 relative z-10">
                                    <span className="px-4 py-1.5 bg-emerald-400/20 border border-emerald-400/30 rounded-full text-emerald-200 text-xs font-black">
                                        {daysUntil(nextHoliday.date) === 0 ? "🎉 Today!" : `${daysUntil(nextHoliday.date)} day${daysUntil(nextHoliday.date) !== 1 ? "s" : ""} away`}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Total", val: holidays.filter(h => new Date(h.date).getFullYear() === thisYear).length, color: "text-[#0f2e2e]" },
                                { label: "Upcoming", val: upcoming.length, color: "text-emerald-600" },
                                { label: "Past", val: past.length, color: "text-slate-400" },
                            ].map(s => (
                                <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Upcoming holidays */}
                        {upcoming.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 ml-1">Upcoming</p>
                                <div className="space-y-2">
                                    {upcoming.map(h => {
                                        const d = new Date(h.date);
                                        const due = daysUntil(h.date);
                                        return (
                                            <div key={h._id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#0a4d44] text-white flex flex-col items-center justify-center shrink-0 leading-none">
                                                    <span className="text-[9px] font-black uppercase">{MONTHS[d.getMonth()]}</span>
                                                    <span className="text-lg font-black">{d.getDate()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-[#0f2e2e] text-sm truncate">{h.name}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                                        {d.toLocaleDateString("en-IN", { weekday: "long" })}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${TYPE_COLORS[h.type]}`}>{h.type}</span>
                                                    <span className="text-[9px] font-black text-emerald-600">
                                                        {due === 0 ? "Today!" : due === 1 ? "Tomorrow" : `${due} days`}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Past holidays */}
                        {past.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 ml-1">Past Holidays</p>
                                <div className="space-y-2">
                                    {[...past].reverse().map(h => {
                                        const d = new Date(h.date);
                                        return (
                                            <div key={h._id} className="bg-white/60 rounded-2xl p-4 border border-slate-100 flex items-center gap-4 opacity-60">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex flex-col items-center justify-center shrink-0 leading-none">
                                                    <span className="text-[9px] font-black uppercase">{MONTHS[d.getMonth()]}</span>
                                                    <span className="text-lg font-black">{d.getDate()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-500 text-sm truncate">{h.name}</p>
                                                    <p className="text-[10px] text-slate-400">{d.toLocaleDateString("en-IN", { weekday: "long" })}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${TYPE_COLORS[h.type]} shrink-0`}>{h.type}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {holidays.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                <Gift size={48} className="mx-auto text-slate-200 mb-3" />
                                <p className="font-black text-slate-400">No holidays added yet</p>
                                <p className="text-slate-300 text-sm">Admin will add company holidays.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}