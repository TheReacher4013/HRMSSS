// ============================================================
//  api.js  –  Central API helper for HRMS Frontend
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const api = {
  get:    (url)       => request(url),
  post:   (url, body) => request(url, { method: "POST",   body: JSON.stringify(body) }),
  put:    (url, body) => request(url, { method: "PUT",    body: JSON.stringify(body) }),
  delete: (url)       => request(url, { method: "DELETE" }),
};

export const authAPI       = { login: (d) => api.post("/auth/login", d), register: (d) => api.post("/auth/register", d), getMe: () => api.get("/auth/me") };
export const employeeAPI   = { getAll: (p="") => api.get(`/employees?${p}`), getOne: (id) => api.get(`/employees/${id}`), create: (d) => api.post("/employees", d), update: (id, d) => api.put(`/employees/${id}`, d), remove: (id) => api.delete(`/employees/${id}`) };
export const departmentAPI = { getAll: () => api.get("/departments"), create: (d) => api.post("/departments", d), update: (id, d) => api.put(`/departments/${id}`, d), remove: (id) => api.delete(`/departments/${id}`) };
export const attendanceAPI = { getAll: (p="") => api.get(`/attendance?${p}`), getMonthly: (p="") => api.get(`/attendance/monthly?${p}`), getMissing: () => api.get("/attendance/missing"), create: (d) => api.post("/attendance", d), update: (id, d) => api.put(`/attendance/${id}`, d), remove: (id) => api.delete(`/attendance/${id}`) };
export const leaveAPI      = { getAll: (p="") => api.get(`/leaves?${p}`), create: (d) => api.post("/leaves", d), update: (id, d) => api.put(`/leaves/${id}`, d), remove: (id) => api.delete(`/leaves/${id}`) };
export const payrollAPI    = { getAdvances: (p="") => api.get(`/payroll/advance?${p}`), createAdvance: (d) => api.post("/payroll/advance", d), updateAdvance: (id, d) => api.put(`/payroll/advance/${id}`, d), deleteAdvance: (id) => api.delete(`/payroll/advance/${id}`), generateSalaries: (d) => api.post("/payroll/generate", d), getSalaries: (p="") => api.get(`/payroll/salaries?${p}`), updateSalaryStatus: (id, d) => api.put(`/payroll/salaries/${id}`, d) };
export const loanAPI       = { getAll: (p="") => api.get(`/loans?${p}`), create: (d) => api.post("/loans", d), update: (id, d) => api.put(`/loans/${id}`, d), remove: (id) => api.delete(`/loans/${id}`) };
export const noticeAPI     = { getAll: (p="") => api.get(`/notices?${p}`), create: (d) => api.post("/notices", d), update: (id, d) => api.put(`/notices/${id}`, d), remove: (id) => api.delete(`/notices/${id}`) };
export const hrAPI         = { getAwards: () => api.get("/hr/awards"), createAward: (d) => api.post("/hr/awards", d), updateAward: (id, d) => api.put(`/hr/awards/${id}`, d), deleteAward: (id) => api.delete(`/hr/awards/${id}`), getPositions: () => api.get("/hr/positions"), createPosition: (d) => api.post("/hr/positions", d), updatePosition: (id, d) => api.put(`/hr/positions/${id}`, d), deletePosition: (id) => api.delete(`/hr/positions/${id}`), getPerformances: () => api.get("/hr/performance"), createPerformance: (d) => api.post("/hr/performance", d), updatePerformance: (id, d) => api.put(`/hr/performance/${id}`, d), deletePerformance: (id) => api.delete(`/hr/performance/${id}`), getSubDepts: (p="") => api.get(`/hr/sub-departments?${p}`), createSubDept: (d) => api.post("/hr/sub-departments", d), updateSubDept: (id, d) => api.put(`/hr/sub-departments/${id}`, d), deleteSubDept: (id) => api.delete(`/hr/sub-departments/${id}`), getHolidays: () => api.get("/hr/holidays"), createHoliday: (d) => api.post("/hr/holidays", d), updateHoliday: (id, d) => api.put(`/hr/holidays/${id}`, d), deleteHoliday: (id) => api.delete(`/hr/holidays/${id}`), getWeeklyHolidays: () => api.get("/hr/weekly-holidays"), setWeeklyHoliday: (d) => api.post("/hr/weekly-holidays", d) };
export const procurementAPI = { getRequests: () => api.get("/procurement/requests"), createRequest: (d) => api.post("/procurement/requests", d), updateRequest: (id, d) => api.put(`/procurement/requests/${id}`, d), deleteRequest: (id) => api.delete(`/procurement/requests/${id}`), getVendors: () => api.get("/procurement/vendors"), createVendor: (d) => api.post("/procurement/vendors", d), updateVendor: (id, d) => api.put(`/procurement/vendors/${id}`, d), deleteVendor: (id) => api.delete(`/procurement/vendors/${id}`), getUnits: () => api.get("/procurement/units"), createUnit: (d) => api.post("/procurement/units", d), updateUnit: (id, d) => api.put(`/procurement/units/${id}`, d), deleteUnit: (id) => api.delete(`/procurement/units/${id}`), getPOs: () => api.get("/procurement/purchase-orders"), createPO: (d) => api.post("/procurement/purchase-orders", d), updatePO: (id, d) => api.put(`/procurement/purchase-orders/${id}`, d), deletePO: (id) => api.delete(`/procurement/purchase-orders/${id}`), getGRNs: () => api.get("/procurement/goods-received"), createGRN: (d) => api.post("/procurement/goods-received", d), updateGRN: (id, d) => api.put(`/procurement/goods-received/${id}`, d), deleteGRN: (id) => api.delete(`/procurement/goods-received/${id}`) };
export const projectAPI    = { getClients: () => api.get("/projects/clients"), createClient: (d) => api.post("/projects/clients", d), updateClient: (id, d) => api.put(`/projects/clients/${id}`, d), deleteClient: (id) => api.delete(`/projects/clients/${id}`), getProjects: () => api.get("/projects/projects"), createProject: (d) => api.post("/projects/projects", d), updateProject: (id, d) => api.put(`/projects/projects/${id}`, d), deleteProject: (id) => api.delete(`/projects/projects/${id}`), getTasks: (p="") => api.get(`/projects/tasks?${p}`), createTask: (d) => api.post("/projects/tasks", d), updateTask: (id, d) => api.put(`/projects/tasks/${id}`, d), deleteTask: (id) => api.delete(`/projects/tasks/${id}`), getTeam: (p="") => api.get(`/projects/team?${p}`), addMember: (d) => api.post("/projects/team", d), removeMember: (id) => api.delete(`/projects/team/${id}`), getReports: () => api.get("/projects/reports") };
export const recruitmentAPI = { getCandidates: (p="") => api.get(`/recruitment/candidates?${p}`), createCandidate: (d) => api.post("/recruitment/candidates", d), updateCandidate: (id, d) => api.put(`/recruitment/candidates/${id}`, d), deleteCandidate: (id) => api.delete(`/recruitment/candidates/${id}`), getShortlisted: () => api.get("/recruitment/shortlisted"), getSelected: () => api.get("/recruitment/selected"), getInterviews: () => api.get("/recruitment/interviews"), createInterview: (d) => api.post("/recruitment/interviews", d), updateInterview: (id, d) => api.put(`/recruitment/interviews/${id}`, d), deleteInterview: (id) => api.delete(`/recruitment/interviews/${id}`) };
export const reportAPI     = { getDashboard: () => api.get("/reports/dashboard"), getAttendance: (p="") => api.get(`/reports/attendance?${p}`), getEmployees: () => api.get("/reports/employees"), getLeaves: () => api.get("/reports/leaves"), getPayroll: (p="") => api.get(`/reports/payroll?${p}`) };
