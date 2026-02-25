import { useState } from "react";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Holiday Notice",
      description: "Office will remain closed on 26th Jan due to Republic Day.",
      priority: "High",
      date: "2026-01-24",
      read: false,
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Monthly team meeting on Friday at 4 PM.",
      priority: "Medium",
      date: "2026-01-22",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotices(
      notices.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const priorityColor = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-600";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">📢 Notice Board</h2>

      <div className="grid gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {notice.title}
                {!notice.read && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    New
                  </span>
                )}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full ${priorityColor(
                  notice.priority
                )}`}
              >
                {notice.priority}
              </span>
            </div>

            <p className="text-gray-600 mt-2">{notice.description}</p>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>📅 {notice.date}</span>

              {!notice.read && (
                <button
                  onClick={() => markAsRead(notice.id)}
                  className="text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;