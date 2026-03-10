import { useState, useEffect, useCallback } from "react";
import {
  Clock, Calendar, Briefcase, LogIn, LogOut, Loader2, Bell,
  TrendingUp, Award, Wallet, Users, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, Timer, MapPin, Sun, Moon, Sunset,
  FileText, DollarSign, Activity
} from "lucide-react";
import {
  attendanceAPI, leaveAPI, projectAPI,
  meetingAPI, noticeAPI, awardAPI, payrollAPI
} from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

/* ── Greeting based on time ─────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", icon: <Sun size={18} className="text-yellow-400" /> };
  if (h < 17) return { text: "Good Afternoon", icon: <Sunset size={18} className="text-orange-400" /> };
  return { text: "Good Evening", icon: <Moon size={18} className="text-indigo-400" /> };
};

/* ── Live Clock ─────────────────────────────────────── */
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right shrink-0">
      <p className="text-lg sm:text-2xl font-black text-[#0f2e2e] tabular-nums tracking-tight leading-none">
        {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1">
        {now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
      </p>
    </div>
  );
};

/* ── Stat Pill ──────────────────────────────────────── */
const StatPill = ({ label, value, icon, color, bg, sub }) => (
  <div className={`${bg} rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3`}>
    <div className={`p-2 sm:p-2.5 bg-white rounded-xl shadow-sm ${color} shrink-0`}>{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[1px] sm:tracking-[2px] text-gray-500 truncate">{label}</p>
      <p className={`text-base sm:text-2xl font-black ${color} leading-tight truncate`}>{value ?? "—"}</p>
      {sub && <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 truncate">{sub}</p>}
    </div>
  </div>
);

/* ── Leave status badge ─────────────────────────────── */
const LeaveBadge = ({ status }) => {
  const map = {
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-600",
    Pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

/* ── Section Card ───────────────────────────────────── */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[20px] sm:rounded-[24px] border border-gray-100 shadow-sm p-4 sm:p-5 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, badge }) => (
  <div className="flex items-center justify-between mb-3 sm:mb-4">
    <h2 className="font-black text-[#0f2e2e] flex items-center gap-2 text-[11px] sm:text-sm">
      {icon} {title}
    </h2>
    {badge && <span className="text-[9px] sm:text-[10px] font-black text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 rounded-xl">{badge}</span>}
  </div>
);

/* ═══════════════════════════════════════════════════ */
const UserDashboard = () => {
  const { user } = useAuth();
  const greeting = getGreeting();

  /* State */
  const [todayRecord, setTodayRecord] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [awards, setAwards] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [attRes, leaveRes, projRes, meetRes, noticeRes, awardRes, payRes] = await Promise.allSettled([
        attendanceAPI.getToday(),
        leaveAPI.getAll(),
        projectAPI.getAll(),
        meetingAPI.getAll(),
        noticeAPI.getAll(),
        awardAPI.getAll(),
        payrollAPI.getAll(),
      ]);
      if (attRes.status === "fulfilled") setTodayRecord(attRes.value.data);
      if (leaveRes.status === "fulfilled") setLeaves(leaveRes.value.data || []);
      if (projRes.status === "fulfilled") setProjects(projRes.value.data || []);
      if (meetRes.status === "fulfilled") setMeetings(meetRes.value.data || []);
      if (noticeRes.status === "fulfilled") setNotices(noticeRes.value.data || []);
      if (awardRes.status === "fulfilled") setAwards(awardRes.value.data || []);
      if (payRes.status === "fulfilled") setPayroll(payRes.value.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* Derived */
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
  const approvedLeaves = leaves.filter(l => l.status === "Approved").length;
  const activeProjects = projects.filter(p => p.status !== "Completed");
  const today = new Date().toISOString().slice(0, 10);
  const upcomingMeetings = meetings.filter(m => m.date?.slice(0, 10) >= today && m.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const latestNotices = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const myAwards = awards.filter(a => a.employeeName === user?.name || a.employee?.name === user?.name);
  const latestPayroll = [...payroll].sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month))[0];

  const hoursWorked = () => {
    if (!todayRecord?.checkIn) return null;
    const inn = new Date(`2000-01-01T${todayRecord.checkIn}`);
    const out = todayRecord.checkOut ? new Date(`2000-01-01T${todayRecord.checkOut}`) : new Date();
    const diff = (out - inn) / 3600000;
    return diff > 0 ? diff.toFixed(1) : null;
  };

  const handlePunchIn = async () => {
    setPunchLoading(true);
    try {
      const res = await attendanceAPI.punchIn();
      setTodayRecord(res.data);
      showMsg("Punched In ✅");
    } catch (err) { showMsg(err.message, "error"); }
    finally { setPunchLoading(false); }
  };

  const handlePunchOut = async () => {
    setPunchLoading(true);
    try {
      const res = await attendanceAPI.punchOut();
      setTodayRecord(res.data);
      showMsg("Punched Out ✅");
    } catch (err) { showMsg(err.message, "error"); }
    finally { setPunchLoading(false); }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await leaveAPI.create(leaveForm);
      setLeaves([res.data, ...leaves]);
      setLeaveForm({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
      setShowLeaveForm(false);
      showMsg("Leave Applied ✅");
    } catch (err) { showMsg(err.message, "error"); }
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-[#f0f4f4] p-3 sm:p-5 pt-[72px] sm:pt-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {greeting.icon}
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{greeting.text}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-[#0f2e2e] tracking-tight truncate leading-tight">
              {user?.name || "User"}
            </h1>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 font-medium truncate">{user?.position || "Employee"} • {user?.department || "Team"}</p>
          </div>
          <LiveClock />
        </div>

        {/* ── MESSAGE ────────────────────────────────────── */}
        {msg.text && (
          <div className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" && !msg.text.includes("employee") && !msg.text.includes("profile") ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
            <CheckCircle2 size={15} /> {msg.text}
          </div>
        )}

        {/* ── QUICK STATS ROW ────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatPill
            label="Today"
            value={todayRecord ? (todayRecord.checkOut ? "Done" : "Present") : "Absent"}
            icon={<Activity size={16} />}
            color={todayRecord ? "text-emerald-600" : "text-red-500"}
            bg={todayRecord ? "bg-emerald-50" : "bg-red-50"}
            sub={hoursWorked() ? `${hoursWorked()}h worked` : todayRecord?.checkIn || "Not marked"}
          />
          <StatPill
            label="Leaves"
            value={leaves.length}
            icon={<Calendar size={16} />}
            color="text-blue-600"
            bg="bg-blue-50"
            sub={`${approvedLeaves} approved • ${pendingLeaves} pending`}
          />
          <StatPill
            label="Projects"
            value={activeProjects.length}
            icon={<Briefcase size={16} />}
            color="text-purple-600"
            bg="bg-purple-50"
            sub={`${projects.filter(p => p.status === "Completed").length} completed`}
          />
          <StatPill
            label="Meetings"
            value={upcomingMeetings.length}
            icon={<Users size={16} />}
            color="text-orange-600"
            bg="bg-orange-50"
            sub="upcoming"
          />
        </div>

        {/* ── ROW 2: Punch Card + Salary + Awards ────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">

          {/* Punch Card */}
          <div className="bg-[#0f2e2e] rounded-[24px] p-4 sm:p-5 text-white relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-emerald-400 mb-0.5">Attendance</p>
              <h3 className="font-black text-base sm:text-lg mb-3">
                {todayRecord ? (todayRecord.checkOut ? "Day Complete 🎉" : "Currently In 🟢") : "Not Marked Yet"}
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <p className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Check In</p>
                  <p className="font-black text-emerald-300 text-sm">{todayRecord?.checkIn || "—"}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <p className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Check Out</p>
                  <p className="font-black text-rose-300 text-sm">{todayRecord?.checkOut || "—"}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button onClick={handlePunchIn}
                disabled={punchLoading || !!todayRecord}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition disabled:opacity-40">
                {punchLoading ? <Loader2 size={13} className="animate-spin" /> : <LogIn size={13} />} In
              </button>
              <button onClick={handlePunchOut}
                disabled={punchLoading || !todayRecord || !!todayRecord?.checkOut}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition disabled:opacity-40">
                {punchLoading ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />} Out
              </button>
            </div>
          </div>

          {/* Latest Salary */}
          <Card>
            <SectionTitle icon={<Wallet size={15} className="text-emerald-600" />} title="My Salary" />
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 size={20} className="animate-spin text-gray-300" /></div>
            ) : !latestPayroll ? (
              <div className="text-center py-6">
                <DollarSign size={28} className="mx-auto mb-2 text-gray-200" />
                <p className="text-xs text-gray-400">No payroll record yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-emerald-50 rounded-2xl px-4 py-3">
                  <span className="text-xs font-bold text-gray-500">Net Salary</span>
                  <span className="text-lg font-black text-emerald-600">₹{latestPayroll.netSalary?.toLocaleString("en-IN")}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-xl px-3 py-2 truncate">
                    <p className="text-gray-400 text-[9px] uppercase font-black">Month</p>
                    <p className="font-bold text-[#0f2e2e] truncate">{MONTHS[(latestPayroll.month || 1) - 1]} {latestPayroll.year}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-3 py-2 truncate">
                    <p className="text-gray-400 text-[9px] uppercase font-black">Status</p>
                    <p className={`font-bold ${latestPayroll.status === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                      {latestPayroll.status}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* My Awards */}
          <Card>
            <SectionTitle icon={<Award size={15} className="text-yellow-500" />} title="My Awards" badge={`${myAwards.length} total`} />
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {myAwards.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-5">No awards yet</p>
              ) : myAwards.slice(0, 3).map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-yellow-50 rounded-2xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm shrink-0">🏆</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#0f2e2e] truncate">{a.awardType || a.type}</p>
                    <p className="text-[10px] text-gray-400 truncate">{a.date?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── ROW 3: Leave + Projects ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

          {/* Leave */}
          <Card>
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="font-black text-[#0f2e2e] flex items-center gap-2 text-[11px] sm:text-sm">
                <Calendar size={14} className="text-blue-500" /> Leave Applications
              </h2>
              <button onClick={() => setShowLeaveForm(!showLeaveForm)}
                className={`text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${showLeaveForm ? "bg-gray-100 text-gray-500" : "bg-[#0f2e2e] text-white hover:bg-emerald-700"}`}>
                {showLeaveForm ? "✕ Cancel" : "+ Apply"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {[
                { label: "Total", val: leaves.length, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Approved", val: approvedLeaves, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending", val: pendingLeaves, color: "text-amber-600", bg: "bg-amber-50" },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-2 text-center`}>
                  <p className={`text-lg sm:text-xl font-black ${s.color}`}>{s.val}</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>

            {showLeaveForm ? (
              <form onSubmit={handleLeaveSubmit} className="space-y-2.5">
                <select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none">
                  <option>Casual Leave</option><option>Annual Leave</option><option>Medical Leave</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={leaveForm.startDate} onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none" />
                  <input type="date" required value={leaveForm.endDate} onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none" />
                </div>
                <input value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Reason" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none" />
                <button type="submit" className="w-full bg-[#0f2e2e] text-white py-2.5 rounded-xl text-sm font-bold">Submit</button>
              </form>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {leaves.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">No applications</p> :
                  leaves.slice(0, 5).map((l, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 px-3 bg-gray-50 rounded-2xl">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate">{l.type}</p>
                        <p className="text-[10px] text-gray-400">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                      </div>
                      <LeaveBadge status={l.status} />
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Projects */}
          <Card>
            <SectionTitle icon={<Briefcase size={15} className="text-purple-500" />} title="My Projects" badge={`${activeProjects.length} active`} />
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {projects.length === 0 ? <p className="text-center text-xs text-gray-400 py-10">No projects</p> :
                projects.map((p, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 mr-2"><p className="text-xs font-black truncate">{p.title}</p></div>
                      <span className="text-[10px] font-black text-gray-500 shrink-0">{p.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* ── ROW 4: Meetings + Notices ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card>
            <SectionTitle icon={<Users size={15} className="text-orange-500" />} title="Upcoming Meetings" badge={`${upcomingMeetings.length}`} />
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {upcomingMeetings.length === 0 ? <p className="text-center text-xs text-gray-400 py-4">No meetings</p> :
                upcomingMeetings.map((m, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-2xl border-l-4 border-orange-200">
                    <p className="text-xs font-black truncate">{m.title}</p>
                    <p className="text-[10px] text-gray-400">{m.time} • {m.date?.slice(0, 10)}</p>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<Bell size={15} className="text-red-500" />} title="Notice Board" />
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {latestNotices.length === 0 ? <p className="text-center text-xs text-gray-400 py-4">No notices</p> :
                latestNotices.map((n, i) => (
                  <div key={i} className="p-3 bg-red-50/50 rounded-2xl border border-red-100">
                    <p className="text-xs font-black truncate">{n.title || n.description}</p>
                    <p className="text-[10px] text-gray-400">{n.date?.slice(0, 10)}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* ── ROW 5: Module Summary Bar ───────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Attendance", main: todayRecord ? "Active" : "Absent", color: "text-emerald-600", bg: "bg-emerald-50", icon: <Activity size={14} /> },
            { label: "Leave", main: `${leaves.length} Apps`, color: "text-blue-600", bg: "bg-blue-50", icon: <FileText size={14} /> },
            { label: "Projects", main: `${activeProjects.length} Active`, color: "text-purple-600", bg: "bg-purple-50", icon: <TrendingUp size={14} /> },
            { label: "Salary", main: `₹${latestPayroll?.netSalary?.toLocaleString("en-IN") || '0'}`, color: "text-rose-600", bg: "bg-rose-50", icon: <Wallet size={14} /> },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 border border-white min-w-0`}>
              <div className={`p-1.5 sm:p-2 bg-white rounded-xl ${item.color} shrink-0`}>{item.icon}</div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[8px] sm:text-[9px] font-black uppercase text-gray-400 truncate leading-none mb-0.5">{item.label}</p>
                <p className={`text-[10px] sm:text-xs font-black ${item.color} truncate leading-tight`}>{item.main}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;