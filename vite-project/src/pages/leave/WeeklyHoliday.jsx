import React, { useState } from "react";
import { Pencil, Trash2, Plus, Calendar as CalendarIcon, Settings, CheckCircle, XCircle, X } from "lucide-react";

const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeeklyHoliday = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  const [holidays, setHolidays] = useState([{ id: 1, days: ["Tuesday", "Friday"] }]);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [leaveTypes, setLeaveTypes] = useState([
    { id: 1, name: "Recreational Leave", code: "RL", days: 30 },
    { id: 2, name: "Medical Leave", code: "ML", days: 6 },
  ]);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [deleteLeaveId, setDeleteLeaveId] = useState(null);
  const [leaveForm, setLeaveForm] = useState({ name: "", code: "", days: "" });

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: "Test Candidate", type: "Earned Leave", days: 3, status: "Pending" },
    { id: 2, employee: "Amy Zamora", type: "Medical Leave", days: 1, status: "Pending" },
  ]);

  const handleEditHoliday = (item) => {
    setEditingHoliday(item);
    setSelectedDays(item.days);
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const handleUpdateHoliday = () => {
    setHolidays(prev => prev.map(item => item.id === editingHoliday.id ? { ...item, days: selectedDays } : item));
    setEditingHoliday(null);
  };

  const handleSaveLeave = () => {
    if (editLeave) {
      setLeaveTypes(prev => prev.map(item => item.id === editLeave.id ? { ...leaveForm, id: item.id } : item));
    } else {
      setLeaveTypes(prev => [...prev, { id: Date.now(), ...leaveForm }]);
    }
    setShowLeaveModal(false);
  };

  const handleStatusChange = (id, status) => {
    setLeaveRequests(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-wrap gap-2 bg-white/50 backdrop-blur p-2 rounded-[2rem] border border-slate-100 mb-8 inline-flex shadow-sm">
          {["weekly", "leaveType", "leaveApproval"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === tab ? "bg-[#0a4d44] text-white shadow-md shadow-emerald-900/10 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab === 'weekly' ? 'Weekly Off' : tab === 'leaveType' ? 'Policy Types' : 'Approvals'}
            </button>
          ))}
        </div>

        {activeTab === "weekly" && (
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><CalendarIcon size={20} /> Office Holidays</h2>
            <div className="space-y-6">
              {holidays.map((item) => (
                <div key={item.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {item.days.map(day => (
                      <span key={day} className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">{day}</span>
                    ))}
                  </div>
                  <button onClick={() => handleEditHoliday(item)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"><Pencil size={14} /> Edit Days</button>
                </div>
              ))}

              {editingHoliday && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top duration-300">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Select Weekend Days</p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {daysList.map((day) => (
                      <button key={day} onClick={() => handleDayToggle(day)} className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${selectedDays.includes(day) ? "bg-[#0a4d44] border-emerald-900 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}>{day}</button>
                    ))}
                  </div>
                  <button onClick={handleUpdateHoliday} className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold text-sm">Save Changes</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "leaveType" && (
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-800">Leave Policies</h2>
              <button onClick={() => { setEditLeave(null); setLeaveForm({ name: "", code: "", days: "" }); setShowLeaveModal(true); }} className="bg-[#0a4d44] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2"><Plus size={16} /> New Policy</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leaveTypes.map((item) => (
                <div key={item.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all">
                  <div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.code}</span>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 tracking-tight">{item.days} Days Yearly</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditLeave(item); setLeaveForm(item); setShowLeaveModal(true); }} className="p-2.5 bg-white border border-slate-100 rounded-xl text-indigo-600 hover:bg-indigo-50"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteLeaveId(item.id)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leaveApproval" && (
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-8">Pending Approvals</h2>
            <div className="space-y-4">
              {leaveRequests.map((item) => (
                <div key={item.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-indigo-600 font-black">{item.employee.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.employee}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{item.type} • {item.days} Day(s)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusChange(item.id, "Approved")} className="px-6 py-2.5 bg-white text-emerald-600 border border-emerald-100 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all">Approve</button>
                    <button onClick={() => handleStatusChange(item.id, "Rejected")} className="px-6 py-2.5 bg-white text-red-500 border border-red-100 rounded-xl font-black text-xs hover:bg-red-50 transition-all">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showLeaveModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
              <h2 className="text-xl font-black text-slate-800 mb-6">{editLeave ? "Edit Policy" : "New Policy"}</h2>
              <div className="space-y-4 mb-8">
                <input placeholder="Policy Name" value={leaveForm.name} onChange={(e) => setLeaveForm({ ...leaveForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm outline-none focus:ring-4 ring-indigo-50" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Code (e.g. SL)" value={leaveForm.code} onChange={(e) => setLeaveForm({ ...leaveForm, code: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm outline-none" />
                  <input type="number" placeholder="Days" value={leaveForm.days} onChange={(e) => setLeaveForm({ ...leaveForm, days: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm outline-none" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowLeaveModal(false)} className="flex-1 py-4 font-bold text-slate-400">Close</button>
                <button onClick={handleSaveLeave} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10">Save Policy</button>
              </div>
            </div>
          </div>
        )}

        {deleteLeaveId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4 font-sans">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><Trash2 size={40} /></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete Policy?</h2>
              <p className="text-slate-500 text-sm font-medium mb-8 italic">This cannot be undone once deleted.</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setLeaveTypes(prev => prev.filter(i => i.id !== deleteLeaveId)); setDeleteLeaveId(null); }} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100">Delete Forever</button>
                <button onClick={() => setDeleteLeaveId(null)} className="w-full py-4 rounded-2xl font-bold text-slate-400">Go Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyHoliday;