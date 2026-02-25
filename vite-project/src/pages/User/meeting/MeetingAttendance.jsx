import { useState, useMemo } from "react";
import { Eye, Pencil } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const MeetingAttendees = () => {
  const [data] = useState([
    {
      id: 31,
      name: "Amie Jerde",
      required: true,
      meeting: "Project Alpha Review",
      meetingDate: "2025-09-26",
      rsvp: "Accepted",
      attendance: "Not Attended",
      rsvpDate: "2025-09-25",
      reason: "-",
    },
    {
      id: 32,
      name: "Brett Conroy",
      required: true,
      meeting: "Project Alpha Review",
      meetingDate: "2025-09-26",
      rsvp: "Declined",
      attendance: "Not Attended",
      rsvpDate: "2025-09-25",
      reason: "Conflicting meeting schedule",
    },
    {
      id: 33,
      name: "HR",
      required: false,
      meeting: "Project Alpha Review",
      meetingDate: "2025-09-26",
      rsvp: "Accepted",
      attendance: "Not Attended",
      rsvpDate: "2025-09-25",
      reason: "-",
    },
    {
      id: 34,
      name: "Orpha Nolan",
      required: true,
      meeting: "Project Alpha Review",
      meetingDate: "2025-09-26",
      rsvp: "Accepted",
      attendance: "Not Attended",
      rsvpDate: "2025-09-25",
      reason: "-",
    },
    {
      id: 35,
      name: "Manager",
      required: true,
      meeting: "Project Alpha Review",
      meetingDate: "2025-09-26",
      rsvp: "Accepted",
      attendance: "Not Attended",
      rsvpDate: "2025-09-25",
      reason: "-",
    },
    {
      id: 36,
      name: "Amie Jerde",
      required: true,
      meeting: "Daily Scrum Meeting",
      meetingDate: "2025-10-19",
      rsvp: "Accepted",
      attendance: "Not Attended",
      rsvpDate: "2025-10-18",
      reason: "-",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* 🔍 Search */
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.name} ${item.meeting} ${item.rsvp}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  /* 📄 Pagination */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const pageData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const badge = (text, type) => {
    const styles = {
      Accepted: "bg-green-100 text-green-700",
      Declined: "bg-red-100 text-red-600",
      Tentative: "bg-yellow-100 text-yellow-700",
      "Not Attended": "bg-red-100 text-red-600",
    };
    return (
      <span className={`px-3 py-1 text-xs rounded-full ${styles[text]}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="p-6 bg-[#f8fafa] min-h-screen">
      <div className="bg-white rounded-2xl shadow p-5">

        <h1 className="text-2xl font-bold mb-4">Meeting Attendees</h1>

        {/* 🔍 Search */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2 mb-4 w-full max-w-sm"
        />

        {/* 📋 Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Attendee</th>
                <th className="p-3 text-left">Meeting</th>
                <th className="p-3 text-left">RSVP</th>
                <th className="p-3 text-left">Attendance</th>
                <th className="p-3 text-left">RSVP Date</th>
                <th className="p-3 text-left">Decline Reason</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageData.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{item.name}</p>
                    <p
                      className={`text-xs ${
                        item.required ? "text-red-500" : "text-blue-500"
                      }`}
                    >
                      {item.required ? "Required" : "Optional"}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{item.meeting}</p>
                    <p className="text-xs text-gray-500">
                      {item.meetingDate}
                    </p>
                  </td>
                  <td className="p-3">{badge(item.rsvp)}</td>
                  <td className="p-3">{badge(item.attendance)}</td>
                  <td className="p-3">{item.rsvpDate}</td>
                  <td className="p-3">{item.reason}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600 cursor-pointer" />
                      <Pencil className="w-4 h-4 text-orange-500 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}

              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(page * ITEMS_PER_PAGE, filteredData.length)} of{" "}
            {filteredData.length}
          </span>

          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-green-600 text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MeetingAttendees;