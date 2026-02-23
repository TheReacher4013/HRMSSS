// import React, { useState } from "react";
// import LatenessClosing from "./LatenessClosing";
// import AttendanceLog from "./AttendanceLog";
// import DailyPresent from "./DailyPresent";
// import MonthlyReport from "./MontlyReport";
// import LeaveReport from "./LeaveReport";

// const AttendanceReport = () => {
//     const [activeTab, setActiveTab] = useState("Attendance report");

//     const tabs = ["Attendance report", "Lateness closing", "Attendance log", "Daily present", "Monthly", "Leave report"];

//     const attendanceData = [
//         { name: "Rahul Sharma", present: 22, absent: 2, late: 1 },
//         { name: "Amit Joshi", present: 20, absent: 3, late: 2 },
//         { name: "Sneha Patil", present: 23, absent: 1, late: 0 },
//     ];

//     const renderPage = () => {
//         switch (activeTab) {
//             case "Attendance report":
//                 return (
//                     <div className="space-y-8 animate-in fade-in duration-500">
//                         {/* Summary Cards with better styling */}
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                             <SummaryCard title="Total Employees" value="03" sub="Active Staff" color="border-indigo-500" textColor="text-indigo-600" />
//                             <SummaryCard title="Total Present" value="65" sub="This Month" color="border-emerald-500" textColor="text-emerald-600" />
//                             <SummaryCard title="Total Absent" value="06" sub="Pending Review" color="border-rose-500" textColor="text-rose-600" />
//                         </div>

//                         {/* DESKTOP & MOBILE WRAPPER */}
//                         <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
//                             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
//                                 <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm">Staff Breakdown</h3>
//                                 <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Export All</button>
//                             </div>

//                             {/* MOBILE VIEW */}
//                             <div className="md:hidden divide-y divide-slate-50">
//                                 {attendanceData.map((emp, index) => (
//                                     <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
//                                         <p className="font-black text-slate-800 text-lg mb-4">{emp.name}</p>
//                                         <div className="grid grid-cols-3 gap-2">
//                                             <div className="bg-emerald-50 p-3 rounded-2xl text-center">
//                                                 <p className="text-[10px] font-bold text-emerald-600 uppercase">Pres.</p>
//                                                 <p className="font-black text-emerald-700">{emp.present}</p>
//                                             </div>
//                                             <div className="bg-rose-50 p-3 rounded-2xl text-center">
//                                                 <p className="text-[10px] font-bold text-rose-600 uppercase">Abs.</p>
//                                                 <p className="font-black text-rose-700">{emp.absent}</p>
//                                             </div>
//                                             <div className="bg-amber-50 p-3 rounded-2xl text-center">
//                                                 <p className="text-[10px] font-bold text-amber-600 uppercase">Late</p>
//                                                 <p className="font-black text-amber-700">{emp.late}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* DESKTOP TABLE */}
//                             <div className="hidden md:block">
//                                 <table className="w-full text-left">
//                                     <thead className="bg-slate-50/50">
//                                         <tr>
//                                             <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
//                                             <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Present</th>
//                                             <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Absent</th>
//                                             <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Late</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-slate-50">
//                                         {attendanceData.map((emp, index) => (
//                                             <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
//                                                 <td className="p-5 font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{emp.name}</td>
//                                                 <td className="p-5 text-center"><span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full font-black text-xs">{emp.present}</span></td>
//                                                 <td className="p-5 text-center"><span className="bg-rose-50 text-rose-600 px-4 py-1 rounded-full font-black text-xs">{emp.absent}</span></td>
//                                                 <td className="p-5 text-center"><span className="bg-amber-50 text-amber-600 px-4 py-1 rounded-full font-black text-xs">{emp.late}</span></td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             case "Lateness closing": return <LatenessClosing />;
//             case "Attendance log": return <AttendanceLog />;
//             case "Daily present": return <DailyPresent />;
//             case "Monthly": return <MonthlyReport />;
//             case "Leave report": return <LeaveReport />;
//             default: return null;
//         }
//     };

//     return (
//         <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-10">
//                     <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Reports Dashboard</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium">Manage and track your organization's attendance pulse.</p>
//                 </div>

//                 {/* Modern Tabs */}
//                 <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`whitespace-nowrap px-6 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300
//                                 ${activeTab === tab ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105" : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300"}`}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>

//                 <div>{renderPage()}</div>
//             </div>
//         </div>
//     );
// };

// const SummaryCard = ({ title, value, sub, color, textColor }) => (
//     <div className={`bg-white p-6 rounded-[32px] shadow-sm border-l-8 ${color} border-t border-r border-b border-slate-100 hover:shadow-md transition-shadow`}>
//         <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
//         <h3 className={`text-4xl font-black ${textColor} mt-2`}>{value}</h3>
//         <p className="text-slate-400 text-[10px] mt-1 font-bold">{sub}</p>
//     </div>
// );

// export default AttendanceReport;



import React, { useState, useEffect } from "react";
import axios from "axios";
import AttendanceLog from "./AttendanceLog";
import DailyPresent from "./DailyPresent";

const AttendanceReport = () => {
    const [activeTab, setActiveTab] = useState("Attendance report");
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    // बैकएंड से सारा डेटा एक बार में लाना
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/attendance");
                setAttendanceData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // Summary कैलकुलेट करना (Real-time)
    const stats = {
        total: attendanceData.length,
        present: attendanceData.filter(d => d.status === "Present").length,
        absent: attendanceData.filter(d => d.status === "Absent").length
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse">LOADING DASHBOARD...</div>;

    const renderPage = () => {
        switch (activeTab) {
            case "Attendance report":
                return (
                    <div className="space-y-8 animate-in fade-in">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <SummaryCard title="Total Records" value={stats.total} sub="All Entries" color="border-indigo-500" textColor="text-indigo-600" />
                            <SummaryCard title="Total Present" value={stats.present} sub="Current Records" color="border-emerald-500" textColor="text-emerald-600" />
                            <SummaryCard title="Total Absent" value={stats.absent} sub="Action Needed" color="border-rose-500" textColor="text-rose-600" />
                        </div>
                        {/* Table View (Asli Data के साथ) */}
                        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {attendanceData.map((emp) => (
                                        <tr key={emp._id}>
                                            <td className="p-5 font-bold text-slate-700">{emp.name}</td>
                                            <td className="p-5 text-center">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${emp.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "Attendance log": return <AttendanceLog logs={attendanceData} />;
            case "Daily present": return <DailyPresent data={attendanceData} />;
            default: return <div className="p-10 text-slate-400 uppercase font-black">Coming Soon...</div>;
        }
    };

    return (
        <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Reports Dashboard</h1>
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                    {["Attendance report", "Attendance log", "Daily present"].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-xs font-black uppercase rounded-2xl ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white text-slate-400"}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                {renderPage()}
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, sub, color, textColor }) => (
    <div className={`bg-white p-6 rounded-[32px] border-l-8 ${color} border border-slate-100`}>
        <p className="text-slate-400 text-[10px] font-black uppercase">{title}</p>
        <h3 className={`text-4xl font-black ${textColor} mt-2`}>{value}</h3>
        <p className="text-slate-400 text-[10px] mt-1 font-bold">{sub}</p>
    </div>
);

export default AttendanceReport;