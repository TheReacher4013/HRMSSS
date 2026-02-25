import { Trophy, Star } from "lucide-react";

const AchievementWidget = () => {
  const achievements = [
    {
      title: "Employee of the Month",
      date: "Jan 2026",
      level: "Gold",
    },
    {
      title: "Best Team Player",
      date: "Dec 2025",
      level: "Silver",
    },
    {
      title: "Project Excellence",
      date: "Nov 2025",
      level: "Bronze",
    },
  ];

  const levelStyle = {
    Gold: "bg-yellow-100 text-yellow-700",
    Silver: "bg-gray-100 text-gray-600",
    Bronze: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      
      {/* Header (same as LeaveWidget) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Trophy className="text-emerald-600" size={20} />
          Achievements
        </h2>
        <span className="text-sm text-gray-500">
          Latest Rewards
        </span>
      </div>

      {/* Achievement List */}
      <div className="space-y-4">
        {achievements.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 rounded-xl border
                       hover:shadow-sm transition"
          >
            <div>
              <h3 className="font-semibold text-[#0f2e2e] flex items-center gap-1">
                <Star size={14} className="text-emerald-600" />
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {item.date}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold ${levelStyle[item.level]}`}
            >
              {item.level}
            </span>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        className="mt-6 w-full bg-gradient-to-r from-[#0f3d3e] to-[#145e63]
                   hover:from-[#145e63] hover:to-[#0f3d3e]
                   text-white py-3 rounded-xl font-medium
                   shadow-md hover:shadow-lg transition duration-300"
      >
        View All Achievements
      </button>
    </div>
  );
};

export default AchievementWidget;