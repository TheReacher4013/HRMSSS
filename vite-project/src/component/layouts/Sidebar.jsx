// import { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Award,
//   Building2,
//   User,
//   Plane,
//   Wallet,
//   Bell,
//   CreditCard,
//   ShoppingCart,
//   FolderKanban,
//   ChevronDown,
//   ChevronUp,
//   X,
// } from "lucide-react";

// const Sidebar = ({ isOpen, onClose }) => {
//   const [attendanceOpen, setAttendanceOpen] = useState(false);
//   const [awardOpen, setAwardOpen] = useState(false);
//   const [departmentOpen, setDepartmentOpen] = useState(false);
//   const [employeeOpen, setEmployeeOpen] = useState(false);
//   const [leaveOpen, setLeaveOpen] = useState(false);
//   const [loanOpen, setLoanOpen] = useState(false);
//   const [noticeOpen, setNoticeOpen] = useState(false);
//   const [payrollOpen, setPayrollOpen] = useState(false);
//   const [procurementOpen, setProcurementOpen] = useState(false);
//   const [projectOpen, setProjectOpen] = useState(false);
//   const [recruitmentOpen, setRecruitmentOpen] = useState(false);
//   const [reportsOpen, setReportsOpen] = useState(false);
//   const [rewardOpen, setRewardOpen] = useState(false);
//   const [setupOpen, setSetupOpen] = useState(false);

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <div
//         className={`fixed top-16 bottom-0 left-0 z-50 w-[260px]
//         bg-gradient-to-b from-[#0f3d3e] to-[#062b2c]
//         text-white shadow-2xl
//         transition-transform duration-300
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         {/* HEADER */}
//         <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
//           <h2 className="text-lg font-bold tracking-wide">
//             BIZZFLY
//           </h2>
//           <X
//             onClick={onClose}
//             className="cursor-pointer hover:text-red-400 transition"
//           />
//         </div>

//         {/* MENU */}
//         <nav className="p-4 space-y-2 text-sm overflow-y-auto h-full">

//           <MenuItem
//             to="/dashboard"
//             icon={<Home size={18} />}
//             label="Dashboard"
//             onClose={onClose}
//           />

//           <Dropdown label="Attendance" icon={<Users size={18} />} open={attendanceOpen} setOpen={setAttendanceOpen}>
//             <SubMenu to="/attendance/form" label="Attendance Form" />
//             <SubMenu to="/attendance/monthly" label="Monthly Attendance" />
//             <SubMenu to="/attendance/missing" label="Missing Attendance" />
//           </Dropdown>

//           <Dropdown label="Award" icon={<Award size={18} />} open={awardOpen} setOpen={setAwardOpen}>
//             <SubMenu to="/award/list" label="Award List" />
//           </Dropdown>

//           <Dropdown label="Department" icon={<Building2 size={18} />} open={departmentOpen} setOpen={setDepartmentOpen}>
//             <SubMenu to="/department" label="Department" />
//             <SubMenu to="/department/sub" label="Sub Department" />
//           </Dropdown>

//           <Dropdown label="Employee" icon={<User size={18} />} open={employeeOpen} setOpen={setEmployeeOpen}>
//             <SubMenu to="/employee" label="Employee" />
//             <SubMenu to="/employee/position" label="Position" />
//             <SubMenu to="/employee/performance" label="Performance" />
//           </Dropdown>

//           <Dropdown label="Leave" icon={<Plane size={18} />} open={leaveOpen} setOpen={setLeaveOpen}>
//             <SubMenu to="/leave/weekly-holiday" label="Weekly Holiday" />
//             <SubMenu to="/leave/holiday" label="Holiday" />
//             <SubMenu to="/leave/application" label="Leave Application" />
//           </Dropdown>

//           <Dropdown label="Loan" icon={<Wallet size={18} />} open={loanOpen} setOpen={setLoanOpen}>
//             <SubMenu to="/loan/list" label="Loan List" />
//           </Dropdown>

//           <Dropdown label="Notice Board" icon={<Bell size={18} />} open={noticeOpen} setOpen={setNoticeOpen}>
//             <SubMenu to="/notice" label="Notice" />
//           </Dropdown>

//           <Dropdown label="Payroll" icon={<CreditCard size={18} />} open={payrollOpen} setOpen={setPayrollOpen}>
//             <SubMenu to="/payroll/salary-advance" label="Salary Advance" />
//             <SubMenu to="/payroll/salary-generate" label="Salary Generate" />
//             <SubMenu to="/payroll/manage-employee-salary" label="Manage Employee Salary" />
//           </Dropdown>

//           <Dropdown label="Procurement" icon={<ShoppingCart size={18} />} open={procurementOpen} setOpen={setProcurementOpen}>
//             <SubMenu to="/procurement/request" label="Request" />
//             <SubMenu to="/procurement/quotation" label="Quotation" />
//             <SubMenu to="/procurement/bid-analysis" label="Bid Analysis" />
//             <SubMenu to="/procurement/purchase-order" label="Purchase Order" />
//             <SubMenu to="/procurement/goods-received" label="Goods Received" />
//             <SubMenu to="/procurement/vendors" label="Vendors" />
//             <SubMenu to="/procurement/units" label="Units" />
//           </Dropdown>

//           <Dropdown label="Project Management" icon={<FolderKanban size={18} />} open={projectOpen} setOpen={setProjectOpen}>
//             <SubMenu to="/project/client" label="Client" />
//             <SubMenu to="/project/project" label="Project" />
//             <SubMenu to="/project/tasks" label="Manage Tasks" />
//             <SubMenu to="/project/reports" label="Reports" />
//             <SubMenu to="/project/team" label="Team Members" />
//           </Dropdown>

//           <Dropdown label="Recruitment" icon={<Users size={18} />} open={recruitmentOpen} setOpen={setRecruitmentOpen}>
//             <SubMenu to="/recruitment/candidates" label="Candidate List" />
//             <SubMenu to="/recruitment/shortlist" label="Candidate Shortlist" />
//             <SubMenu to="/recruitment/interview" label="Interview" />
//             <SubMenu to="/recruitment/selection" label="Candidate Selection" />
//           </Dropdown>

//           <Dropdown label="Reports" icon={<FolderKanban size={18} />} open={reportsOpen} setOpen={setReportsOpen}>
//             <SubMenu to="/reports/attendance" label="Attendance Report" />
//             <SubMenu to="/reports/leave" label="Leave Report" />
//             <SubMenu to="/reports/payroll" label="Payroll Report" />
//             <SubMenu to="/reports/adhoc" label="Adhoc Report" />
//           </Dropdown>

//           <Dropdown label="Reward Points" icon={<Award size={18} />} open={rewardOpen} setOpen={setRewardOpen}>
//             <SubMenu to="/reward/settings" label="Point Settings" />
//             <SubMenu to="/reward/categories" label="Point Categories" />
//             <SubMenu to="/reward/management" label="Management Points" />
//             <SubMenu to="/reward/collaborative" label="Collaborative Points" />
//             <SubMenu to="/reward/attendance" label="Attendance Points" />
//             <SubMenu to="/reward/employee" label="Employee Points" />
//           </Dropdown>

//           <Dropdown label="Setup Rules" icon={<Building2 size={18} />} open={setupOpen} setOpen={setSetupOpen}>
//             <SubMenu to="/setup/rules" label="Rules" />
//           </Dropdown>

//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

// /* ------------------ Reusable Components ------------------ */

// const MenuItem = ({ icon, label, to, onClose }) => (
//   <Link
//     to={to}
//     onClick={onClose}
//     className="flex items-center gap-3 px-4 py-2 rounded-lg
//     hover:bg-white/10 transition duration-200"
//   >
//     {icon}
//     <span>{label}</span>
//   </Link>
// );

// const SubMenu = ({ label, to }) => (
//   <Link
//     to={to}
//     className="block px-3 py-1 rounded-md text-gray-300
//     hover:text-white hover:bg-white/10 transition"
//   >
//     {label}
//   </Link>
// );

// const Dropdown = ({ icon, label, open, setOpen, children }) => (
//   <div>
//     <button
//       onClick={() => setOpen(!open)}
//       className="w-full flex justify-between items-center
//       px-4 py-2 rounded-lg hover:bg-white/10 transition"
//     >
//       <div className="flex items-center gap-3">
//         {icon}
//         <span>{label}</span>
//       </div>

//       {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//     </button>

//     {open && (
//       <div className="ml-6 mt-1 space-y-1">
//         {children}
//       </div>
//     )}
//   </div>
// );























import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // <-- Apna Context Hook import karein
import {
  Home, Users, Award, Building2, User, Plane, Wallet, Bell,
  CreditCard, ShoppingCart, FolderKanban, ChevronDown, ChevronUp, X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  // --- Context se User nikalna ---
  const { user } = useAuth();
  const userRole = user?.role || "employee"; // Default to employee

  // Dropdown States
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  // Roles Definition
  const isAdmin = userRole === "admin" || userRole === "hr";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-16 bottom-0 left-0 z-50 w-[260px]
        bg-gradient-to-b from-[#0f3d3e] to-[#062b2c]
        text-white shadow-2xl
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold tracking-wide">BIZZFLY</h2>
          <X onClick={onClose} className="cursor-pointer hover:text-red-400 transition lg:hidden" />
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2 text-sm overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">

          <MenuItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" onClose={onClose} />

          {/* Attendance - Everyone */}
          <Dropdown label="Attendance" icon={<Users size={18} />} open={openMenus.attendance} setOpen={() => toggleMenu('attendance')}>
            <SubMenu to="/attendance/form" label="Attendance Form" onClose={onClose} />
            {isAdmin && <SubMenu to="/attendance/monthly" label="Monthly Attendance" onClose={onClose} />}
          </Dropdown>

          {/* Award - Admin Only */}
          {isAdmin && (
            <Dropdown label="Award" icon={<Award size={18} />} open={openMenus.award} setOpen={() => toggleMenu('award')}>
              <SubMenu to="/award/list" label="Award List" onClose={onClose} />
            </Dropdown>
          )}

          {/* Department - Admin Only */}
          {isAdmin && (
            <Dropdown label="Department" icon={<Building2 size={18} />} open={openMenus.department} setOpen={() => toggleMenu('department')}>
              <SubMenu to="/department" label="Department" onClose={onClose} />
            </Dropdown>
          )}

          {/* Employee - Admin/HR Only */}
          {isAdmin && (
            <Dropdown label="Employee" icon={<User size={18} />} open={openMenus.employee} setOpen={() => toggleMenu('employee')}>
              <SubMenu to="/employee" label="Employee" onClose={onClose} />
              <SubMenu to="/employee/position" label="Position" onClose={onClose} />
            </Dropdown>
          )}

          {/* Leave - Everyone */}
          <Dropdown label="Leave" icon={<Plane size={18} />} open={openMenus.leave} setOpen={() => toggleMenu('leave')}>
            <SubMenu to="/leave/application" label="Leave Application" onClose={onClose} />
          </Dropdown>

          {/* Loan - Everyone */}
          <Dropdown label="Loan" icon={<Wallet size={18} />} open={openMenus.loan} setOpen={() => toggleMenu('loan')}>
            <SubMenu to="/loan/list" label="Loan List" onClose={onClose} />
          </Dropdown>

          {/* Payroll - Admin Only */}
          {isAdmin && (
            <Dropdown label="Payroll" icon={<CreditCard size={18} />} open={openMenus.payroll} setOpen={() => toggleMenu('payroll')}>
              <SubMenu to="/payroll/salary-generate" label="Salary Generate" onClose={onClose} />
              <SubMenu to="/payroll/manage-employee-salary" label="Manage Salary" onClose={onClose} />
            </Dropdown>
          )}

          {/* Project Management - Everyone */}
          <Dropdown label="Project Management" icon={<FolderKanban size={18} />} open={openMenus.project} setOpen={() => toggleMenu('project')}>
            <SubMenu to="/project/project" label="Project" onClose={onClose} />
            <SubMenu to="/project/tasks" label="Manage Tasks" onClose={onClose} />
          </Dropdown>

          {/* Recruitment - Admin Only */}
          {isAdmin && (
            <Dropdown label="Recruitment" icon={<Users size={18} />} open={openMenus.recruitment} setOpen={() => toggleMenu('recruitment')}>
              <SubMenu to="/recruitment/candidates" label="Candidate List" onClose={onClose} />
            </Dropdown>
          )}

        </nav>
      </div>
    </>
  );
};

export default Sidebar;

/* ------------------ Sub Components ------------------ */

const MenuItem = ({ icon, label, to, onClose }) => (
  <Link
    to={to}
    onClick={onClose}
    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition duration-200"
  >
    {icon} <span>{label}</span>
  </Link>
);

const SubMenu = ({ label, to, onClose }) => (
  <Link
    to={to}
    onClick={onClose}
    className="block px-3 py-2 ml-9 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition"
  >
    {label}
  </Link>
);

const Dropdown = ({ icon, label, open, setOpen, children }) => (
  <div>
    <button
      onClick={setOpen}
      className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-white/10 transition"
    >
      <div className="flex items-center gap-3">
        {icon} <span>{label}</span>
      </div>
      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {open && <div className="mt-1 space-y-1">{children}</div>}
  </div>
);