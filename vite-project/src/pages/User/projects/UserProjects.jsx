import { useState, useEffect } from "react";
import { Briefcase, CheckCircle2, Clock, ExternalLink } from "lucide-react";

const UserProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Dashboard se save kiye hue projects load ho rahe hain
    const stored = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(stored);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8fafa] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e2e]">My Project Logs</h1>
            <p className="text-gray-500 text-sm mt-1">Track your progress and contributions</p>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{projects.length} Total Projects</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full py-20 bg-white rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <Briefcase className="text-gray-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#0f2e2e]">No projects found</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Start updating your progress from the dashboard to see your logs here.</p>
            </div>
          ) : (
            projects.map((p, i) => (
              <div key={i} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex flex-col justify-between hover:shadow-md transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#0f2e2e] text-white rounded-2xl shadow-lg shadow-emerald-900/10">
                      <Briefcase size={20} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${p.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                      }`}>
                      {p.status === "Completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0f2e2e] mb-2 group-hover:text-emerald-600 transition-colors">
                    {p.name}
                  </h3>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 min-h-[100px]">
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                      "{p.update || "No update details provided."}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged: Today</span>
                  <button className="text-[#0f2e2e] hover:text-emerald-600 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProjects;