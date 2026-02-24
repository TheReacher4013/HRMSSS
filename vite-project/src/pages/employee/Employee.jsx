import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Filter, ArrowUpDown, Search, Users, RotateCcw, Mail, Phone } from "lucide-react";
import { employeeAPI } from "../../utils/api";

const EmployeeList = () => {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [entries, setEntries]       = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal]           = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: entries });
      if (search) params.append("search", search);
      if (statusFilter !== "All") params.append("status", statusFilter);
      const res = await employeeAPI.getAll(params.toString());
      setEmployees(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, entries, search, statusFilter]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete employee "${name}"?`)) return;
    try {
      await employeeAPI.remove(id);
      fetchEmployees();
    } catch (err) { alert(err.message); }
  };

  const totalPages = Math.ceil(total / entries);

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
            <p className="text-slate-500 text-sm font-medium mt-1">Manage your workforce</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowFilter(!showFilter)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${showFilter ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-100 shadow-sm"}`}>
              <Filter size={18} /> Filter
            </button>
            <button className="flex-1 md:flex-none bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg font-bold active:scale-95">
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>

        {/* FILTER */}
        {showFilter && (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-64">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-1 block">Status</label>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 outline-none">
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button onClick={() => { setStatusFilter("All"); setSearch(""); setCurrentPage(1); }} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        )}

        {/* SEARCH & ENTRIES */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-2">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
            Show
            <select value={entries} onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-slate-100 px-2 py-1 rounded-lg text-slate-700 outline-none shadow-sm">
              <option value={5}>5</option><option value={10}>10</option><option value={15}>15</option>
            </select>
            entries
          </div>
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name..." className="w-full bg-white border border-slate-100 px-11 py-3 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-4 ring-emerald-50" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        {/* ERROR */}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-[2rem] p-20 text-center text-slate-400 font-medium">Loading employees...</div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Sl</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Employee ID</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Name</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400">Contacts</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {employees.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No employees found</td></tr>
                  ) : employees.map((emp, index) => (
                    <tr key={emp._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-5 text-sm font-bold text-slate-300">{String((currentPage - 1) * entries + index + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-5 text-sm font-black text-slate-500">#{emp.employeeId}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            {emp.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Mail size={12} className="text-slate-300" />{emp.email}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Phone size={12} className="text-slate-300" />{emp.mobile}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${emp.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          <div className={`w-1 h-1 rounded-full ${emp.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(emp._id, emp.name)} className="p-2.5 bg-white border border-slate-100 text-red-600 rounded-xl hover:border-red-200 hover:shadow-sm transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-2">
                <p className="text-xs font-bold text-slate-400">
                  Showing {(currentPage - 1) * entries + 1} to {Math.min(currentPage * entries, total)} of {total} entries
                </p>
                <div className="flex gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 border border-slate-100 bg-white rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50">Previous</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === i + 1 ? "bg-[#0a4d44] text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"}`}>{i + 1}</button>
                  ))}
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 border border-slate-100 bg-white rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
