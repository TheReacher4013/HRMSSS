import { Pencil, Trash2, Plus, X, Search, Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const HolidayList = () => {
  const [search, setSearch] = useState("");
  const [list, setList] = useState([
    { id: 1, name: "Eid Vacation", from: "2025-09-22", to: "2025-09-23", days: 2 },
    { id: 2, name: "GOOD FRIDAY", from: "2025-04-18", to: "2025-04-18", days: 1 },
    { id: 3, name: "Vacation", from: "2025-04-19", to: "2025-04-20", days: 2 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalDays = from && to
    ? Math.floor((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1
    : "";

  const onAdd = () => {
    setCurrent(null); setName(""); setFrom(""); setTo("");
    setModalOpen(true);
  };

  const onEdit = (item) => {
    setCurrent(item); setName(item.name); setFrom(item.from); setTo(item.to);
    setModalOpen(true);
  };

  const onSave = () => {
    if (!name || !from || !to) return;
    if (current) {
      setList((prev) => prev.map((h) => h.id === current.id ? { ...h, name, from, to, days: totalDays } : h));
    } else {
      setList((prev) => [{ id: Date.now(), name, from, to, days: totalDays }, ...prev]);
    }
    setModalOpen(false);
  };

  const onDelete = (item) => {
    setCurrent(item);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setList((prev) => prev.filter((h) => h.id !== current.id));
    setDeleteOpen(false);
  };

  const filtered = list.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-xl">
                <CalendarIcon className="text-sky-600" size={24} />
              </div>
              Public Holidays
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Calendar of non-working days for 2025</p>
          </div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 font-bold active:scale-95"
          >
            <Plus size={18} /> Add Holiday
          </button>
        </div>

        <div className="relative w-full max-w-sm ml-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Find holiday..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-4 ring-sky-50 transition-all"
          />
        </div>

        <div className="hidden sm:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Sl No.</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Holiday Name</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400">Duration (From - To)</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-center">Total Days</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((item, i) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-5 text-sm font-bold text-slate-300">
                    {String(startIndex + i + 1).padStart(2, '0')}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tight">
                      <span className="text-slate-600">{item.from}</span>
                      <span className="text-slate-300">→</span>
                      <span className="text-slate-600">{item.to}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg text-xs font-black">
                      {item.days} {item.days > 1 ? 'Days' : 'Day'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(item)} className="p-2.5 bg-white border border-slate-100 text-emerald-600 rounded-xl hover:border-emerald-200 transition-all shadow-sm">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => onDelete(item)} className="p-2.5 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200 transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-4">
          {paginatedData.map((item, i) => (
            <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                  {item.days}D
                </span>
              </div>
              <p className="text-xs font-black text-slate-300 mb-1">#{startIndex + i + 1}</p>
              <h3 className="font-bold text-slate-800 text-lg mb-4">{item.name}</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center bg-slate-50 px-3 py-2 rounded-xl flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">From</p>
                  <p className="text-xs font-bold text-slate-700">{item.from}</p>
                </div>
                <div className="text-center bg-slate-50 px-3 py-2 rounded-xl flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">To</p>
                  <p className="text-xs font-bold text-slate-700">{item.to}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(item)} className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Pencil size={14} /> Edit</button>
                <button onClick={() => onDelete(item)} className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 px-2">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Holiday Calendar</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-black text-slate-800 tracking-tight">{current ? "Edit Holiday Info" : "New Holiday Entry"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Event / Holiday Name</label>
                  <input className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-sky-50 transition-all" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Annual Winter Break" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">From Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-sky-50 transition-all" value={from} onChange={(e) => setFrom(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">To Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-sky-50 transition-all" value={to} onChange={(e) => setTo(e.target.value)} />
                  </div>
                </div>
                {totalDays > 0 && (
                  <div className="bg-sky-50 p-4 rounded-2xl flex items-center gap-3">
                    <Info size={18} className="text-sky-600" />
                    <p className="text-xs font-bold text-sky-800 tracking-tight italic">This duration will count as <span className="underline">{totalDays}</span> full business days.</p>
                  </div>
                )}
              </div>
              <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-white transition-all">Discard</button>
                <button onClick={onSave} className="flex-[2] bg-[#0a4d44] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
                  {current ? "Confirm Update" : "Save Holiday"}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete Holiday?</h2>
              <p className="text-slate-500 text-sm font-medium mb-8">This will remove <span className="text-slate-800 font-bold">"{current?.name}"</span> from the global calendar list.</p>
              <div className="flex flex-col gap-2">
                <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 active:scale-95 transition-all">Yes, Remove it</button>
                <button onClick={() => setDeleteOpen(false)} className="w-full py-4 rounded-2xl font-bold text-sm text-slate-400 hover:text-slate-600 transition-all">Keep Holiday</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayList;