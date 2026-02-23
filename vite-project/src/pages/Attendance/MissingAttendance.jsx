// const MissingAttendance = () => {
//   return <h1 className="text-xl font-bold">Missing Attendance</h1>;
// };
// export default MissingAttendance;

// MissingAttendance.jsx ke andar ka code


// import React from 'react';

// const MissingAttendance = () => {
//   return (
//     <div>
//       <h1>Missing Attendance Page</h1>
//     </div>
//   );
// };

// export default MissingAttendance; 





import React from 'react';
import DataTable from '../../component/DataTable'; // Path check kar lena
import { useAuth } from "../../context/AuthContext";

const MissingAttendance = () => {
  const { token } = useAuth();

  // Table ki columns define karte hain
  const columns = [
    { key: "employeeName", label: "Employee Name" },
    { key: "date", label: "Date" },
    { key: "punchIn", label: "Punch In Time" },
    { key: "status", label: "Current Status" },
    { key: "action_needed", label: "Correction Required" }
  ];

  return (
    <div className="min-h-screen bg-[#f4f1fb]">
      <div className="max-w-7xl mx-auto py-8 px-4">

        {/* Info Section */}
        <div className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div>
              <h3 className="text-amber-800 font-bold text-sm">Action Required</h3>
              <p className="text-amber-700 text-xs">
                Below are the records where employees forgot to Punch Out. Please update their out-time manually.
              </p>
            </div>
          </div>
        </div>

        {/* Humara DataTable yahan use hoga */}
        <DataTable
          title="Missing Punch-Out Records"
          addLabel="Log Missing Entry"
          apiEndpoint="http://localhost:5000/api/attendance/missing" // Backend endpoint
          columns={columns}
        />

      </div>
    </div>
  );
};

export default MissingAttendance;