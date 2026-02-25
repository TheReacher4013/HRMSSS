import { useState, useEffect } from "react";
import { Briefcase, Loader2, Calendar, CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";
import { projectAPI } from "../../../services/api";

const statusColor = (s) => ({
  "Completed": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "On Hold": "bg-orange-100 text-orange-600",
  "Cancelled": "bg-red-100 text-red-600",
  "Not Started": "bg-gray-100 text-gray-600",
  "Done": "bg-emerald-100 text-emerald-700",
  "To Do": "bg-gray-100 text-gray-600",
  "Review": "bg-purple-100 text-purple-700",
}[s] || "bg-gray-100 text-gray-600");

const priorityColor = (p) => ({
  "High": "bg-red-50 text-red-600 border-red-100",
  "Medium": "bg-orange-50 text-orange-600 border-orange-100",
  "Low": "bg-green-50 text-green-600 border-green-100",
}[p] || "bg-gray-50 text-gray-600 border-gray-100");

const UserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectAPI.getAll(),
          projectAPI.getTasks(),
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8fafa] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e2e]">My Work</h1>
            <p className="text-gray-500 text-sm mt-1">Projects and tasks assigned to you by admin</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Projects</span>
              <span className="text-lg font-bold text-[#0f2e2e]">{projects.length}</span>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm text-center">
              <span className="text-[10px] font-bold text-blue-400 block uppercase tracking-widest">Tasks</span>
              <span className="text-lg font-bold text-blue-700">{tasks.length}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["projects", "tasks"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition ${tab === t ? "bg-[#0f2e2e] text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}>
              {t === "projects" ? `📁 Projects (${projects.length})` : `✅ Tasks (${tasks.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : tab === "projects" ? (
          projects.length === 0 ? (
            <div className="py-20 bg-white rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 bg-gray-50 rounded-full mb-4"><Briefcase className="text-gray-300" size={32} /></div>
              <h3 className="text-lg font-bold text-[#0f2e2e]">No projects assigned yet</h3>
              <p className="text-gray-400 text-sm">Contact your admin to get assigned to a project</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p._id} className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#0f2e2e] text-white rounded-2xl">
                      <Briefcase size={20} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f2e2e] text-base mb-1">{p.title}</h3>
                  {p.client?.name && <p className="text-xs text-gray-400 mb-1">Client: {p.client.name}</p>}
                  {p.description && <p className="text-xs text-gray-500 mb-4 line-clamp-2">{p.description}</p>}

                  <div className="mt-auto">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Progress</span>
                      <span className="text-xs font-black text-[#0f2e2e]">{p.progress || 0}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                        style={{ width: `${p.progress || 0}%` }}></div>
                    </div>
                    {(p.startDate || p.endDate) && (
                      <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
                        <Calendar size={10} />
                        {p.startDate && new Date(p.startDate).toLocaleDateString()}
                        {p.endDate && ` → ${new Date(p.endDate).toLocaleDateString()}`}
                      </div>
                    )}
                    {/* Team members */}
                    {p.teamMembers?.length > 0 && (
                      <div className="mt-2 flex -space-x-2">
                        {p.teamMembers.slice(0, 4).map((m, i) => (
                          <div key={i} title={m.name}
                            className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-700 text-[9px] font-black">
                            {m.name?.charAt(0)}
                          </div>
                        ))}
                        {p.teamMembers.length > 4 && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-500 text-[9px] font-bold">
                            +{p.teamMembers.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Tasks Tab */
          tasks.length === 0 ? (
            <div className="py-20 bg-white rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 bg-gray-50 rounded-full mb-4"><ListTodo className="text-gray-300" size={32} /></div>
              <h3 className="text-lg font-bold text-[#0f2e2e]">No tasks assigned yet</h3>
              <p className="text-gray-400 text-sm">Your admin will assign tasks to you</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#0f2e2e]">{t.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${priorityColor(t.priority)}`}>
                          {t.priority}
                        </span>
                      </div>
                      {t.project?.title && (
                        <p className="text-xs text-gray-400 mb-1">📁 Project: {t.project.title}</p>
                      )}
                      {t.description && (
                        <p className="text-xs text-gray-500">{t.description}</p>
                      )}
                      {t.dueDate && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar size={10} /> Due: {new Date(t.dueDate).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase shrink-0 ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserProjects;
