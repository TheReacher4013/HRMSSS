import React, { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, Plus, Search, Users, Phone, X, Loader2 } from "lucide-react";
import { employeeAPI, departmentAPI, positionAPI } from "../../services/api";

const ENTRIES = [5, 10, 25];

const DEFAULT_POSITIONS = [
  "Software Engineer", "Senior Engineer", "Team Lead", "Manager",
  "HR Executive", "HR Manager", "Accountant", "Finance Manager",
  "Sales Executive", "Sales Manager", "Marketing Executive",
  "Designer", "Product Manager", "Operations Manager",
  "Business Analyst", "Data Analyst", "DevOps Engineer",
  "QA Engineer", "Support Executive", "Intern",
];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = { name: "", email: "", mobile: "", position: "", salary: "", status: "Active", department: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [empRes, deptRes, posRes] = await Promise.allSettled([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        positionAPI.getAll(),
      ]);
      if (empRes.status === "fulfilled") setEmployees(empRes.value.data || []);
      if (deptRes.status === "fulfilled") setDepartments(deptRes.value.data || []);
      if (posRes.status === "fulfilled") setPositions(posRes.value.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return alert("Name and email are required");
    try {
      if (editId) {
        const res = await employeeAPI.update(editId, form);
        setEmployees(employees.map(e => e._id === editId ? res.data : e));
      } else {
        const res = await employeeAPI.create(form);
        setEmployees([res.data, ...employees]);
      }
      setForm(emptyForm); setShowForm(false); setEditId(null);
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      mobile: emp.mobile || "",
      position: emp.position || "",
      salary: emp.salary || "",
      status: emp.status,
      department: emp.department?._id || emp.department || "",
    });
    setEditId(emp._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await employeeAPI.delete(id);
      setEmployees(employees.filter(e => e._id !== id));
    } catch (err) { alert(err.message); }
  };

  const filtered = useMemo(() => {
    let data = [...employees];
    if (search) data = data.filter(e =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId?.includes(search)
    );
    if (statusFilter !== "All") data = data.filter(e => e.status === statusFilter);
    return data;
  }, [employees, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / entries);
  const paginated = filtered.slice((currentPage - 1) * entries, currentPage * entries);

  const performanceColor = (score) => {
    if (!score && score !== 0) return "bg-gray-100 text-gray-500";
    if (score >= 80) return "bg-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-blue-100 text-blue-700";
    if (score >= 40) return "bg-orange-100 text-orange-600";
    return "bg-red-100 text-red-600";
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-indigo-200";

  // Position list: use API data if available, else defaults
  const positionOptions = positions.length > 0
    ? positions.filter(p => p.status === "Active").map(p => p.name)
    : DEFAULT_POSITIONS;

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl"><Users className="text-indigo-600" size={24} /></div>
              Employee Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage all employees</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg transition">
            <Plus size={18} /> Add Employee
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-black text-slate-800">{employees.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
            <p className="text-2xl font-black text-emerald-700">{employees.filter(e => e.status === "Active").length}</p>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Active</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-center">
            <p className="text-2xl font-black text-red-600">{employees.filter(e => e.status === "Inactive").length}</p>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-0.5">Inactive</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search name, email or ID..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 ring-indigo-100 shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["All", "Active", "Inactive"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${statusFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-indigo-50"
                  }`}>{s}</button>
            ))}
          </div>
          <select value={entries} onChange={e => setEntries(Number(e.target.value))}
            className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none">
            {ENTRIES.map(n => <option key={n} value={n}>Show {n}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={36} /></div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <th className="py-4 px-5 text-left">Employee</th>
                  <th className="py-4 px-4 text-left">Emp ID</th>
                  <th className="py-4 px-4 text-left hidden md:table-cell">Contact</th>
                  <th className="py-4 px-4 text-left hidden lg:table-cell">Position</th>
                  <th className="py-4 px-4 text-left">Status</th>
                  <th className="py-4 px-4 text-left hidden lg:table-cell">Performance</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="7" className="py-16 text-center text-slate-400">No employees found</td></tr>
                ) : paginated.map(emp => (
                  <tr key={emp._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm shrink-0">
                          {emp.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{emp.name}</p>
                          <p className="text-[10px] text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-indigo-600 text-xs tracking-wider">{emp.employeeId || "—"}</td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <p className="text-xs text-slate-600 flex items-center gap-1"><Phone size={10} />{emp.mobile || "—"}</p>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <p className="text-xs text-slate-600">{emp.position || "—"}</p>
                      {emp.department?.name && <p className="text-[10px] text-slate-400">{emp.department.name}</p>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${emp.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                        }`}>{emp.status}</span>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${performanceColor(emp.performance?.score)}`}>
                        {emp.performance?.score != null ? `${emp.performance.score}%` : "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(emp)} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                          <Pencil size={14} className="text-slate-500" />
                        </button>
                        <button onClick={() => handleDelete(emp._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Showing {(currentPage - 1) * entries + 1}–{Math.min(currentPage * entries, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition ${currentPage === p ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-600"
                        }`}>{p}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg">{editId ? "Edit Employee" : "Add Employee"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full Name" className={inp} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="Email" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Mobile</label>
                  <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })}
                    placeholder="Mobile" className={inp} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Salary</label>
                  <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })}
                    placeholder="Salary" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Position</label>
                  <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className={inp}>
                    <option value="">-- Select Position --</option>
                    {positionOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className={inp}>
                    <option value="">-- Select Department --</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave}
                  className="flex-1 bg-[#0a4d44] text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition">
                  {editId ? "Update" : "Add Employee"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;