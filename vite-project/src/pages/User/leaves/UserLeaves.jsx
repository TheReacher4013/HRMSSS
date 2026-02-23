import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const UserLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // LocalStorage se leaves ka data fetch ho raha hai
    const stored = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(stored);
  }, []);

  // Filter stats (logic)
  const pending = leaves.filter(l => l.status === "Pending").length;
  const approved = leaves.filter(l => l.status === "Approved").length;

  return (
    <div className="min-h-screen w-full bg-[#f8fafa] p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e2e]">My Leave History</h1>
            <p className="text-gray-500 text-sm mt-1">Track your time-off requests and status</p>
          </div>

          <div className="flex gap-2">
            <StatMini label="Pending" count={pending} color="bg-orange-500" />
            <StatMini label="Approved" count={approved} color="bg-emerald-500" />
          </div>
        </div>

        {/* Leave Records Grid/List */}
        <div className="grid grid-cols-1 gap-4">
          {leaves.length === 0 ? (
            <div className="py-20 bg-white rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6 shadow-sm">
              <div className="p-4 bg-gray-50 rounded-full mb-4 text-gray-300">
                <Calendar size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#0f2e2e]">No Leave Records</h3>
              <p className="text-gray-400 text-sm max-w-xs">You haven't applied for any leaves yet.</p>
            </div>
          ) : (
            leaves.map((leave, i) => (
              <div key={i} className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all group">

                {/* Left Side: Date & Type */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-3.5 bg-gray-50 text-[#0f2e2e] rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f2e2e] text-sm sm:text-base">{leave.type}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {leave.from} <span className="mx-1">→</span> {leave.to}
                    </p>
                  </div>
                </div>

                {/* Middle: Reason (Hidden on very small screens or truncated) */}
                <div className="flex-1 px-0 sm:px-6 w-full">
                  <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 italic line-clamp-1">"{leave.reason}"</p>
                  </div>
                </div>

                {/* Right Side: Status Badge */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <StatusBadge status={leave.status} />
                  <button className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                    <AlertCircle size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const StatMini = ({ label, count, color }) => (
  <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-gray-400 uppercase leading-none">{label}</span>
      <span className="text-sm font-bold text-[#0f2e2e]">{count}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-orange-100 text-orange-600",
    Approved: "bg-emerald-100 text-emerald-600",
    Rejected: "bg-rose-100 text-rose-600",
  };

  const Icons = {
    Pending: <Clock size={12} />,
    Approved: <CheckCircle size={12} />,
    Rejected: <XCircle size={12} />,
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 ${styles[status] || styles.Pending}`}>
      {Icons[status] || Icons.Pending}
      {status || "Pending"}
    </span>
  );
};

export default UserLeaves;