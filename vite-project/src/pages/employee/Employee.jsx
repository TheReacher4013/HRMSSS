// import React, { useState, useMemo } from "react";
// import {
//   Pencil,
//   Trash2,
//   Plus,
//   Filter,
//   ArrowUpDown,
//   Search,
//   Users,
//   RotateCcw,
//   Mail,
//   Phone,
//   UserCheck
// } from "lucide-react";

// const EmployeeList = () => {
//   const [search, setSearch] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

//   const employees = [
//     { id: "000031", name: "Babara Patel", email: "babra@gmail.com", mobile: "25670268239", status: "Active" },
//     { id: "000030", name: "Test Candidate", email: "test@test.com", mobile: "12365489985", status: "Active" },
//     { id: "000029", name: "Monalisa Subudhi", email: "monalisa@gmail.com", mobile: "7787890451", status: "Inactive" },
//     { id: "000028", name: "Mohmed Afif", email: "afif@gmail.com", mobile: "26523333", status: "Active" },
//     { id: "000027", name: "Rahul Sharma", email: "rahul@gmail.com", mobile: "9876543210", status: "Active" },
//     { id: "000026", name: "Priya Verma", email: "priya@gmail.com", mobile: "9123456789", status: "Inactive" },
//     { id: "000025", name: "Amit Kulkarni", email: "amit@gmail.com", mobile: "9988776655", status: "Active" },
//     { id: "000024", name: "Sneha Patil", email: "sneha@gmail.com", mobile: "8899776655", status: "Inactive" },
//   ];

//   const filteredData = useMemo(() => {
//     let data = [...employees];
//     if (search) data = data.filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()));
//     if (statusFilter !== "All") data = data.filter((emp) => emp.status === statusFilter);
//     if (sortConfig.key) {
//       data.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return data;
//   }, [search, statusFilter, sortConfig]);

//   const totalPages = Math.ceil(filteredData.length / entries);
//   const startIndex = (currentPage - 1) * entries;
//   const paginatedData = filteredData.slice(startIndex, startIndex + entries);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   return (
//     <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-xl">
//                 <Users className="text-emerald-700" size={24} />
//               </div>
//               Employee Database
//             </h1>
//             <p className="text-slate-500 text-sm font-medium mt-1">Manage your workforce and their status</p>
//           </div>
//           <div className="flex gap-2 w-full md:w-auto">
//             <button
//               onClick={() => setShowFilter(!showFilter)}
//               className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${showFilter ? "bg-slate-800 text-white border-slate-800 shadow-lg" : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 shadow-sm"
//                 }`}
//             >
//               <Filter size={18} /> Filter
//             </button>
//             <button className="flex-1 md:flex-none bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95">
//               <Plus size={18} /> Add Employee
//             </button>
//           </div>
//         </div>

//         {/* FILTER PANEL */}
//         {showFilter && (
//           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row items-end gap-4 animate-in slide-in-from-top-4 duration-300">
//             <div className="w-full sm:w-64">
//               <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-1 block">Status Filter</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-emerald-50"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//             <button
//               onClick={() => { setStatusFilter("All"); setSearch(""); }}
//               className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-colors"
//             >
//               <RotateCcw size={16} /> Reset
//             </button>
//           </div>
//         )}

//         {/* SEARCH & ENTRIES */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-2">
//           <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
//             Show
//             <select
//               value={entries}
//               onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1); }}
//               className="bg-white border border-slate-100 px-2 py-1 rounded-lg text-slate-700 outline-none shadow-sm"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={15}>15</option>
//             </select>
//             entries
//           </div>

//           <div className="relative w-full sm:w-80 group">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name..."
//               className="w-full bg-white border border-slate-100 px-11 py-3 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-4 ring-emerald-50 transition-all"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* DESKTOP TABLE */}
//         <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
//           <table className="min-w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100">
//                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Sl</th>
//                 <th onClick={() => handleSort("id")} className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 cursor-pointer hover:text-emerald-600 transition-colors">
//                   Employee ID <ArrowUpDown size={12} className="inline ml-1" />
//                 </th>
//                 <th onClick={() => handleSort("name")} className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 cursor-pointer hover:text-emerald-600 transition-colors">
//                   Name <ArrowUpDown size={12} className="inline ml-1" />
//                 </th>
//                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Contacts</th>
//                 <th onClick={() => handleSort("status")} className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center cursor-pointer hover:text-emerald-600 transition-colors">
//                   Status <ArrowUpDown size={12} className="inline ml-1" />
//                 </th>
//                 <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginatedData.map((emp, index) => (
//                 <tr key={emp.id} className="hover:bg-slate-50/50 transition-all group">
//                   <td className="px-6 py-5 text-sm font-bold text-slate-300">
//                     {String(startIndex + index + 1).padStart(2, '0')}
//                   </td>
//                   <td className="px-6 py-5 text-sm font-black text-slate-500">#{emp.id}</td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
//                         {emp.name.charAt(0)}
//                       </div>
//                       <span className="text-sm font-bold text-slate-700">{emp.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
//                         <Mail size={12} className="text-slate-300" /> {emp.email}
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
//                         <Phone size={12} className="text-slate-300" /> {emp.mobile}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 text-center">
//                     <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${emp.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
//                       }`}>
//                       <div className={`w-1 h-1 rounded-full ${emp.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
//                       {emp.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"><Pencil size={16} /></button>
//                       <button className="p-2.5 bg-white border border-slate-100 text-red-600 rounded-xl hover:border-red-200 hover:shadow-sm transition-all"><Trash2 size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE CARDS */}
//         <div className="md:hidden space-y-4">
//           {paginatedData.map((emp) => (
//             <div key={emp.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">
//                     {emp.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-slate-800">{emp.name}</h3>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: #{emp.id}</p>
//                   </div>
//                 </div>
//                 <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${emp.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
//                   }`}>
//                   {emp.status}
//                 </span>
//               </div>
//               <div className="space-y-2 mb-6 border-y border-slate-50 py-4">
//                 <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
//                   <Mail size={14} className="text-slate-300" /> {emp.email}
//                 </div>
//                 <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
//                   <Phone size={14} className="text-slate-300" /> {emp.mobile}
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Pencil size={14} /> Edit</button>
//                 <button className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Trash2 size={14} /> Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-2">
//             <p className="text-xs font-bold text-slate-400">
//               Showing {startIndex + 1} to {Math.min(startIndex + entries, filteredData.length)} of {filteredData.length} entries
//             </p>
//             <div className="flex gap-2">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="px-4 py-2 border border-slate-100 bg-white rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all"
//               >
//                 Previous
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === i + 1 ? "bg-[#0a4d44] text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"
//                     }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="px-4 py-2 border border-slate-100 bg-white rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;



















import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Pencil, Trash2, Plus, Filter, ArrowUpDown, Search,
  Users, RotateCcw, Mail, Phone, Loader2, X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Token ke liye

const EmployeeList = () => {
  const { token } = useAuth();

  // States for Data
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);

  // UI & Loading States
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // --- 1. Fetch Data from Backend ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [empRes, deptRes, subRes] = await Promise.all([
        axios.get("http://localhost:5000/api/employees", config),
        axios.get("http://localhost:5000/api/departments", config),
        axios.get("http://localhost:5000/api/sub-departments", config)
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setSubDepartments(subRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // --- 2. Client Side Filtering & Sorting ---
  const filteredData = useMemo(() => {
    let data = [...employees];
    if (search) {
      data = data.filter((emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "All") data = data.filter((emp) => emp.status === statusFilter);

    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [employees, search, statusFilter, sortConfig]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl"><Users className="text-emerald-700" size={24} /></div>
              Employee Database
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage workforce across departments</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowFilter(!showFilter)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${showFilter ? "bg-slate-800 text-white" : "bg-white border-slate-100 shadow-sm"}`}>
              <Filter size={18} /> Filter
            </button>
            <button className="flex-1 md:flex-none bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg font-bold">
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>

        {/* LOADING & TABLE SECTION */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-slate-400 font-bold animate-pulse">Syncing with server...</p>
          </div>
        ) : (
          <>
            {/* SEARCH BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  className="w-full bg-white border border-slate-100 px-11 py-3 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-emerald-50 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="text-sm font-bold text-slate-400">
                Show
                <select value={entries} onChange={(e) => setEntries(Number(e.target.value))} className="mx-2 bg-white border border-slate-100 px-2 py-1 rounded-lg text-slate-700">
                  <option value={5}>5</option><option value={10}>10</option>
                </select>
                Entries
              </div>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Employee Info</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Department</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Contacts</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{emp.name}</p>
                            <p className="text-[10px] font-black text-slate-400">#{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-bold text-slate-600">{emp.departmentId?.name || "N/A"}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{emp.subDepartmentId?.name || "General"}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Mail size={12} /> {emp.email}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Phone size={12} /> {emp.mobile}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg ${emp.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;