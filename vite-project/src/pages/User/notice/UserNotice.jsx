import { useEffect, useState } from "react";
import { Bell, AlertCircle, Loader2, Megaphone, Calendar } from "lucide-react";
import { noticeAPI } from "../../../services/api";

const typeStyle = (type) => {
  switch (type?.toLowerCase()) {
    case "urgent": return { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", icon: "text-red-500" };
    case "holiday": return { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600" };
    case "event": return { bg: "bg-purple-50 border-purple-200", badge: "bg-purple-100 text-purple-700", icon: "text-purple-500" };
    default: return { bg: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700", icon: "text-blue-500" };
  }
};

const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await noticeAPI.getAll();
        setNotices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafa] p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#0f2e2e] flex items-center gap-2">
              <Bell className="text-emerald-600" /> Notice Board
            </h1>
            <p className="text-gray-400 text-sm mt-1">Company announcements and updates</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total</span>
            <span className="text-lg font-bold text-[#0f2e2e]">{notices.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <Megaphone size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-500">No notices at the moment</p>
            <p className="text-sm text-gray-400">Check back later for updates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => {
              const style = typeStyle(notice.type);
              return (
                <div key={notice._id} className={`rounded-2xl p-5 border-2 ${style.bg} flex flex-col sm:flex-row sm:items-start gap-4`}>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
                        {notice.type}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                        <Calendar size={10} /> {new Date(notice.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-[10px] text-gray-400">• Posted by <strong>{notice.by}</strong></span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{notice.description}</p>
                  </div>
                  <AlertCircle size={20} className={`shrink-0 mt-1 ${style.icon}`} />
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
