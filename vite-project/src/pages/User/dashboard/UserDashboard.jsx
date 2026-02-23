import { useState, useEffect } from "react";
import { Clock, Calendar, Briefcase, CheckCircle, AlertCircle } from "lucide-react";

const UserDashboard = () => {
  /* ================= LOGIC ================= */
  const [punchIn, setPunchIn] = useState(localStorage.getItem("punchIn") || "");
  const [punchOut, setPunchOut] = useState(localStorage.getItem("punchOut") || "");
  const [leaves, setLeaves] = useState(JSON.parse(localStorage.getItem("leaves")) || []);
  const [projects, setProjects] = useState(JSON.parse(localStorage.getItem("projects")) || []);

  const [leaveForm, setLeaveForm] = useState({ from: "", to: "", type: "Casual Leave", reason: "" });
  const [projectForm, setProjectForm] = useState({ name: "", status: "In Progress", update: "" });

  const handlePunchIn = () => {
    const time = new Date().toLocaleTimeString();
    setPunchIn(time);
    setPunchOut("");
    localStorage.setItem("punchIn", time);
    localStorage.removeItem("punchOut");
  };

  const handlePunchOut = () => {
    const time = new Date().toLocaleTimeString();
    setPunchOut(time);
    localStorage.setItem("punchOut", time);
  };

  const applyLeave = () => {
    if (!leaveForm.from || !leaveForm.to) return alert("Please select dates");
    const updated = [...leaves, { ...leaveForm, status: "Pending", id: Date.now() }];
    setLeaves(updated);
    localStorage.setItem("leaves", JSON.stringify(updated));
    setLeaveForm({ from: "", to: "", type: "Casual Leave", reason: "" });
  };

  const updateProject = () => {
    if (!projectForm.name) return alert("Please enter project name");
    const updated = [...projects, { ...projectForm, id: Date.now() }];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    setProjectForm({ name: "", status: "In Progress", update: "" });
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafa] p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e2e] tracking-tight">User Dashboard</h1>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">Welcome back! Here's your workspace overview.</p>
        </div>

        {/* SUMMARY STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            title="Attendance Status"
            value={punchIn ? "Present" : "Not Marked"}
            subText={punchIn ? `Punch In: ${punchIn}` : "Waiting for entry"}
            icon={<CheckCircle className={punchIn ? "text-emerald-500" : "text-gray-300"} size={20} />}
          />
          <SummaryCard
            title="Leave Requests"
            value={leaves.length}
            subText="Pending for approval"
            icon={<Calendar className="text-blue-500" size={20} />}
          />
          <SummaryCard
            title="Project Tasks"
            value={projects.length}
            subText="Active contributions"
            icon={<Briefcase className="text-purple-500" size={20} />}
          />
        </div>

        {/* MAIN LAYOUT - Fixes the Overlap issue */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: 4 Units Wide */}
          <div className="w-full lg:col-span-4 flex flex-col gap-6">
            <Section title="Daily Punch" icon={<Clock size={18} />}>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handlePunchIn}
                    className="bg-[#0f2e2e] text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md"
                  >
                    In
                  </button>
                  <button
                    onClick={handlePunchOut}
                    disabled={!punchIn}
                    className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border-2 transition-all active:scale-95 ${punchIn ? 'border-[#0f2e2e] text-[#0f2e2e]' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                  >
                    Out
                  </button>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Punch In Time</span>
                    <span className="text-xs font-bold text-[#0f2e2e]">{punchIn || '--:--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Punch Out Time</span>
                    <span className="text-xs font-bold text-[#0f2e2e]">{punchOut || '--:--'}</span>
                  </div>
                </div>
              </div>
            </Section>

            {/* Dark Brand Card */}
            <div className="w-full bg-[#0f2e2e] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[200px] shadow-xl">
              <div className="relative z-10">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[3px] mb-2">Workspace</p>
                <h2 className="text-2xl font-bold leading-tight">Focus on your <br /> goals today.</h2>
              </div>
              <p className="text-[10px] text-gray-400 relative z-10">All updates are synced in real-time.</p>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-500 rounded-full blur-[60px] opacity-20"></div>
            </div>
          </div>

          {/* RIGHT COLUMN: 8 Units Wide */}
          <div className="w-full lg:col-span-8 flex flex-col gap-6">

            {/* APPLY LEAVE SECTION */}
            <Section title="Request Leave" icon={<Calendar size={18} />}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                <InputGroup label="From Date" type="date" value={leaveForm.from} onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })} />
                <InputGroup label="To Date" type="date" value={leaveForm.to} onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all cursor-pointer"
                  >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Briefly explain the reason for leave..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-sm mt-4 h-24 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none"
              />
              <button
                onClick={applyLeave}
                className="mt-4 bg-[#0f2e2e] text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all w-full sm:w-auto self-start"
              >
                Submit Request
              </button>
            </Section>

            {/* PROJECT UPDATE SECTION */}
            <Section title="Update Work Progress" icon={<Briefcase size={18} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <InputGroup label="Project Name" placeholder="e.g. Website Redesign" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Current Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all cursor-pointer"
                  >
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="What exactly have you achieved today?"
                value={projectForm.update}
                onChange={(e) => setProjectForm({ ...projectForm, update: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-sm mt-4 h-24 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none"
              />
              <button
                onClick={updateProject}
                className="mt-4 bg-[#0f2e2e] text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all w-full sm:w-auto self-start"
              >
                Sync Progress
              </button>
            </Section>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ================= HELPER COMPONENTS (STYLIZED) ================= */

const Section = ({ title, icon, children }) => (
  <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 w-full overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">{icon}</div>
      <h2 className="text-lg font-bold text-[#0f2e2e]">{title}</h2>
    </div>
    {children}
  </div>
);

const SummaryCard = ({ title, value, subText, icon }) => (
  <div className="bg-white rounded-[32px] border border-white/60 p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
    <div className="space-y-1">
      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{title}</p>
      <h2 className="text-xl font-black text-[#0f2e2e]">{value}</h2>
      <p className="text-[10px] font-medium text-gray-500">{subText}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
      {icon}
    </div>
  </div>
);

const InputGroup = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-gray-300"
    />
  </div>
);

export default UserDashboard;