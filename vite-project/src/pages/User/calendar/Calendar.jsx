// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useState } from "react";

// const CalendarPage = () => {
//   const [events, setEvents] = useState([
//     {
//       id: "1",
//       title: "Project Alpha Review",
//       start: "2026-02-26T15:30:00",
//       end: "2026-02-26T16:30:00",
//       backgroundColor: "#2563eb",
//     },
//     {
//       id: "2",
//       title: "Republic Day",
//       start: "2026-01-26",
//       allDay: true,
//       backgroundColor: "#16a34a",
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [note, setNote] = useState("");
//   const [editEventId, setEditEventId] = useState(null);

//   /* 👉 Date click (Add note) */
//   const handleDateClick = (info) => {
//     setSelectedDate(info.dateStr);
//     setNote("");
//     setEditEventId(null);
//     setShowModal(true);
//   };

//   /* 👉 Event click (Edit/Delete note) */
//   const handleEventClick = (info) => {
//     setSelectedDate(info.event.startStr);
//     setNote(info.event.title);
//     setEditEventId(info.event.id);
//     setShowModal(true);
//   };

//   /* 👉 Save or Update note */
//   const saveNote = () => {
//     if (!note) return;

//     if (editEventId) {
//       // EDIT
//       setEvents((prev) =>
//         prev.map((ev) =>
//           ev.id === editEventId ? { ...ev, title: note } : ev
//         )
//       );
//     } else {
//       // ADD
//       setEvents((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           title: note,
//           start: selectedDate,
//           allDay: true,
//           backgroundColor: "#facc15",
//           textColor: "#000",
//         },
//       ]);
//     }

//     closeModal();
//   };

//   /* 👉 Delete note */
//   const deleteNote = () => {
//     setEvents((prev) => prev.filter((ev) => ev.id !== editEventId));
//     closeModal();
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setNote("");
//     setEditEventId(null);
//   };

//   return (
//     <div className="bg-[#f8fafa] p-4">
//       <div className="bg-white rounded-2xl shadow-lg p-4">

//         <h1 className="text-2xl font-bold mb-4">Calendar</h1>

//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           dateClick={handleDateClick}
//           eventClick={handleEventClick}
//           events={events}
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,timeGridWeek,timeGridDay",
//           }}
//         />

//         {/* 📝 Add / Edit Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-5 w-[90%] max-w-md">
//               <h2 className="text-lg font-semibold mb-2">
//                 {editEventId ? "Edit Note" : "Add Note"} ({selectedDate})
//               </h2>

//               <textarea
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 placeholder="Write your note..."
//                 className="w-full border rounded-lg p-2 mb-3"
//                 rows={4}
//               />

//               <div className="flex justify-between items-center">
//                 {editEventId && (
//                   <button
//                     onClick={deleteNote}
//                     className="px-4 py-2 rounded-lg bg-red-500 text-white"
//                   >
//                     Delete
//                   </button>
//                 )}

//                 <div className="flex gap-2 ml-auto">
//                   <button
//                     onClick={closeModal}
//                     className="px-4 py-2 rounded-lg bg-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={saveNote}
//                     className="px-4 py-2 rounded-lg bg-blue-600 text-white"
//                   >
//                     {editEventId ? "Update" : "Save"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default CalendarPage;


import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect, useCallback } from "react";
import { leaveAPI, meetingAPI, attendanceAPI } from "../../../services/api";
import { Loader2, Plus, Pencil, Trash2, StickyNote, X, Save } from "lucide-react";

// ── Personal notes localStorage key ──────────────────────────────────────────
const NOTES_KEY = "calendar_personal_notes";

const loadNotes = () => {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]"); }
  catch { return []; }
};
const saveNotes = (notes) => localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

// ── Color palette for personal notes ─────────────────────────────────────────
const NOTE_COLORS = [
  { bg: "#8b5cf6", label: "Purple" },
  { bg: "#ec4899", label: "Pink" },
  { bg: "#f97316", label: "Orange" },
  { bg: "#06b6d4", label: "Cyan" },
  { bg: "#6366f1", label: "Indigo" },
];

const CalendarPage = () => {
  const [apiEvents, setApiEvents] = useState([]);  // holidays, meetings, leaves, attendance
  const [notes, setNotes] = useState(loadNotes); // personal notes from localStorage
  const [loading, setLoading] = useState(true);

  // ── View-event modal (for api events) ────────────────────────────────────
  const [viewModal, setViewModal] = useState(null); // { title, date, type, description, location }

  // ── Note form modal (add / edit personal note) ────────────────────────────
  const [noteForm, setNoteForm] = useState(null);
  // noteForm = { id?, date, title, content, color } or null

  // ── Fetch API events ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [holidayRes, meetingRes, leaveRes, attRes] = await Promise.all([
          leaveAPI.getHolidays(),
          meetingAPI.getAll(),
          leaveAPI.getAll(),
          attendanceAPI.getAll(),
        ]);

        const ev = [];

        holidayRes.data.forEach(h => ev.push({
          id: `holiday-${h._id}`, title: `🏖 ${h.name}`,
          start: h.date?.slice(0, 10), allDay: true,
          backgroundColor: "#16a34a", borderColor: "#16a34a",
          extendedProps: { type: "Holiday", description: h.description, isApi: true },
        }));

        meetingRes.data.forEach(m => ev.push({
          id: `meeting-${m._id}`, title: `📅 ${m.title}`,
          start: m.date?.slice(0, 10) + (m.time ? `T${m.time}` : ""),
          backgroundColor: "#2563eb", borderColor: "#2563eb",
          extendedProps: { type: "Meeting", description: `Organizer: ${m.organizer}`, location: m.location, isApi: true },
        }));

        leaveRes.data.forEach(l => {
          if (l.status === "Approved") ev.push({
            id: `leave-${l._id}`, title: `🏝 ${l.type || "Leave"}`,
            start: l.startDate?.slice(0, 10), end: l.endDate?.slice(0, 10),
            allDay: true, backgroundColor: "#f59e0b", borderColor: "#f59e0b",
            extendedProps: { type: "Approved Leave", description: l.reason, isApi: true },
          });
        });

        attRes.data.forEach(a => ev.push({
          id: `att-${a._id}`,
          title: a.checkOut ? `✅ Present` : `🕐 On Duty`,
          start: a.date?.slice(0, 10), allDay: true,
          backgroundColor: a.checkOut ? "#10b981" : "#f97316",
          borderColor: a.checkOut ? "#10b981" : "#f97316",
          extendedProps: { type: "Attendance", description: `In: ${a.checkIn || "--"} | Out: ${a.checkOut || "--"}`, isApi: true },
        }));

        setApiEvents(ev);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // ── Build note events from state ──────────────────────────────────────────
  const noteEvents = notes.map(n => ({
    id: `note-${n.id}`,
    title: `📌 ${n.title}`,
    start: n.date,
    allDay: true,
    backgroundColor: n.color || "#8b5cf6",
    borderColor: n.color || "#8b5cf6",
    extendedProps: { type: "Personal Note", description: n.content, noteId: n.id, isNote: true },
  }));

  const allEvents = [...apiEvents, ...noteEvents];

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Click on date → open add-note form
  const handleDateClick = (info) => {
    setNoteForm({ date: info.dateStr, title: "", content: "", color: NOTE_COLORS[0].bg });
  };

  // Click on event → if note: edit form, else: view modal
  const handleEventClick = (info) => {
    const props = info.event.extendedProps;
    if (props.isNote) {
      const note = notes.find(n => n.id === props.noteId);
      if (note) setNoteForm({ ...note }); // edit mode (has id)
    } else {
      setViewModal({
        title: info.event.title,
        date: info.event.startStr,
        type: props.type,
        description: props.description,
        location: props.location,
      });
    }
  };

  // Save note (add or edit)
  const handleSaveNote = () => {
    if (!noteForm.title.trim()) return;
    let updated;
    if (noteForm.id) {
      // Edit existing
      updated = notes.map(n => n.id === noteForm.id ? { ...noteForm } : n);
    } else {
      // Add new
      updated = [...notes, { ...noteForm, id: Date.now() }];
    }
    setNotes(updated);
    saveNotes(updated);
    setNoteForm(null);
  };

  // Delete note
  const handleDeleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    setNoteForm(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafa] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafa] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0f2e2e]">My Calendar</h1>
            <p className="text-gray-400 text-sm mt-0.5">Click any date to add a personal note</p>
          </div>
          <button
            onClick={() => setNoteForm({ date: new Date().toISOString().slice(0, 10), title: "", content: "", color: NOTE_COLORS[0].bg })}
            className="flex items-center gap-2 bg-[#0f2e2e] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
            <Plus size={16} /> Add Note
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {[
            { color: "#16a34a", label: "Holidays" },
            { color: "#2563eb", label: "Meetings" },
            { color: "#f59e0b", label: "Approved Leave" },
            { color: "#10b981", label: "Present" },
            { color: "#f97316", label: "On Duty" },
            { color: "#8b5cf6", label: "My Notes" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }}></div>
              <span className="text-xs font-medium text-gray-600">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
            events={allEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            eventDisplay="block"
            editable={false}
            selectable={true}
          />
        </div>

        {/* Notes list */}
        {notes.length > 0 && (
          <div>
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-3">
              📌 My Notes ({notes.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...notes].sort((a, b) => a.date.localeCompare(b.date)).map(note => (
                <div key={note.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: note.color }}></div>
                      <p className="font-bold text-[#0f2e2e] text-sm truncate">{note.title}</p>
                    </div>
                    <button
                      onClick={() => setNoteForm({ ...note })}
                      className="p-1 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition shrink-0">
                      <Pencil size={13} className="text-gray-400" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 ml-5">
                    {new Date(note.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                  </p>
                  {note.content && (
                    <p className="text-xs text-gray-500 mt-2 ml-5 line-clamp-2">{note.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL (for API events) ── */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {viewModal.type}
                </span>
                <h3 className="font-black text-[#0f2e2e] text-lg mt-2">
                  {viewModal.title.replace(/^[\S]+\s/, "")}
                </h3>
              </div>
              <button onClick={() => setViewModal(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📅 {viewModal.date?.slice(0, 10)}</p>
              {viewModal.description && <p>📝 {viewModal.description}</p>}
              {viewModal.location && <p>📍 {viewModal.location}</p>}
            </div>
            <button onClick={() => setViewModal(null)}
              className="mt-5 w-full bg-[#0f2e2e] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── NOTE FORM MODAL (add / edit personal note) ── */}
      {noteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-[#0f2e2e] text-lg flex items-center gap-2">
                <StickyNote size={20} className="text-purple-500" />
                {noteForm.id ? "Edit Note" : "Add Note"}
              </h2>
              <button onClick={() => setNoteForm(null)} className="p-1 hover:bg-gray-100 rounded-xl">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Date</label>
                <input type="date" value={noteForm.date}
                  onChange={e => setNoteForm({ ...noteForm, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-200" />
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Title *</label>
                <input placeholder="Note title..." value={noteForm.title}
                  onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-200" />
              </div>

              {/* Content */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Note / Description</label>
                <textarea placeholder="Write your note here..." value={noteForm.content} rows={4}
                  onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-200 resize-none" />
              </div>

              {/* Color picker */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Color</label>
                <div className="flex gap-2">
                  {NOTE_COLORS.map(c => (
                    <button key={c.bg} onClick={() => setNoteForm({ ...noteForm, color: c.bg })}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${noteForm.color === c.bg ? "border-gray-800 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c.bg }}
                      title={c.label} />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {noteForm.id && (
                  <button onClick={() => handleDeleteNote(noteForm.id)}
                    className="flex items-center gap-1.5 px-4 py-3 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition">
                    <Trash2 size={15} /> Delete
                  </button>
                )}
                <button onClick={() => setNoteForm(null)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleSaveNote}
                  className="flex-1 bg-[#0f2e2e] text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  <Save size={15} /> {noteForm.id ? "Update" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;