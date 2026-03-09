import { useEffect, useState } from "react";
import { Bell, AlertCircle, Loader2, Megaphone, Calendar, User, Search } from "lucide-react";
import { noticeAPI } from "../../../services/api";

const typeConfig = (type) => {
  switch (type?.toLowerCase()) {
    case "urgent": return { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", icon: "text-red-400", dot: "bg-red-500" };
    case "holiday": return { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-500", dot: "bg-emerald-500" };
    case "event": return { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700", icon: "text-purple-400", dot: "bg-purple-500" };
    default: return { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon: "text-blue-400", dot: "bg-blue-500" };
  }
};

const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await noticeAPI.getAll();
        setNotices(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = notices.filter(n => {
    const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || n.type === filter;
    return matchSearch && matchFilter;
  });

  const counts = ["General", "Urgent", "Holiday", "Event"].reduce((acc, t) => {
    acc[t] = notices.filter(n => n.type === t).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f8fafa] p-4 sm:p-6 pt-20">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0f2e2e] flex items-center gap-2">
              <Bell className="text-emerald-600" size={22} /> Notice Board
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Company announcements and updates</p>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-center min-w-[70px]">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Total</span>
            <span className="text-2xl font-black text-[#0f2e2e]">{notices.length}</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {["All", "General", "Urgent", "Holiday", "Event"].map(tab => {
            const cfg = tab === "All" ? null : typeConfig(tab);
            const active = filter === tab;
            return (
              <button key={tab} onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all border ${active
                    ? "bg-[#0f2e2e] text-white border-transparent shadow-sm"
                    : "bg-white text-slate-500 border-gray-200 hover:border-gray-300"
                  }`}>
                {tab}
                {tab !== "All" && counts[tab] > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${active ? "bg-white/20 text-white" : (cfg?.badge || "bg-gray-100 text-gray-500")}`}>
                    {counts[tab]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ring-emerald-200" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-14 text-center shadow-sm border border-gray-100">
            <Megaphone size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-500">No notices found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different filter or search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notice => {
              const s = typeConfig(notice.type);
              return (
                <div key={notice._id}
                  className={`rounded-2xl p-5 border ${s.bg} ${s.border}`}>

                  {/* Top row: badge + date + author */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${s.badge}`}>
                      {notice.type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <Calendar size={10} />
                      {new Date(notice.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <User size={10} /> {notice.by}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-[#0f2e2e] text-base mb-1.5">
                    {notice.title || notice.description}
                  </h3>

                  {/* Description (only if title exists) */}
                  {notice.title && notice.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{notice.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNoticeBoard;