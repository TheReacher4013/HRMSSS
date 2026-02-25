import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { attendanceAPI, employeeAPI } from "../../services/api";
import { Search, Loader2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

const Tab = ({ label, to, active }) => (
  <Link to={to}
    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50"
      }`}>
    {label}
  </Link>
);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const STATUS_COLOR = { Present: "bg-emerald-500", Absent: "bg-red-400", Late: "bg-orange-400", "Half Day": "bg-yellow-400", Holiday: "bg-blue-400" };

const MonthlyAttendance = () => {
  const location = useLocation();
  const today = new Date();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empLoading, setEmpLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedEmp, setSelectedEmp] = useState("all");

  // Load employees
  useEffect(() => {
    employeeAPI.getAll().then(res => {
      setEmployees(res.data);
    }).catch(console.error).finally(() => setEmpLoading(false));
  }, []);

  // Load attendance when month/year/emp changes
  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear, selectedEmp]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      let params = `?month=${selectedMonth}&year=${selectedYear}`;
      if (selectedEmp !== "all") params += `&employee=${selectedEmp}`;
      const res = await attendanceAPI.getAll(params);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filter employees
  const filteredEmps = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId?.includes(search)
  );

  // Map attendance by employeeId + day
  const getStatus = (empId, day) => {
    const rec = attendance.find(a => {
      const d = new Date(a.date);
      return a.employee?._id === empId && d.getDate() === day;
    });
    if (!rec) return null;
    return rec.status || (rec.checkIn ? "Present" : null);
  };

  const getCheckIn = (empId, day) => {
    const rec = attendance.find(a => {
      const d = new Date(a.date);
      return a.employee?._id === empId && d.getDate() === day;
    });
    return rec?.checkIn || null;
  };

  // Summary for each employee
  const getSummary = (empId) => {
    const empAtt = attendance.filter(a => a.employee?._id === empId);
    return {
      present: empAtt.filter(a => a.checkIn).length,
      absent: daysInMonth - empAtt.filter(a => a.checkIn).length,
      late: empAtt.filter(a => a.status === "Late").length,
    };
  };

  return (
    <div className="min-h-screen bg-[#f4f1fb] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-indigo-700">Attendance Management</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage all employee attendance records</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <Tab label="Attendance Form" to="/attendance/form" active={location.pathname === "/attendance/form"} />
          <Tab label="Monthly Attendance" to="/attendance/monthly" active={location.pathname === "/attendance/monthly"} />
          <Tab label="Missing Attendance" to="/attendance/missing" active={location.pathname === "/attendance/missing"} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-4 items-end">

            {/* Month */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Month</label>
              <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 outline-none focus:ring-2 ring-indigo-200 font-semibold">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Year</label>
              <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 outline-none focus:ring-2 ring-indigo-200 font-semibold">
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Employee filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employee</label>
              <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 outline-none focus:ring-2 ring-indigo-200 font-semibold min-w-[180px]">
                <option value="all">All Employees</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 ring-indigo-200" />
              </div>
            </div>

          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_COLOR).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
              <span className="text-xs font-medium text-slate-600">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-500">Not Marked</span>
          </div>
        </div>

        {loading || empLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
          </div>
        ) : filteredEmps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 shadow-sm">
            No employees found
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEmps.map(emp => {
              const summary = getSummary(emp._id);
              return (
                <div key={emp._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Employee Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-400">ID: {emp.employeeId} • {emp.position || "Employee"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                        <p className="text-lg font-black text-emerald-700">{summary.present}</p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Present</p>
                      </div>
                      <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                        <p className="text-lg font-black text-red-600">{summary.absent}</p>
                        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Absent</p>
                      </div>
                      <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                        <p className="text-lg font-black text-orange-600">{summary.late}</p>
                        <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">Late</p>
                      </div>
                    </div>
                  </div>

                  {/* Day-wise grid */}
                  <div className="p-4 overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                      {days.map(day => {
                        const status = getStatus(emp._id, day);
                        const checkIn = getCheckIn(emp._id, day);
                        const dateObj = new Date(selectedYear, selectedMonth - 1, day);
                        const dayName = dateObj.toLocaleDateString("en-IN", { weekday: "short" });
                        const isSunday = dateObj.getDay() === 0;
                        const isSaturday = dateObj.getDay() === 6;
                        const isWeekend = isSunday || isSaturday;
                        const isToday = dateObj.toDateString() === new Date().toDateString();

                        return (
                          <div key={day} title={checkIn ? `Check-in: ${checkIn}` : "Not marked"}
                            className={`flex flex-col items-center gap-1 w-9 ${isToday ? "opacity-100" : "opacity-90"}`}>
                            <span className={`text-[9px] font-bold uppercase ${isWeekend ? "text-indigo-400" : "text-slate-400"}`}>
                              {dayName}
                            </span>
                            <span className={`text-[10px] font-black ${isToday ? "text-indigo-600" : "text-slate-600"}`}>
                              {day}
                            </span>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-black transition-all
                              ${isWeekend ? "bg-slate-100 text-slate-400" :
                                status === "Present" ? "bg-emerald-500" :
                                  status === "Late" ? "bg-orange-400" :
                                    status === "Half Day" ? "bg-yellow-400" :
                                      status === "Absent" ? "bg-red-400" :
                                        status === "Holiday" ? "bg-blue-400" :
                                          "bg-slate-100"}`}>
                              {isWeekend ? "W" :
                                status === "Present" ? "P" :
                                  status === "Late" ? "L" :
                                    status === "Half Day" ? "H" :
                                      status === "Absent" ? "A" :
                                        status === "Holiday" ? "H" : "—"}
                            </div>
                          </div>
                        );
                      })}
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

export default MonthlyAttendance;
