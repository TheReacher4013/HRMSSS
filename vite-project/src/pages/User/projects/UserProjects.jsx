import { useState, useEffect } from "react";
import { Briefcase, CheckCircle2, Clock, ListTodo, AlertCircle, Loader2, Calendar, Users, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { projectAPI } from "../../../services/api";

const STATUS_COLORS = {
  "Not Started": "bg-slate-100 text-slate-500",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-amber-100 text-amber-700",
  "Cancelled": "bg-red-100 text-red-600",
};
const PRIORITY_COLORS = { Low: "text-gray-400", Medium: "text-amber-500", High: "text-red-500" };

const TASK_STATUS_COLORS = {
  "To Do": "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-50 text-blue-700",
  "Review": "bg-purple-50 text-purple-700",
  "Done": "bg-emerald-50 text-emerald-700",
};

export default function UserProjects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  // Get current user info from localStorage
  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();

  useEffect(() => {
    Promise.all([projectAPI.getAll(), projectAPI.getTasks()])
      .then(([p, t]) => { setProjects(p.data || []); setTasks(t.data || []); })
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  // Get tasks for a specific project
  const tasksForProject = (projectId) => tasks.filter(t => {
    const pid = t.project?._id || t.project;
    return pid === projectId;
  });

  // My tasks — assigned to the logged in user by name match
  const myTasks = tasks.filter(t =>
    t.assigneeName?.toLowerCase() === user?.name?.toLowerCase() ||
    t.assignedTo?.name?.toLowerCase() === user?.name?.toLowerCase()
  );

  const toggleExpanded = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafa] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={36} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f8fafa] flex items-center justify-center">
      <div className="bg-white rounded-[2rem] p-8 text-center border border-red-100">
        <AlertCircle className="text-red-400 mx-auto mb-3" size={32} />
        <p className="text-slate-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafa] p-4 sm:p-6 lg:p-8 pt-20">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-[#0f2e2e]">My Projects & Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">Projects you're part of and tasks assigned to you</p>
        </div>

        {/* My Tasks Summary */}
        {myTasks.length > 0 && (
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
            <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
              <ListTodo size={18} className="text-purple-500" /> My Assigned Tasks
              <span className="ml-auto text-[10px] font-black bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase">{myTasks.length} tasks</span>
            </h2>
            <div className="space-y-2">
              {myTasks.map(t => (
                <div key={t._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg whitespace-nowrap ${TASK_STATUS_COLORS[t.status]}`}>{t.status}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-400">{t.project?.title || "—"}</p>
                  </div>
                  {t.dueDate && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                      <Calendar size={10} />{t.dueDate.slice(0, 10)}
                    </span>
                  )}
                  <span className={`text-[10px] font-black ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-black text-slate-800">All Projects</h2>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">{projects.length} total</span>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
              <Briefcase className="text-slate-200 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-slate-500">No projects found</h3>
              <p className="text-slate-400 text-sm mt-1">Projects will appear here once they're created by admin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(p => {
                const ptasks = tasksForProject(p._id);
                const doneTasks = ptasks.filter(t => t.status === "Done").length;
                const isOpen = expanded[p._id];
                const members = p.teamMembers || [];

                return (
                  <div key={p._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    {/* Project Header */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="p-2.5 bg-[#0f2e2e] text-white rounded-2xl">
                              <Briefcase size={18} />
                            </div>
                            <div>
                              <h3 className="font-black text-slate-800 text-lg leading-tight">{p.title}</h3>
                              {p.clientName && <p className="text-xs text-slate-400">{p.clientName}</p>}
                            </div>
                            <span className={`ml-auto sm:ml-0 text-[10px] font-black uppercase px-3 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                          </div>

                          {p.description && (
                            <p className="text-sm text-slate-500 mt-3 leading-relaxed">{p.description}</p>
                          )}

                          {/* Stats row */}
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
                            {p.budget > 0 && (
                              <span className="flex items-center gap-1 text-slate-500 font-bold">
                                <IndianRupee size={11} />{Number(p.budget).toLocaleString("en-IN")}
                              </span>
                            )}
                            {p.startDate && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Calendar size={11} />{p.startDate.slice(0, 10)} → {p.endDate?.slice(0, 10) || "Open"}
                              </span>
                            )}
                            {members.length > 0 && (
                              <span className="flex items-center gap-1 text-slate-500 font-bold">
                                <Users size={11} />{members.length} member{members.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          {/* Team member avatars + names */}
                          {members.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {members.map((m, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                                  <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[8px] font-black text-emerald-700">
                                    {(m.name || "?").slice(0, 2).toUpperCase()}
                                  </div>
                                  <span className="text-[11px] font-bold text-emerald-700">{m.name || "—"}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black uppercase text-slate-400">Progress</span>
                          <span className="text-[10px] font-black text-slate-500">{p.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${p.progress || 0}%` }} />
                        </div>
                      </div>

                      {/* Tasks summary + expand button */}
                      {ptasks.length > 0 && (
                        <button onClick={() => toggleExpanded(p._id)}
                          className="mt-4 w-full flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition">
                          <span className="flex items-center gap-2">
                            <ListTodo size={14} className="text-purple-500" />
                            {doneTasks}/{ptasks.length} tasks done
                          </span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>

                    {/* Expanded task list */}
                    {isOpen && ptasks.length > 0 && (
                      <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                        <div className="space-y-2">
                          {ptasks.map(t => (
                            <div key={t._id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg whitespace-nowrap ${TASK_STATUS_COLORS[t.status]}`}>{t.status}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{t.title}</p>
                                {(t.assigneeName || t.assignedTo?.name) && (
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    👤 {t.assigneeName || t.assignedTo?.name}
                                    {(t.assigneeName || t.assignedTo?.name)?.toLowerCase() === user?.name?.toLowerCase() && (
                                      <span className="ml-1 text-emerald-500 font-bold">← You</span>
                                    )}
                                  </p>
                                )}
                              </div>
                              {t.dueDate && <span className="text-[10px] text-slate-400 whitespace-nowrap">{t.dueDate.slice(0, 10)}</span>}
                              <span className={`text-[10px] font-black ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}