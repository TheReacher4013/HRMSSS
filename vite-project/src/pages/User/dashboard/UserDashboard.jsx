import React, { useEffect, useState } from "react";
import { Calendar, Clock, Briefcase, CheckCircle } from "lucide-react";
import { attendanceAPI, leaveAPI, projectAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ attendance: 0, leaves: 0, projects: 0, pendingLeaves: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [leavesRes, projectsRes] = await Promise.all([leaveAPI.getAll(), projectAPI.getProjects()]);
        setStats({
          leaves: leavesRes.count || 0,
          pendingLeaves: leavesRes.data?.filter(l => l.status === "Pending").length || 0,
          projects: projectsRes.count || 0,
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: "Leave Balance", value: "12 days", icon: Calendar, color: "bg-blue-100 text-blue-700" },
    { label: "Pending Leaves", value: stats.pendingLeaves, icon: Clock, color: "bg-orange-100 text-orange-700" },
    { label: "My Projects", value: stats.projects, icon: Briefcase, color: "bg-purple-100 text-purple-700" },
    { label: "Tasks Done", value: "0", icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">Welcome back, {user?.name || "User"}! 👋</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Here's your personal overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}><Icon size={24} /></div>
              <p className="text-3xl font-black text-slate-800">{loading ? "..." : value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
          <p className="text-slate-500 font-medium">Your attendance, leaves, and project details are updated in real-time.</p>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
