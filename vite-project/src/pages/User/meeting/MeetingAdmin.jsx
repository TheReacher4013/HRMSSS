// import { useState, useEffect } from "react";
// import { Plus, Pencil, Trash2, X, Video, Calendar, Clock, MapPin, User, Loader2, Users, Search } from "lucide-react";
// import { meetingAPI, employeeAPI } from "../../../services/api"

// const statusColor = (s) => {
//   switch (s) {
//     case "Scheduled": return "bg-blue-100 text-blue-700";
//     case "Ongoing":   return "bg-emerald-100 text-emerald-700";
//     case "Completed": return "bg-gray-100 text-gray-600";
//     case "Cancelled": return "bg-red-100 text-red-600";
//     default:          return "bg-gray-100 text-gray-600";
//   }
// };

// const emptyForm = {
//   title: "", description: "", date: "", time: "",
//   location: "", organizer: "", status: "Scheduled",
//   selectedEmployeeIds: [],  // array of employee _id
// };

// const MeetingAdmin = () => {
//   const [meetings, setMeetings] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [form, setForm] = useState(emptyForm);
//   const [empSearch, setEmpSearch] = useState("");

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const [meetRes, empRes] = await Promise.all([
//         meetingAPI.getAll(),
//         employeeAPI.getAll(),
//       ]);
//       setMeetings(meetRes.data);
//       setEmployees(empRes.data.filter(e => e.status === "Active"));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleEmployee = (empId) => {
//     setForm(prev => ({
//       ...prev,
//       selectedEmployeeIds: prev.selectedEmployeeIds.includes(empId)
//         ? prev.selectedEmployeeIds.filter(id => id !== empId)
//         : [...prev.selectedEmployeeIds, empId],
//     }));
//   };

//   const handleSave = async () => {
//     if (!form.title || !form.date || !form.organizer) return alert("Title, Date and Organizer are required");
//     try {
//       // Build attendees (IDs) and attendeeNames from selected employees
//       const selectedEmps = employees.filter(e => form.selectedEmployeeIds.includes(e._id));
//       const payload = {
//         title: form.title,
//         description: form.description,
//         date: form.date,
//         time: form.time,
//         location: form.location,
//         organizer: form.organizer,
//         status: form.status,
//         attendees: form.selectedEmployeeIds,
//         attendeeNames: selectedEmps.map(e => e.name),
//       };

//       if (editId) {
//         const res = await meetingAPI.update(editId, payload);
//         setMeetings(meetings.map(m => m._id === editId ? res.data : m));
//       } else {
//         const res = await meetingAPI.create(payload);
//         setMeetings([res.data, ...meetings]);
//       }
//       setForm(emptyForm); setShowForm(false); setEditId(null); setEmpSearch("");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleEdit = (m) => {
//     setForm({
//       title: m.title,
//       description: m.description || "",
//       date: m.date?.slice(0, 10),
//       time: m.time || "",
//       location: m.location || "",
//       organizer: m.organizer,
//       status: m.status,
//       selectedEmployeeIds: m.attendees?.map(a => a._id || a) || [],
//     });
//     setEditId(m._id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this meeting?")) return;
//     try {
//       await meetingAPI.delete(id);
//       setMeetings(meetings.filter(m => m._id !== id));
//     } catch (err) { alert(err.message); }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       const res = await meetingAPI.update(id, { status });
//       setMeetings(meetings.map(m => m._id === id ? res.data : m));
//     } catch (err) { alert(err.message); }
//   };

//   const filteredEmps = employees.filter(e =>
//     e.name.toLowerCase().includes(empSearch.toLowerCase())
//   );

//   return (
//     <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
//       <div className="max-w-6xl mx-auto">

//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-xl"><Video className="text-blue-600" size={24} /></div>
//               Meeting Management
//             </h1>
//             <p className="text-slate-500 text-sm mt-1">
//               Schedule meetings — only selected employees will see them
//             </p>
//           </div>
//           <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); setEmpSearch(""); }}
//             className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg">
//             <Plus size={18} /> Schedule Meeting
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
//           {["Scheduled", "Ongoing", "Completed", "Cancelled"].map(s => (
//             <div key={s} className={`${statusColor(s)} rounded-2xl p-4 text-center border border-white`}>
//               <p className="text-2xl font-black">{meetings.filter(m => m.status === s).length}</p>
//               <p className="text-xs font-bold uppercase tracking-widest mt-0.5">{s}</p>
//             </div>
//           ))}
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="animate-spin text-blue-500" size={36} />
//           </div>
//         ) : meetings.length === 0 ? (
//           <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
//             <Video size={40} className="mx-auto mb-3 text-gray-200" />
//             <p className="font-bold text-gray-500">No meetings scheduled yet</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {meetings.map(m => (
//               <div key={m._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
//                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-center gap-2 mb-2">
//                       <h3 className="font-black text-slate-800 text-base">{m.title}</h3>
//                       <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${statusColor(m.status)}`}>
//                         {m.status}
//                       </span>
//                     </div>
//                     {m.description && <p className="text-xs text-slate-500 mb-3">{m.description}</p>}

//                     <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-3">
//                       <span className="flex items-center gap-1.5">
//                         <Calendar size={12} className="text-emerald-500" />
//                         {new Date(m.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
//                       </span>
//                       {m.time && <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-400" />{m.time}</span>}
//                       {m.location && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-red-400" />{m.location}</span>}
//                       <span className="flex items-center gap-1.5"><User size={12} className="text-purple-400" />{m.organizer}</span>
//                     </div>

//                     {/* Attendee chips */}
//                     {m.attendeeNames?.length > 0 && (
//                       <div className="flex flex-wrap gap-1.5">
//                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                           <Users size={11} /> Attendees:
//                         </span>
//                         {m.attendeeNames.map((name, i) => (
//                           <span key={i} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-100">
//                             {name}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 shrink-0">
//                     <select value={m.status} onChange={e => handleStatusChange(m._id, e.target.value)}
//                       className="text-xs border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 ring-blue-100 bg-slate-50">
//                       <option>Scheduled</option>
//                       <option>Ongoing</option>
//                       <option>Completed</option>
//                       <option>Cancelled</option>
//                     </select>
//                     <button onClick={() => handleEdit(m)} className="p-2 hover:bg-slate-100 rounded-xl transition">
//                       <Pencil size={14} className="text-slate-500" />
//                     </button>
//                     <button onClick={() => handleDelete(m._id)} className="p-2 hover:bg-red-50 rounded-xl transition">
//                       <Trash2 size={14} className="text-red-400" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── CREATE / EDIT MODAL ── */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-5 pb-4 flex justify-between items-center">
//               <h2 className="font-black text-lg text-slate-800">
//                 {editId ? "Edit Meeting" : "Schedule New Meeting"}
//               </h2>
//               <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-xl">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* Title */}
//               <div>
//                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Meeting Title *</label>
//                 <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
//                   placeholder="e.g. Project Alpha Review"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Description</label>
//                 <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
//                   placeholder="Meeting agenda or description..." rows={2}
//                   className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200 resize-none" />
//               </div>

//               {/* Date + Time */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Date *</label>
//                   <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Time</label>
//                   <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
//                 </div>
//               </div>

//               {/* Location + Organizer */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Location</label>
//                   <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
//                     placeholder="Conference Room A"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Organizer *</label>
//                   <input value={form.organizer} onChange={e => setForm({...form, organizer: e.target.value})}
//                     placeholder="Your name"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
//                 </div>
//               </div>

//               {/* ── EMPLOYEE SELECTOR ── */}
//               <div>
//                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
//                   Select Attendees — Only these employees will see this meeting
//                 </label>

//                 {/* Search */}
//                 <div className="relative mb-3">
//                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input value={empSearch} onChange={e => setEmpSearch(e.target.value)}
//                     placeholder="Search employee..."
//                     className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ring-blue-200" />
//                 </div>

//                 {/* Selected count */}
//                 {form.selectedEmployeeIds.length > 0 && (
//                   <div className="mb-2 flex flex-wrap gap-1.5">
//                     {employees
//                       .filter(e => form.selectedEmployeeIds.includes(e._id))
//                       .map(e => (
//                         <span key={e._id}
//                           className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
//                           onClick={() => toggleEmployee(e._id)}>
//                           {e.name} ✕
//                         </span>
//                       ))}
//                   </div>
//                 )}

//                 {/* Employee list */}
//                 <div className="border border-gray-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
//                   {filteredEmps.length === 0 ? (
//                     <p className="text-center text-sm text-gray-400 py-6">No employees found</p>
//                   ) : filteredEmps.map((emp, i) => {
//                     const selected = form.selectedEmployeeIds.includes(emp._id);
//                     return (
//                       <div key={emp._id}
//                         onClick={() => toggleEmployee(emp._id)}
//                         className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-gray-50 last:border-0
//                           ${selected ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
//                         <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
//                           ${selected ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
//                           {selected && <span className="text-white text-[10px] font-black">✓</span>}
//                         </div>
//                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs shrink-0">
//                           {emp.name.charAt(0)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className={`text-sm font-bold truncate ${selected ? "text-indigo-700" : "text-slate-700"}`}>
//                             {emp.name}
//                           </p>
//                           <p className="text-[10px] text-slate-400">{emp.position || "Employee"} • {emp.employeeId}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
//                   {form.selectedEmployeeIds.length} employee{form.selectedEmployeeIds.length !== 1 ? "s" : ""} selected
//                   {form.selectedEmployeeIds.length === 0 && " — meeting will be visible to ALL employees if none selected"}
//                 </p>
//               </div>

//               {/* Status (edit only) */}
//               {editId && (
//                 <div>
//                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
//                   <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200">
//                     <option>Scheduled</option><option>Ongoing</option><option>Completed</option><option>Cancelled</option>
//                   </select>
//                 </div>
//               )}

//               {/* Buttons */}
//               <div className="flex gap-3 pt-2">
//                 <button onClick={() => setShowForm(false)}
//                   className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
//                   Cancel
//                 </button>
//                 <button onClick={handleSave}
//                   className="flex-1 bg-[#0a4d44] text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition">
//                   {editId ? "Update Meeting" : "Schedule Meeting"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MeetingAdmin;

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Video, Calendar, Clock, MapPin, User, Loader2, Users, Search } from "lucide-react";
import { meetingAPI, employeeAPI } from "../../../services/api";

const statusColor = (s) => {
  switch (s) {
    case "Scheduled": return "bg-blue-100 text-blue-700";
    case "Ongoing": return "bg-emerald-100 text-emerald-700";
    case "Completed": return "bg-gray-100 text-gray-600";
    case "Cancelled": return "bg-red-100 text-red-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const emptyForm = {
  title: "", description: "", date: "", time: "",
  location: "", organizer: "", status: "Scheduled",
  selectedEmployeeIds: [],  // array of employee _id
};

const MeetingAdmin = () => {
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [empSearch, setEmpSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [meetRes, empRes] = await Promise.all([
        meetingAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      setMeetings(meetRes.data);
      setEmployees(empRes.data.filter(e => e.status === "Active"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployee = (empId) => {
    setForm(prev => ({
      ...prev,
      selectedEmployeeIds: prev.selectedEmployeeIds.includes(empId)
        ? prev.selectedEmployeeIds.filter(id => id !== empId)
        : [...prev.selectedEmployeeIds, empId],
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.organizer) return alert("Title, Date and Organizer are required");
    try {
      // Build attendees (IDs) and attendeeNames from selected employees
      const selectedEmps = employees.filter(e => form.selectedEmployeeIds.includes(e._id));
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        location: form.location,
        organizer: form.organizer,
        status: form.status,
        attendees: form.selectedEmployeeIds,
        attendeeNames: selectedEmps.map(e => e.name),
      };

      if (editId) {
        const res = await meetingAPI.update(editId, payload);
        setMeetings(meetings.map(m => m._id === editId ? res.data : m));
      } else {
        const res = await meetingAPI.create(payload);
        setMeetings([res.data, ...meetings]);
      }
      setForm(emptyForm); setShowForm(false); setEditId(null); setEmpSearch("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (m) => {
    setForm({
      title: m.title,
      description: m.description || "",
      date: m.date?.slice(0, 10),
      time: m.time || "",
      location: m.location || "",
      organizer: m.organizer,
      status: m.status,
      selectedEmployeeIds: m.attendees?.map(a => a._id || a) || [],
    });
    setEditId(m._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    try {
      await meetingAPI.delete(id);
      setMeetings(meetings.filter(m => m._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await meetingAPI.update(id, { status });
      setMeetings(meetings.map(m => m._id === id ? res.data : m));
    } catch (err) { alert(err.message); }
  };

  const filteredEmps = employees.filter(e =>
    e.name.toLowerCase().includes(empSearch.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-xl"><Video className="text-blue-600" size={20} /></div>
              Meeting Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Schedule meetings — only selected employees will see them
            </p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); setEmpSearch(""); }}
            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg text-sm shrink-0">
            <Plus size={16} /> Schedule Meeting
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {["Scheduled", "Ongoing", "Completed", "Cancelled"].map(s => (
            <div key={s} className={`${statusColor(s)} rounded-2xl p-3 sm:p-4 text-center border border-white`}>
              <p className="text-2xl font-black">{meetings.filter(m => m.status === s).length}</p>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest mt-0.5 leading-tight break-words">{s}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
            <Video size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-500">No meetings scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map(m => (
              <div key={m._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 hover:shadow-md transition-all">
                {/* Top row: title + status badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-800 text-base">{m.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${statusColor(m.status)}`}>
                      {m.status}
                    </span>
                  </div>
                  {/* Actions - always visible on right */}
                  <div className="flex items-center gap-1 shrink-0">
                    <select value={m.status} onChange={e => handleStatusChange(m._id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 ring-blue-100 bg-slate-50 w-[100px]">
                      <option>Scheduled</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <button onClick={() => handleEdit(m)} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                      <Pencil size={13} className="text-slate-500" />
                    </button>
                    <button onClick={() => handleDelete(m._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>

                {m.description && <p className="text-xs text-slate-500 mb-3">{m.description}</p>}

                {/* Meta info */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-emerald-500 shrink-0" />
                    {new Date(m.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  {m.time && <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-400 shrink-0" />{m.time}</span>}
                  {m.location && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-red-400 shrink-0" />{m.location}</span>}
                  <span className="flex items-center gap-1.5"><User size={12} className="text-purple-400 shrink-0" />{m.organizer}</span>
                </div>

                {/* Attendee chips */}
                {m.attendeeNames?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Users size={11} /> Attendees:
                    </span>
                    {m.attendeeNames.map((name, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-100">
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-5 pb-4 flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-800">
                {editId ? "Edit Meeting" : "Schedule New Meeting"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Meeting Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Project Alpha Review"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Meeting agenda or description..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200 resize-none" />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
                </div>
              </div>

              {/* Location + Organizer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="Conference Room A"
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Organizer *</label>
                  <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200" />
                </div>
              </div>

              {/* ── EMPLOYEE SELECTOR ── */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                  Select Attendees — Only these employees will see this meeting
                </label>

                {/* Search */}
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={empSearch} onChange={e => setEmpSearch(e.target.value)}
                    placeholder="Search employee..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ring-blue-200" />
                </div>

                {/* Selected count */}
                {form.selectedEmployeeIds.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {employees
                      .filter(e => form.selectedEmployeeIds.includes(e._id))
                      .map(e => (
                        <span key={e._id}
                          className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                          onClick={() => toggleEmployee(e._id)}>
                          {e.name} ✕
                        </span>
                      ))}
                  </div>
                )}

                {/* Employee list */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredEmps.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-6">No employees found</p>
                  ) : filteredEmps.map((emp, i) => {
                    const selected = form.selectedEmployeeIds.includes(emp._id);
                    return (
                      <div key={emp._id}
                        onClick={() => toggleEmployee(emp._id)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-gray-50 last:border-0
                          ${selected ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                          ${selected ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                          {selected && <span className="text-white text-[10px] font-black">✓</span>}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${selected ? "text-indigo-700" : "text-slate-700"}`}>
                            {emp.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{emp.position || "Employee"} • {emp.employeeId}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                  {form.selectedEmployeeIds.length} employee{form.selectedEmployeeIds.length !== 1 ? "s" : ""} selected
                  {form.selectedEmployeeIds.length === 0 && " — meeting will be visible to ALL employees if none selected"}
                </p>
              </div>

              {/* Status (edit only) */}
              {editId && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-blue-200">
                    <option>Scheduled</option><option>Ongoing</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleSave}
                  className="flex-1 bg-[#0a4d44] text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition">
                  {editId ? "Update Meeting" : "Schedule Meeting"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingAdmin;