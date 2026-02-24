import React, { useEffect, useState } from "react";
import { Users, Award, Briefcase, Calendar, TrendingUp, Clock } from "lucide-react";
import { reportAPI } from "../utils/api";

const DashboardContent = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, totalDepartments: 0, presentToday: 0, pendingLeaves: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await reportAPI.getDashboard(); setStats(res.data); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: "Total Employees", value: stats.totalEmployees, icon: Users, color: "bg-emerald-100 text-emerald-700", bg: "from-emerald-50 to-white" },
    { label: "Departments", value: stats.totalDepartments, icon: Briefcase, color: "bg-blue-100 text-blue-700", bg: "from-blue-50 to-white" },
    { label: "Present Today", value: stats.presentToday, icon: Calendar, color: "bg-purple-100 text-purple-700", bg: "from-purple-50 to-white" },
    { label: "Pending Leaves", value: stats.pendingLeaves, icon: Clock, color: "bg-orange-100 text-orange-700", bg: "from-orange-50 to-white" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-3xl p-6 h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`bg-gradient-to-br ${bg} rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all`}>
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <p className="text-3xl font-black text-slate-800">{value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-1 flex items-center gap-2"><TrendingUp size={20} className="text-emerald-600" /> Quick Overview</h2>
          <p className="text-slate-500 text-sm mb-6">Real-time data from your HRMS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {cards.map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-black text-[#0a4d44]">{value}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardContent;
