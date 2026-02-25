// import React, { useState } from "react";

// const LeaveReport = () => {
//     const initialLeaves = [
//         { id: 1, name: "Rahul Sharma", dept: "Engineering", type: "Sick Leave", start: "2026-02-20", end: "2026-02-22", status: "Approved" },
//         { id: 2, name: "Sonia Verma", dept: "HR", type: "Casual Leave", start: "2026-02-25", end: "2026-02-26", status: "Pending" },
//         { id: 3, name: "Amit Patel", dept: "Sales", type: "Vacation", start: "2026-03-01", end: "2026-03-10", status: "Rejected" },
//         { id: 4, name: "Priya Das", dept: "Design", type: "Sick Leave", start: "2026-02-19", end: "2026-02-19", status: "Approved" },
//     ];

//     const [searchTerm, setSearchTerm] = useState("");

//     const filteredLeaves = initialLeaves.filter(leave =>
//         leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         leave.type.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const getStatusStyles = (status) => {
//         switch (status) {
//             case "Approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
//             case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
//             case "Rejected": return "bg-rose-100 text-rose-700 border-rose-200";
//             default: return "bg-slate-100 text-slate-700 border-slate-200";
//         }
//     };

//     return (
//         <div className="p-3 md:p-6 bg-slate-50 min-h-screen">
//             <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

//                 {/* Header */}
//                 <div className="p-5 md:p-8 border-b border-slate-100 flex flex-col gap-6">
//                     <div>
//                         <h2 className="text-xl md:text-2xl font-black text-slate-800">Leave Report</h2>
//                         <p className="text-sm text-slate-500">Manage and monitor staff leave lifecycle</p>
//                     </div>

//                     <div className="relative w-full md:w-80">
//                         <input
//                             type="text"
//                             placeholder="Search by name or type..."
//                             className="pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 {/* ================= MOBILE VIEW ================= */}
//                 <div className="block md:hidden p-4 space-y-4">
//                     {filteredLeaves.length > 0 ? (
//                         filteredLeaves.map((leave) => (
//                             <div key={leave.id} className="border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">

//                                 <div>
//                                     <p className="text-sm font-bold text-slate-800">{leave.name}</p>
//                                     <p className="text-xs text-indigo-400">ID: LVE-{leave.id}00</p>
//                                 </div>

//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-slate-500">Department:</span>
//                                     <span>{leave.dept}</span>
//                                 </div>

//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-slate-500">Type:</span>
//                                     <span className="font-medium">{leave.type}</span>
//                                 </div>

//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-slate-500">Duration:</span>
//                                     <span>{leave.start} → {leave.end}</span>
//                                 </div>

//                                 <div className="flex justify-between items-center">
//                                     <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyles(leave.status)}`}>
//                                         {leave.status}
//                                     </span>

//                                     <button className="text-xs font-bold text-indigo-600 underline">
//                                         Details
//                                     </button>
//                                 </div>

//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-center py-10">
//                             <p className="text-slate-500 font-bold">No Applications Found</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* ================= DESKTOP TABLE ================= */}
//                 <div className="hidden md:block">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="text-xs uppercase font-bold text-slate-400 bg-slate-50">
//                                 <th className="p-5">Sl</th>
//                                 <th className="p-5">Employee</th>
//                                 <th className="p-5">Department</th>
//                                 <th className="p-5 text-center">Type</th>
//                                 <th className="p-5 text-center">Duration</th>
//                                 <th className="p-5">Status</th>
//                                 <th className="p-5 text-right">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {filteredLeaves.map((leave, index) => (
//                                 <tr key={leave.id} className="hover:bg-slate-50 transition">
//                                     <td className="p-5 text-xs font-bold text-slate-300">{index + 1}</td>
//                                     <td className="p-5 font-bold text-sm">{leave.name}</td>
//                                     <td className="p-5 text-sm">{leave.dept}</td>
//                                     <td className="p-5 text-center text-sm">{leave.type}</td>
//                                     <td className="p-5 text-center text-sm">{leave.start} → {leave.end}</td>
//                                     <td className="p-5">
//                                         <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyles(leave.status)}`}>
//                                             {leave.status}
//                                         </span>
//                                     </td>
//                                     <td className="p-5 text-right">
//                                         <button className="text-xs font-bold text-indigo-600 underline">
//                                             Details
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Footer */}
//                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
//                     <span className="text-xs font-bold text-slate-400">
//                         Total Applications: {filteredLeaves.length}
//                     </span>
//                     <div className="flex w-full md:w-auto gap-2">
//                         <button className="flex-1 md:flex-none bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100">
//                             Download PDF
//                         </button>
//                         <button className="flex-1 md:flex-none bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-indigo-700">
//                             Export Excel
//                         </button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default LeaveReport;



import React, { useState } from "react";

const LeaveReport = () => {
    const initialLeaves = [
        { id: 1, name: "Rahul Sharma", dept: "Engineering", type: "Sick Leave", start: "2026-02-20", end: "2026-02-22", status: "Approved" },
        { id: 2, name: "Sonia Verma", dept: "HR", type: "Casual Leave", start: "2026-02-25", end: "2026-02-26", status: "Pending" },
        { id: 3, name: "Amit Patel", dept: "Sales", type: "Vacation", start: "2026-03-01", end: "2026-03-10", status: "Rejected" },
        { id: 4, name: "Priya Das", dept: "Design", type: "Sick Leave", start: "2026-02-19", end: "2026-02-19", status: "Approved" },
    ];

    const [searchTerm, setSearchTerm] = useState("");

    const filteredLeaves = initialLeaves.filter(leave =>
        leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Rejected": return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="bg-white shadow-sm rounded-[40px] border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Leave Lifecycle</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Review and manage employee time-off requests.</p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search leave type or name..."
                            className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="border border-slate-100 rounded-[32px] overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-50">
                                    <tr>
                                        {["Employee", "Department", "Leave Type", "Duration", "Status", ""].map((h) => (
                                            <th key={h} className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLeaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <div className="font-bold text-slate-700">{leave.name}</div>
                                                <div className="text-[10px] font-black text-slate-300 font-mono">LVE-{leave.id}00</div>
                                            </td>
                                            <td className="p-5 text-sm font-medium text-slate-500">{leave.dept}</td>
                                            <td className="p-5">
                                                <span className="text-sm font-bold text-slate-700">{leave.type}</span>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-[11px] font-black text-indigo-500 font-mono">
                                                    {leave.start} <span className="text-slate-300 mx-1">→</span> {leave.end}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyles(leave.status)}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline px-4">Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-slate-50">
                            {filteredLeaves.map((leave) => (
                                <div key={leave.id} className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-black text-slate-800">{leave.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{leave.dept}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyles(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                                        <p className="text-xs font-bold text-slate-600">{leave.type}</p>
                                        <p className="text-[10px] font-black text-indigo-600 font-mono">{leave.start}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredLeaves.length} applications</p>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Download PDF</button>
                            <button className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Export Excel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveReport;