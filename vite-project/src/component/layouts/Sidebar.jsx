import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Award,
  Building2,
  User,
  Plane,
  Wallet,
  Bell,
  CreditCard,
  ShoppingCart,
  FolderKanban,
  ChevronDown,
  ChevronUp,
  X,
  Video,
  Settings,
  Star,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [awardOpen, setAwardOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [procurementOpen, setProcurementOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

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
        style={{ height: "calc(100vh - 64px)" }}
      >

        <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold tracking-wide">BIZZFLY</h2>
          <X onClick={onClose} className="cursor-pointer hover:text-red-400 transition" />
        </div>

        <nav
          className="p-4 space-y-2 text-sm"
          style={{ overflowY: "auto", height: "calc(100% - 65px)", paddingBottom: "40px" }}
        >

          <MenuItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" onClose={onClose} />

          <Dropdown label="Attendance" icon={<Users size={18} />} open={attendanceOpen} setOpen={setAttendanceOpen}>
            <SubMenu to="/attendance/form" label="Attendance Form" />
            <SubMenu to="/attendance/monthly" label="Monthly Attendance" />
            <SubMenu to="/attendance/missing" label="Missing Attendance" />
          </Dropdown>

          <Dropdown label="Award" icon={<Award size={18} />} open={awardOpen} setOpen={setAwardOpen}>
            <SubMenu to="/award/list" label="Award List" />
          </Dropdown>

          <Dropdown label="Department" icon={<Building2 size={18} />} open={departmentOpen} setOpen={setDepartmentOpen}>
            <SubMenu to="/department" label="Department" />
            <SubMenu to="/department/sub" label="Sub Department" />
          </Dropdown>

          <Dropdown label="Employee" icon={<User size={18} />} open={employeeOpen} setOpen={setEmployeeOpen}>
            <SubMenu to="/employee" label="Employee" />
            <SubMenu to="/employee/position" label="Position" />
            <SubMenu to="/employee/performance" label="Performance" />
          </Dropdown>

          <Dropdown label="Leave" icon={<Plane size={18} />} open={leaveOpen} setOpen={setLeaveOpen}>
            <SubMenu to="/leave/weekly-holiday" label="Weekly Holiday" />
            <SubMenu to="/leave/holiday" label="Holiday" />
            <SubMenu to="/leave/application" label="Leave Application" />
          </Dropdown>

          <Dropdown label="Loan" icon={<Wallet size={18} />} open={loanOpen} setOpen={setLoanOpen}>
            <SubMenu to="/loan/list" label="Loan List" />
          </Dropdown>

          <Dropdown label="Notice Board" icon={<Bell size={18} />} open={noticeOpen} setOpen={setNoticeOpen}>
            <SubMenu to="/notice" label="Notice" />
          </Dropdown>

          <Dropdown label="Meetings" icon={<Video size={18} />} open={meetingOpen} setOpen={setMeetingOpen}>
            <SubMenu to="/meeting" label="All Meetings" />
          </Dropdown>

          <Dropdown label="Payroll" icon={<CreditCard size={18} />} open={payrollOpen} setOpen={setPayrollOpen}>
            <SubMenu to="/payroll/salary-advance" label="Salary Advance" />
            <SubMenu to="/payroll/salary-generate" label="Salary Generate" />
            <SubMenu to="/payroll/manage-employee-salary" label="Manage Employee Salary" />
          </Dropdown>

          <Dropdown label="Procurement" icon={<ShoppingCart size={18} />} open={procurementOpen} setOpen={setProcurementOpen}>
            <SubMenu to="/procurement/request" label="Request" />
            <SubMenu to="/procurement/quotation" label="Quotation" />
            <SubMenu to="/procurement/bid-analysis" label="Bid Analysis" />
            <SubMenu to="/procurement/purchase-order" label="Purchase Order" />
            <SubMenu to="/procurement/goods-received" label="Goods Received" />
            <SubMenu to="/procurement/vendors" label="Vendors" />
            <SubMenu to="/procurement/units" label="Units" />
          </Dropdown>

          <Dropdown label="Project" icon={<FolderKanban size={18} />} open={projectOpen} setOpen={setProjectOpen}>
            <SubMenu to="/project/client" label="Client" />
            <SubMenu to="/project/project" label="Project" />
            <SubMenu to="/project/tasks" label="Manage Tasks" />
            <SubMenu to="/project/reports" label="Reports" />
            <SubMenu to="/project/team" label="Team Members" />
          </Dropdown>

          <Dropdown label="Recruitment" icon={<Users size={18} />} open={recruitmentOpen} setOpen={setRecruitmentOpen}>
            <SubMenu to="/recruitment/candidates" label="Candidate List" />
            <SubMenu to="/recruitment/shortlist" label="Candidate Shortlist" />
            <SubMenu to="/recruitment/interview" label="Interview" />
            <SubMenu to="/recruitment/selection" label="Candidate Selection" />
          </Dropdown>

          <Dropdown label="Reports" icon={<FolderKanban size={18} />} open={reportsOpen} setOpen={setReportsOpen}>
            <SubMenu to="/reports/attendance" label="Attendance Report" />
            <SubMenu to="/reports/leave" label="Leave Report" />
            <SubMenu to="/reports/payroll" label="Payroll Report" />
            <SubMenu to="/reports/adhoc" label="Adhoc Report" />
          </Dropdown>

          <Dropdown label="Reward Points" icon={<Star size={18} />} open={rewardOpen} setOpen={setRewardOpen}>
            <SubMenu to="/rewards/point-settings" label="Point Settings" />
            <SubMenu to="/rewards/point-categories" label="Point Categories" />
            <SubMenu to="/rewards/management-points" label="Management Points" />
            <SubMenu to="/rewards/collaborative" label="Collaborative Points" />
            <SubMenu to="/rewards/attendance-points" label="Attendance Points" />
            <SubMenu to="/rewards/employee-points" label="Employee Points" />
          </Dropdown>

          <Dropdown label="Setup Rules" icon={<Settings size={18} />} open={setupOpen} setOpen={setSetupOpen}>
            <SubMenu to="/setup-rules/setup" label="Rules" />
          </Dropdown>

        </nav>
      </div>
    </>
  );
};

export default Sidebar;


const MenuItem = ({ icon, label, to, onClose }) => (
  <Link
    to={to}
    onClick={onClose}
    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition duration-200"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const SubMenu = ({ label, to }) => (
  <Link
    to={to}
    className="block px-3 py-1 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition"
  >
    {label}
  </Link>
);

const Dropdown = ({ icon, label, open, setOpen, children }) => (
  <div>
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-white/10 transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>

    {open && (
      <div className="ml-6 mt-1 space-y-1">
        {children}
      </div>
    )}
  </div>
);