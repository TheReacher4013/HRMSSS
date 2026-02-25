// import { useState, useEffect } from "react";
// import { Trophy, Star } from "lucide-react";

// const UserAchievements = () => {
//   const [achievements, setAchievements] = useState([]);

//   useEffect(() => {
//     // demo data (backend नंतर जोडू शकतोस)
//     const stored =
//       JSON.parse(localStorage.getItem("achievements")) || [
//         {
//           title: "Employee of the Month",
//           date: "2026-01-31",
//           description: "Outstanding performance in January month",
//           level: "Gold",
//         },
//         {
//           title: "Best Team Player",
//           date: "2025-12-15",
//           description: "Excellent teamwork and collaboration",
//           level: "Silver",
//         },
//       ];

//     setAchievements(stored);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f8fafa] p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
        
//         {/* Header (same as Leave) */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-black text-[#0f2e2e]">
//             My Achievements
//           </h1>
//         </div>

//         {/* Achievement Cards */}
//         {achievements.length === 0 ? (
//           <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm">
//             No achievements found
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {achievements.map((item, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <h2 className="text-lg font-bold text-[#0f2e2e] flex items-center gap-2">
//                     <Trophy className="text-emerald-600" size={20} />
//                     {item.title}
//                   </h2>

//                   <AchievementBadge level={item.level} />
//                 </div>

//                 <p className="text-gray-600 text-sm mb-4">
//                   {item.description}
//                 </p>

//                 <div className="flex justify-between text-xs text-gray-500">
//                   <span>📅 {item.date}</span>
//                   <span className="flex items-center gap-1">
//                     <Star size={12} />
//                     Achievement
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const AchievementBadge = ({ level }) => {
//   const styles = {
//     Gold: "bg-yellow-100 text-yellow-700",
//     Silver: "bg-gray-100 text-gray-600",
//     Bronze: "bg-orange-100 text-orange-600",
//   };

//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-[10px] font-bold ${styles[level]}`}
//     >
//       {level}
//     </span>
//   );
// };

// export default UserAchievements;


// import { useState, useEffect } from "react";
// import { Trophy, Star, Award, Loader2 } from "lucide-react";
// import { awardAPI } from "../../../services/api";
// import { useAuth } from "../../../context/AuthContext";

// const levelStyle = (type) => {
//   switch (type?.toLowerCase()) {
//     case "gold": return { bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", icon: "text-amber-500" };
//     case "silver": return { bg: "bg-slate-50 border-slate-200", badge: "bg-slate-100 text-slate-600", icon: "text-slate-500" };
//     case "bronze": return { bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700", icon: "text-orange-500" };
//     default: return { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600" };
//   }
// };

// const UserAchievements = () => {
//   const { user } = useAuth();
//   const [awards, setAwards] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAwards = async () => {
//       try {
//         const res = await awardAPI.getAll();
//         // Filter only awards for this user (by name match or employee link)
//         const myAwards = res.data.filter(a =>
//           a.employeeName?.toLowerCase().includes(user?.name?.split(" ")[0]?.toLowerCase() || "") ||
//           a.employee?._id === user?.employeeId
//         );
//         setAwards(myAwards.length > 0 ? myAwards : res.data); // fallback: show all if none matched
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAwards();
//   }, [user]);

//   return (
//     <div className="min-h-screen bg-[#f8fafa] p-6">
//       <div className="max-w-5xl mx-auto space-y-6">

//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-black text-[#0f2e2e] flex items-center gap-2">
//               <Trophy className="text-amber-500" /> My Achievements
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">Awards and recognitions</p>
//           </div>
//           <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-center">
//             <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-widest">Total</span>
//             <span className="text-lg font-bold text-amber-700">{awards.length}</span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="animate-spin text-amber-500" size={36} />
//           </div>
//         ) : awards.length === 0 ? (
//           <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
//             <Trophy size={48} className="mx-auto mb-4 text-gray-200" />
//             <p className="font-bold text-gray-500">No achievements yet</p>
//             <p className="text-sm text-gray-400 mt-1">Keep working hard — your admin will recognize your efforts!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {awards.map((award) => {
//               const style = levelStyle(award.awardType);
//               return (
//                 <div key={award._id} className={`rounded-2xl p-6 border-2 ${style.bg} flex flex-col hover:shadow-md transition-all`}>
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="p-3 bg-white rounded-2xl shadow-sm">
//                       <Trophy size={24} className={style.icon} />
//                     </div>
//                     {award.awardType && (
//                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
//                         {award.awardType}
//                       </span>
//                     )}
//                   </div>

//                   <h3 className="font-black text-[#0f2e2e] text-base mb-1">{award.awardName}</h3>
//                   {award.description && <p className="text-xs text-gray-500 mb-3">{award.description}</p>}

//                   <div className="mt-auto pt-3 border-t border-white/80 flex justify-between items-center">
//                     <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                       <Star size={12} className={style.icon} />
//                       {award.employeeName}
//                     </div>
//                     <span className="text-[10px] text-gray-400">
//                       {new Date(award.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
//                     </span>
//                   </div>

//                   {award.cashPrize > 0 && (
//                     <div className="mt-2 bg-white/60 rounded-xl px-3 py-2 text-center">
//                       <span className="text-xs font-black text-emerald-700">🎁 Cash Prize: ₹{award.cashPrize.toLocaleString()}</span>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserAchievements;





import { useState, useEffect } from "react";
import { Trophy, Star, Loader2 } from "lucide-react";
import { awardAPI } from "../../../services/api";

const levelStyle = (type) => {
  switch ((type || "").toLowerCase()) {
    case "gold": return { bg: "from-amber-50 to-yellow-50 border-amber-200", badge: "bg-amber-100 text-amber-700", icon: "text-amber-500", trophy: "🥇" };
    case "silver": return { bg: "from-slate-50 to-gray-50 border-slate-200", badge: "bg-slate-100 text-slate-600", icon: "text-slate-500", trophy: "🥈" };
    case "bronze": return { bg: "from-orange-50 to-amber-50 border-orange-200", badge: "bg-orange-100 text-orange-700", icon: "text-orange-500", trophy: "🥉" };
    default: return { bg: "from-emerald-50 to-teal-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600", trophy: "🏆" };
  }
};

const UserAchievements = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        // Backend already filters by logged-in user's employee ID
        const res = await awardAPI.getAll();
        setAwards(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  const totalCashPrize = awards.reduce((s, a) => s + (a.cashPrize || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafa] p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0f2e2e] flex items-center gap-2">
              <Trophy className="text-amber-500" /> My Achievements
            </h1>
            <p className="text-gray-400 text-sm mt-1">Awards and recognitions from admin</p>
          </div>
          {awards.length > 0 && (
            <div className="flex gap-3">
              <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-center">
                <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-widest">Awards</span>
                <span className="text-lg font-bold text-amber-700">{awards.length}</span>
              </div>
              {totalCashPrize > 0 && (
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-emerald-500 block uppercase tracking-widest">Total Prize</span>
                  <span className="text-lg font-bold text-emerald-700">₹{totalCashPrize.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={36} />
          </div>
        ) : awards.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🏆</div>
            <p className="font-bold text-gray-500 text-lg">No achievements yet</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
              Keep working hard! Your admin will recognize your efforts here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => {
              const style = levelStyle(award.awardType);
              return (
                <div key={award._id}
                  className={`rounded-2xl p-6 border-2 bg-gradient-to-br ${style.bg} flex flex-col hover:shadow-lg transition-all duration-200`}>

                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{style.trophy}</div>
                    {award.awardType && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
                        {award.awardType}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-[#0f2e2e] text-base mb-1">{award.awardName}</h3>
                  {award.description && (
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">{award.description}</p>
                  )}

                  <div className="mt-auto space-y-2">
                    {award.cashPrize > 0 && (
                      <div className="bg-white/70 rounded-xl px-3 py-2 text-center border border-white">
                        <span className="text-xs font-black text-emerald-700">
                          🎁 Cash Prize: ₹{award.cashPrize.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {award.giftItem && (
                      <div className="bg-white/70 rounded-xl px-3 py-2 text-center border border-white">
                        <span className="text-xs font-medium text-gray-600">🎀 Gift: {award.giftItem}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-white/60">
                      <span className="text-[10px] text-gray-400">
                        {new Date(award.date || award.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </span>
                      {award.awardBy && (
                        <span className="text-[10px] text-gray-400">by {award.awardBy}</span>
                      )}
                    </div>
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

export default UserAchievements;
