import React from "react";
import { Plus, BarChart3, Users, Award, Briefcase, Calendar } from "lucide-react";

const DashboardContent = ({ isSidebarOpen }) => {
  const awards = [
    { id: 1, name: "Scarlet Melvin Reese", award: "Best Performer", date: "28-12-2025" },
    { id: 2, name: "Alex Harrison", award: "Employee of the Month", date: "15-01-2026" },
    { id: 3, name: "Monica Geller", award: "Top Recruiter", date: "10-02-2026" },
  ];

  return (
    <div
      className={`
        pt-20 p-3 sm:p-6 bg-[#f0f4f4] min-h-screen transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "lg:ml-[280px]" : "ml-0"}
      `}
    >
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e2e] tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium italic">Welcome back, Alex Williamson 👋</p>
          </div>
          <button className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#0f2e2e] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#1a4040] transition shadow-xl active:scale-95">
            <Plus size={16} /> Add Widget
          </button>
        </div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 md:col-span-2 lg:col-span-1">
            <StatCard title="Air Pollution" value="35.05 μg/m³" trend="+3.5%" color="text-emerald-500" icon={<BarChart3 size={18} />} />
            <StatCard title="Env. Quality" value="75.50/100%" trend="-1.4%" color="text-blue-500" icon={<Award size={18} />} />
            <StatCard title="Investments" value="$967,570" trend="+5.1%" color="text-emerald-500" icon={<Briefcase size={18} />} />
          </div>

          {/* ATTENDANCE CHART */}
          <div className="md:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-[#0f2e2e]">Daily Attendance</h2>
              <select className="text-[10px] font-bold uppercase bg-gray-50 border-none rounded-xl px-3 py-2 outline-none">
                <option>This Week</option>
              </select>
            </div>
            <div className="h-60 sm:h-72 bg-gray-50/50 rounded-2xl flex items-end justify-around p-4 border-2 border-dashed border-gray-100">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="w-3 sm:w-6 bg-[#0f2e2e] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
              ))}
            </div>
          </div>

          {/* COMMUNITY CARD */}
          <div className="md:col-span-2 lg:col-span-1 bg-[#0f2e2e] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[250px] shadow-xl">
            <div className="relative z-10">
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[3px]">AeuxGlobal</span>
              <h2 className="text-2xl font-bold mt-3 leading-tight">Join our <br /> community</h2>
            </div>
            <div className="mt-6 flex items-center gap-4 relative z-10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0f2e2e] bg-gray-600"></div>)}
              </div>
              <button className="p-2.5 bg-emerald-500 rounded-xl shadow-lg"><Plus size={18} /></button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full blur-[60px] opacity-20"></div>
          </div>
        </div>

        {/* AWARD LIST SECTION - MOBILE FRIENDLY */}
        <div className="mt-6 bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-[#0f2e2e] flex items-center gap-2">
              <Award className="text-emerald-500" /> Employee Award List
            </h2>
          </div>

          {/* MOBILE VIEW: EK KE NICHE EK CARDS */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {awards.map((row) => (
              <div key={row.id} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${row.id}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0f2e2e]">{row.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">ID: #00{row.id}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">
                    {row.award}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{row.date}</span>
                  </div>
                  <button className="text-[10px] font-black text-emerald-600 uppercase">Details</button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: TABLE LAYOUT */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-[3px] font-black border-b border-gray-50">
                  <th className="pb-5 pl-2">Sl.</th>
                  <th className="pb-5">Employee Name</th>
                  <th className="pb-5">Award Category</th>
                  <th className="pb-5 text-right pr-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {awards.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 text-xs font-black text-gray-300 pl-2">{row.id}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?u=${row.id}`} alt="user" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-[#0f2e2e] group-hover:text-emerald-600 transition-colors">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tighter">{row.award}</span>
                    </td>
                    <td className="py-5 text-xs font-bold text-gray-400 text-right pr-2">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Mini Helper Component */
const StatCard = ({ title, value, trend, color, icon }) => (
  <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-5 flex justify-between items-end hover:shadow-md transition-shadow">
    <div className="space-y-1">
      <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-black mb-1">{title}</p>
      <h2 className="text-xl font-black text-[#0f2e2e]">{value}</h2>
      <p className={`text-[10px] font-bold ${color}`}>{trend}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-xl text-gray-300">{icon}</div>
  </div>
);

export default DashboardContent;