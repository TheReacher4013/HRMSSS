import { useState } from "react";

const AttendanceWidget = () => {
  const [status, setStatus] = useState("");

  const todayDate = () =>
    new Date().toLocaleDateString("en-GB"); 

  const currentTime = () =>
    new Date().toLocaleTimeString("en-IN");

  const notifyUpdate = () => {
    window.dispatchEvent(new Event("attendanceUpdated"));
  };

  const punchIn = () => {
    let data = JSON.parse(localStorage.getItem("attendance")) || [];

    const today = todayDate();
    const exists = data.find((d) => d.date === today);

    if (exists) {
      alert("Already punched in today");
      return;
    }

    data.push({
      date: today,
      punchIn: currentTime(),
      punchOut: "",
    });

    localStorage.setItem("attendance", JSON.stringify(data));
    setStatus("Punched In");
    notifyUpdate();
  };

  const punchOut = () => {
    let data = JSON.parse(localStorage.getItem("attendance")) || [];
    const today = todayDate();

    const record = data.find((d) => d.date === today);

    if (!record) {
      alert("Punch In first");
      return;
    }

    record.punchOut = currentTime();
    localStorage.setItem("attendance", JSON.stringify(data));

    setStatus("Punched Out");
    notifyUpdate();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Attendance
        </h2>
        <span className="text-sm text-gray-500">
          {todayDate()}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">

        <button
          onClick={punchIn}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500
          hover:from-green-700 hover:to-emerald-600
          text-white py-3 rounded-xl font-medium
          shadow-md hover:shadow-lg transition duration-300"
        >
          Punch In
        </button>

        <button
          onClick={punchOut}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500
          hover:from-red-600 hover:to-pink-600
          text-white py-3 rounded-xl font-medium
          shadow-md hover:shadow-lg transition duration-300"
        >
          Punch Out
        </button>

      </div>

      {/* Status */}
      {status && (
        <div className="mt-6">
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium
            ${status === "Punched In"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
              }`}
          >
            {status}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceWidget;