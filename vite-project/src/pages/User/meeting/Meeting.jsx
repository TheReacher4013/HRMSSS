import { useState, useEffect, useMemo } from "react";
import {
  Video, Calendar, Clock, MapPin, User, Users, Link2,
  ExternalLink, Copy, Check, Loader2, AlertCircle, Search,
} from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

const STATUS_CONFIG = {
  Scheduled: { bg: "bg-blue-100", text: "text-blue-700" },
  Ongoing: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Completed: { bg: "bg-gray-100", text: "text-gray-600" },
  Cancelled: { bg: "bg-red-100", text: "text-red-600" },
};

/* ── CopyButton ───────────────────────────────────────────────── */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handle}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all
        ${copied ? "bg-emerald-100 text-emerald-600" : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"}`}>
      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy Link</>}
    </button>
  );
};

/* ── Main ─────────────────────────────────────────────────────── */
const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All | Scheduled | Ongoing | Completed

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE}/meetings`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setMeetings(data.data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── filter + search ── */
  const displayed = useMemo(() => {
    return meetings.filter(m => {
      const matchesStatus = filter === "All" || m.status === filter;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        m.title.toLowerCase().includes(q) ||
        (m.organizer || "").toLowerCase().includes(q) ||
        (m.location || "").toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [meetings, filter, search]);

  /* ── stats ── */
  const counts = useMemo(() => ({
    All: meetings.length,
    Scheduled: meetings.filter(m => m.status === "Scheduled").length,
    Ongoing: meetings.filter(m => m.status === "Ongoing").length,
    Completed: meetings.filter(m => m.status === "Completed").length,
  }), [meetings]);

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div className="bg-[#f8fafa] min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0f2e2e] flex items-center gap-2">
            <Video className="text-blue-500" size={24} /> My Meetings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Meetings you are scheduled to attend</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {["All", "Scheduled", "Ongoing", "Completed"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all
                ${filter === s
                  ? "bg-[#0a4d44] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {s} {counts[s] > 0 && <span className="ml-0.5 opacity-70">({counts[s]})</span>}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 ring-emerald-100" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 px-4 py-3 rounded-2xl text-sm text-red-600 font-bold flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <Video className="mx-auto text-slate-300 mb-3" size={44} />
            <p className="text-slate-500 font-bold text-base mb-1">
              {meetings.length === 0 ? "No meetings assigned yet" : "No meetings match your filter"}
            </p>
            <p className="text-slate-400 text-sm">
              {meetings.length === 0
                ? "Your admin will schedule meetings and add you as an attendee."
                : "Try changing the filter or search term."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(m => {
              const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.Scheduled;
              const isActive = m.status === "Scheduled" || m.status === "Ongoing";
              const dateStr = m.date
                ? new Date(m.date).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
                : "—";

              return (
                <div key={m._id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">

                  {/* Top colour bar for ongoing */}
                  {m.status === "Ongoing" && (
                    <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                  )}

                  <div className="p-5">
                    {/* Title row */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-800 text-base leading-tight">{m.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${cfg.bg} ${cfg.text}`}>
                          {m.status}
                        </span>
                      </div>
                    </div>

                    {m.description && (
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{m.description}</p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-emerald-500 shrink-0" />{dateStr}
                      </span>
                      {m.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-blue-400 shrink-0" />{m.time}
                        </span>
                      )}
                      {m.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-red-400 shrink-0" />{m.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <User size={12} className="text-purple-400 shrink-0" />{m.organizer}
                      </span>
                      {m.attendeeNames?.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Users size={12} className="text-indigo-400 shrink-0" />{m.attendeeNames.length} attendee{m.attendeeNames.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* ── MEETING LINK SECTION ── */}
                    {m.meetingLink ? (
                      <div className={`rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center gap-3
                        ${isActive
                          ? "bg-blue-50 border-blue-100"
                          : "bg-slate-50 border-slate-200"}`}>

                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Link2 size={13} className={isActive ? "text-blue-500 shrink-0" : "text-slate-400 shrink-0"} />
                          <span className={`text-[11px] font-mono truncate ${isActive ? "text-blue-700" : "text-slate-500"}`}>
                            {m.meetingLink}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <CopyButton text={m.meetingLink} />
                          {isActive ? (
                            <a href={m.meetingLink} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm shadow-blue-200">
                              <Video size={12} /> Join Meeting
                            </a>
                          ) : (
                            <a href={m.meetingLink} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-300 transition">
                              <ExternalLink size={11} /> Open
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-400 italic">
                        No meeting link provided.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;