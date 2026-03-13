import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  Loader2,
  Calendar,
  User
} from "lucide-react";

import { noticeAPI, employeeAPI } from "../../services/api";

const typeStyle = (type) => {
  switch (type?.toLowerCase()) {
    case "urgent":
      return {
        border: "border-l-red-500",
        bg: "bg-red-50",
        badge: "bg-red-100 text-red-700",
        dot: "bg-red-500"
      };
    case "holiday":
      return {
        border: "border-l-emerald-500",
        bg: "bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-700",
        dot: "bg-emerald-500"
      };
    case "event":
      return {
        border: "border-l-purple-500",
        bg: "bg-purple-50",
        badge: "bg-purple-100 text-purple-700",
        dot: "bg-purple-500"
      };
    default:
      return {
        border: "border-l-blue-500",
        bg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500"
      };
  }
};

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    title: "",
    type: "General",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    by: ""
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchNotices();
    fetchEmployees();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await noticeAPI.getAll();
      setNotices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notices.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.type?.toLowerCase().includes(search.toLowerCase()) ||
      n.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.title || !form.description || !form.by)
      return alert("Please fill all required fields");

    try {
      if (editId) {
        const res = await noticeAPI.update(editId, form);

        setNotices(notices.map((n) => (n._id === editId ? res.data : n)));
      } else {
        const res = await noticeAPI.create(form);

        setNotices([res.data, ...notices]);
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (n) => {
    setForm({
      title: n.title || "",
      type: n.type,
      description: n.description,
      date: n.date?.slice(0, 10),
      by: n.by
    });

    setEditId(n._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await noticeAPI.delete(id);

      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Megaphone className="text-[#0a4d44]" />
              Announcement Hub
            </h1>

            <p className="text-slate-500 text-sm">
              Keep everyone updated with latest news
            </p>
          </div>

          <button
            onClick={() => {
              setForm(emptyForm);
              setEditId(null);
              setShowForm(true);
            }}
            className="bg-[#0a4d44] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition shadow-md shrink-0"
          >
            <Plus size={16} />
            Create Notice
          </button>
        </div>

        {/* Search */}

        <div className="relative max-w-sm mb-6">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 ring-emerald-200"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#0a4d44]" size={36} />
          </div>
        ) : (
          <div className="space-y-4">

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <Megaphone
                  size={36}
                  className="mx-auto mb-2 text-gray-200"
                />
                <p className="text-slate-400 text-sm font-bold">
                  No notices found
                </p>
              </div>
            )}

            {filtered.map((notice) => {
              const s = typeStyle(notice.type);

              return (
                <div
                  key={notice._id}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 ${s.border} p-5`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${s.badge}`}
                        >
                          {notice.type}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar size={10} />
                          {new Date(notice.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <User size={10} />
                          {notice.by}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-800 text-base mb-1">
                        {notice.title || "—"}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed">
                        {notice.description}
                      </p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition"
                      >
                        <Pencil size={14} className="text-slate-400" />
                      </button>

                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="p-2 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg text-slate-800">
                {editId ? "Edit Notice" : "Create Notice"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="Title"
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                rows={3}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              {/* POSTED BY DROPDOWN */}

              <select
                value={form.by}
                onChange={(e) =>
                  setForm({ ...form, by: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">

                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#0a4d44] text-white py-3 rounded-xl"
                >
                  {editId ? "Update" : "Publish"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;