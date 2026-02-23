// import React, { useState } from "react";

// const AdhocReport = () => {
//     const initialData = [
//         { id: 1, name: "Rahul", date: "2026-02-01", status: "Present" },
//         { id: 2, name: "Sonia", date: "2026-02-02", status: "Absent" },
//         { id: 3, name: "Amit", date: "2026-02-01", status: "Late" },
//         { id: 4, name: "Priya", date: "2026-02-03", status: "Present" },
//         { id: 5, name: "Vikram", date: "2026-02-02", status: "Present" },
//     ];

//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [filteredData, setFilteredData] = useState(initialData);

//     const handleGenerate = () => {
//         if (!startDate || !endDate) {
//             alert("Please select both dates!");
//             return;
//         }
//         const filtered = initialData.filter((item) => {
//             const itemDate = new Date(item.date);
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             return itemDate >= start && itemDate <= end;
//         });
//         setFilteredData(filtered);
//     };

//     const handleClear = () => {
//         setStartDate("");
//         setEndDate("");
//         setFilteredData(initialData);
//     };

//     const getStatusStyle = (status) => {
//         switch (status) {
//             case "Present": return "bg-emerald-50 text-emerald-600 border-emerald-100";
//             case "Absent": return "bg-rose-50 text-rose-600 border-rose-100";
//             case "Late": return "bg-amber-50 text-amber-600 border-amber-100";
//             default: return "bg-slate-50 text-slate-600 border-slate-100";
//         }
//     };

//     return (
//         <div className="animate-in fade-in duration-500">
//             <div className="bg-white shadow-sm rounded-[32px] border border-slate-100 overflow-hidden">
//                 {/* Header */}
//                 <div className="p-8 border-b border-slate-50 bg-slate-50/20">
//                     <h2 className="text-2xl font-black text-slate-800 tracking-tight">Adhoc Report</h2>
//                     <p className="text-slate-500 text-sm font-medium mt-1">Generate custom date-range attendance insights.</p>
//                 </div>

//                 <div className="p-6 md:p-8">
//                     {/* Filters Section */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 items-end">
//                         <div className="space-y-2">
//                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
//                             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
//                         </div>
//                         <div className="space-y-2">
//                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
//                             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
//                         </div>
//                         <button onClick={handleGenerate} className="bg-indigo-600 text-white font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Generate Report</button>
//                         <button onClick={handleClear} className="bg-slate-100 text-slate-600 font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Reset</button>
//                     </div>

//                     {/* TABLE & CARDS WRAPPER */}
//                     <div className="border border-slate-100 rounded-3xl overflow-hidden">
//                         {/* Desktop View */}
//                         <div className="hidden md:block">
//                             <table className="w-full text-left">
//                                 <thead className="bg-slate-50/50 border-b border-slate-50">
//                                     <tr>
//                                         {["Employee Name", "Date", "Status"].map((h) => (
//                                             <th key={h} className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-50">
//                                     {filteredData.map((item) => (
//                                         <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
//                                             <td className="p-5 font-bold text-slate-700">{item.name}</td>
//                                             <td className="p-5 text-sm font-medium text-slate-400 font-mono">{item.date}</td>
//                                             <td className="p-5">
//                                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>{item.status}</span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Mobile View */}
//                         <div className="md:hidden divide-y divide-slate-50">
//                             {filteredData.length > 0 ? (
//                                 filteredData.map((item, index) => (
//                                     <div key={item.id} className="p-6 bg-white space-y-3">
//                                         <div className="flex justify-between items-center">
//                                             <span className="font-black text-slate-800">#{index + 1} {item.name}</span>
//                                             <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>{item.status}</span>
//                                         </div>
//                                         <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Report Date: <span className="text-slate-600">{item.date}</span></p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="p-10 text-center text-slate-400 font-bold text-sm">No records found.</div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer Status */}
//                 <div className="p-5 bg-slate-50/50 border-t border-slate-50 flex justify-center">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Result: {filteredData.length}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdhocReport;



import React, { useState, useEffect } from "react";
import axios from "axios";

const AdhocReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allData, setAllData] = useState([]); // बैकएंड से आया सारा डेटा
    const [filteredData, setFilteredData] = useState([]); // फिल्टर किया हुआ डेटा
    const [loading, setLoading] = useState(true);

    // 1. बैकएंड से अटेंडेंस डेटा लोड करना
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                // अपनी बैकएंड URL यहाँ चेक करें
                const response = await axios.get("http://localhost:5000/api/attendance");
                setAllData(response.data);
                setFilteredData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Backend Error:", err);
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    // 2. डेट के हिसाब से फिल्टर करना (Client-side filtering)
    const handleGenerate = () => {
        if (!startDate || !endDate) {
            alert("Please select both dates!");
            return;
        }
        const filtered = allData.filter((item) => {
            const itemDate = item.date; // "YYYY-MM-DD" format expected
            return itemDate >= startDate && itemDate <= endDate;
        });
        setFilteredData(filtered);
    };

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        setFilteredData(allData);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Present": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Absent": return "bg-rose-50 text-rose-600 border-rose-100";
            case "Late": return "bg-amber-50 text-amber-600 border-amber-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">CONNECTING TO DATABASE...</div>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="bg-white shadow-sm rounded-[32px] border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 bg-slate-50/20">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Adhoc Attendance Report</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Real-time data from MongoDB</p>
                </div>

                <div className="p-6 md:p-8">
                    {/* Filters Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 items-end">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
                        </div>
                        <button onClick={handleGenerate} className="bg-indigo-600 text-white font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Filter Now</button>
                        <button onClick={handleClear} className="bg-slate-100 text-slate-600 font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Reset All</button>
                    </div>

                    {/* Table View */}
                    <div className="border border-slate-100 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</th>
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5 font-bold text-slate-700">{item.name}</td>
                                            <td className="p-5 text-sm font-medium text-slate-400 font-mono">{item.date}</td>
                                            <td className="p-5">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-10 text-center text-slate-400 font-bold">No records found for these dates.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-5 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Records: {filteredData.length}</p>
                </div>
            </div>
        </div>
    );
};

export default AdhocReport;