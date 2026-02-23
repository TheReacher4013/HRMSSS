// import { useState } from "react";

// const AttendanceWidget = () => {
//   const [status, setStatus] = useState("");

//   const todayDate = () =>
//     new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

//   const currentTime = () =>
//     new Date().toLocaleTimeString("en-IN");

//   const notifyUpdate = () => {
//     window.dispatchEvent(new Event("attendanceUpdated"));
//   };

//   const punchIn = () => {
//     let data = JSON.parse(localStorage.getItem("attendance")) || [];

//     const today = todayDate();
//     const exists = data.find((d) => d.date === today);

//     if (exists) {
//       alert("Already punched in today");
//       return;
//     }

//     data.push({
//       date: today,
//       punchIn: currentTime(),
//       punchOut: "",
//     });

//     localStorage.setItem("attendance", JSON.stringify(data));
//     setStatus("Punched In");
//     notifyUpdate();
//   };

//   const punchOut = () => {
//     let data = JSON.parse(localStorage.getItem("attendance")) || [];
//     const today = todayDate();

//     const record = data.find((d) => d.date === today);

//     if (!record) {
//       alert("Punch In first");
//       return;
//     }

//     record.punchOut = currentTime();
//     localStorage.setItem("attendance", JSON.stringify(data));

//     setStatus("Punched Out");
//     notifyUpdate();
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Attendance
//         </h2>
//         <span className="text-sm text-gray-500">
//           {todayDate()}
//         </span>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4">

//         <button
//           onClick={punchIn}
//           className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500
//           hover:from-green-700 hover:to-emerald-600
//           text-white py-3 rounded-xl font-medium
//           shadow-md hover:shadow-lg transition duration-300"
//         >
//           Punch In
//         </button>

//         <button
//           onClick={punchOut}
//           className="flex-1 bg-gradient-to-r from-red-500 to-pink-500
//           hover:from-red-600 hover:to-pink-600
//           text-white py-3 rounded-xl font-medium
//           shadow-md hover:shadow-lg transition duration-300"
//         >
//           Punch Out
//         </button>

//       </div>

//       {/* Status */}
//       {status && (
//         <div className="mt-6">
//           <div
//             className={`inline-block px-4 py-2 rounded-full text-sm font-medium
//             ${status === "Punched In"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-600"
//               }`}
//           >
//             {status}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceWidget;







import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Path apne hisaab se check karein

const AttendanceWidget = () => {
  const { user, token } = useAuth(); // Context se user info aur token nikalna
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const todayDate = () => new Date().toLocaleDateString("en-GB");

  // --- Backend API Call ---
  const handleAttendance = async (type) => {
    if (!user || !user._id) {
      alert("User not authenticated!");
      return;
    }

    setLoading(true);
    try {
      const endpoint = type === "IN"
        ? "http://localhost:5000/api/attendance/punch-in"
        : "http://localhost:5000/api/attendance/punch-out";

      const response = await axios.post(
        endpoint,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } } // Security ke liye token
      );

      setStatus(type === "IN" ? "Punched In" : "Punched Out");
      setLastAction(new Date().toLocaleTimeString());
      alert(response.data.message || "Success!");

      // Sidebar ya dashboard ko update karne ke liye event
      window.dispatchEvent(new Event("attendanceUpdated"));

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Daily Attendance</h2>
          <p className="text-xs text-gray-400">Mark your presence</p>
        </div>
        <div className="text-right">
          <span className="block text-sm font-medium text-indigo-600">{todayDate()}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Date Today</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleAttendance("IN")}
          disabled={loading || status === "Punched In"}
          className={`flex-1 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 active:scale-95
            ${status === "Punched In"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-green-200"
            }`}
        >
          {loading && status === "" ? "Wait..." : "Punch In"}
        </button>

        <button
          onClick={() => handleAttendance("OUT")}
          disabled={loading || status === "Punched Out" || status === ""}
          className={`flex-1 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 active:scale-95
            ${(status === "Punched Out" || status === "")
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-red-200"
            }`}
        >
          {loading && status === "Punched In" ? "Wait..." : "Punch Out"}
        </button>
      </div>

      {/* Status Info */}
      {status && (
        <div className="mt-6 p-4 rounded-2xl bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${status === "Punched In" ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm font-medium text-gray-700">{status}</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">at {lastAction}</span>
        </div>
      )}
    </div>
  );
};

export default AttendanceWidget;