const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (method, url, body) => {
  const token = localStorage.getItem("token");
  const hasBody = body !== undefined && body !== null;
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      // Only send Content-Type on requests with a body — express.json() returns 400 on GET with Content-Type:json
      ...(hasBody && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// ── Auth ─────────────────────────────────────────────
export const authAPI = {
  login: (body) => request("POST", "/auth/login", body),
  register: (body) => request("POST", "/auth/register", body),
  getMe: () => request("GET", "/auth/me"),
  changePassword: (body) => request("PUT", "/auth/change-password", body),
  forgotPassword: (body) => request("POST", "/auth/forgot-password", body),
  resetPassword: (body) => request("POST", "/auth/reset-password", body),
  getAllUsers: () => request("GET", "/auth/users"),
};

// ── Employees ────────────────────────────────────────
export const employeeAPI = {
  getAll: (params = "") => request("GET", `/employees${params}`),
  getOne: (id) => request("GET", `/employees/${id}`),
  create: (body) => request("POST", "/employees", body),
  update: (id, body) => request("PUT", `/employees/${id}`, body),
  delete: (id) => request("DELETE", `/employees/${id}`),
  getStats: () => request("GET", "/employees/stats"),
};

// ── Departments ──────────────────────────────────────
export const departmentAPI = {
  getAll: (params = "") => request("GET", `/departments${params}`),
  create: (body) => request("POST", "/departments", body),
  update: (id, body) => request("PUT", `/departments/${id}`, body),
  delete: (id) => request("DELETE", `/departments/${id}`),
  getAllSubs: () => request("GET", "/departments/sub"),
  createSub: (body) => request("POST", "/departments/sub/create", body),
  updateSub: (id, body) => request("PUT", `/departments/sub/${id}`, body),
  deleteSub: (id) => request("DELETE", `/departments/sub/${id}`),
};

// ── Positions ─────────────────────────────────────────
export const positionAPI = {
  getAll: (params = "") => request("GET", `/positions${params}`),
  create: (body) => request("POST", "/positions", body),
  update: (id, body) => request("PUT", `/positions/${id}`, body),
  delete: (id) => request("DELETE", `/positions/${id}`),
};

// ── Attendance ───────────────────────────────────────
export const attendanceAPI = {
  getAll: (params = "") => request("GET", `/attendance${params}`),
  create: (body) => request("POST", "/attendance", body),
  update: (id, body) => request("PUT", `/attendance/${id}`, body),
  delete: (id) => request("DELETE", `/attendance/${id}`),
  getToday: () => request("GET", "/attendance/today"),
  punchIn: () => request("POST", "/attendance/punch-in"),
  punchOut: () => request("POST", "/attendance/punch-out"),
};

// ── Leaves ───────────────────────────────────────────
export const leaveAPI = {
  getAll: (params = "") => request("GET", `/leaves${params}`),
  create: (body) => request("POST", "/leaves", body),
  update: (id, body) => request("PUT", `/leaves/${id}`, body),
  delete: (id) => request("DELETE", `/leaves/${id}`),
  getHolidays: () => request("GET", "/leaves/holidays"),
  createHoliday: (body) => request("POST", "/leaves/holidays", body),
  updateHoliday: (id, b) => request("PUT", `/leaves/holidays/${id}`, b),
  deleteHoliday: (id) => request("DELETE", `/leaves/holidays/${id}`),
  getWeeklyHolidays: () => request("GET", "/leaves/weekly-holidays"),
  updateWeeklyHoliday: (b) => request("PUT", "/leaves/weekly-holidays", b),
};

// ── Notices ──────────────────────────────────────────
export const noticeAPI = {
  getAll: (params = "") => request("GET", `/notices${params}`),
  create: (body) => request("POST", "/notices", body),
  update: (id, body) => request("PUT", `/notices/${id}`, body),
  delete: (id) => request("DELETE", `/notices/${id}`),
};

// ── Payroll ──────────────────────────────────────────
export const payrollAPI = {
  getAll: (params = "") => request("GET", `/payroll${params}`),
  create: (body) => request("POST", "/payroll", body),
  update: (id, body) => request("PUT", `/payroll/${id}`, body),
  delete: (id) => request("DELETE", `/payroll/${id}`),
  getAdvances: () => request("GET", "/payroll/advances"),
  createAdvance: (body) => request("POST", "/payroll/advances", body),
  updateAdvance: (id, body) => request("PUT", `/payroll/advances/${id}`, body),
  deleteAdvance: (id) => request("DELETE", `/payroll/advances/${id}`),
};

// ── Awards ───────────────────────────────────────────
export const awardAPI = {
  getAll: (params = "") => request("GET", `/awards${params}`),
  create: (body) => request("POST", "/awards", body),
  update: (id, body) => request("PUT", `/awards/${id}`, body),
  delete: (id) => request("DELETE", `/awards/${id}`),
};

// ── Recruitment ──────────────────────────────────────
export const recruitmentAPI = {
  getAll: (params = "") => request("GET", `/recruitment${params}`),
  create: (body) => request("POST", "/recruitment", body),
  update: (id, body) => request("PUT", `/recruitment/${id}`, body),
  delete: (id) => request("DELETE", `/recruitment/${id}`),
};

// ── Loans ────────────────────────────────────────────
export const loanAPI = {
  getAll: (params = "") => request("GET", `/loans${params}`),
  create: (body) => request("POST", "/loans", body),
  update: (id, body) => request("PUT", `/loans/${id}`, body),
  delete: (id) => request("DELETE", `/loans/${id}`),
};

// ── Projects ─────────────────────────────────────────
export const projectAPI = {
  // projects
  getAll: (params = "") => request("GET", `/projects${params}`),
  create: (body) => request("POST", "/projects", body),
  update: (id, body) => request("PUT", `/projects/${id}`, body),
  delete: (id) => request("DELETE", `/projects/${id}`),
  // clients
  getClients: () => request("GET", "/projects/clients"),
  createClient: (body) => request("POST", "/projects/clients", body),
  updateClient: (id, body) => request("PUT", `/projects/clients/${id}`, body),
  deleteClient: (id) => request("DELETE", `/projects/clients/${id}`),
  // tasks
  getTasks: (params = "") => request("GET", `/projects/tasks${params}`),
  createTask: (body) => request("POST", "/projects/tasks", body),
  updateTask: (id, body) => request("PUT", `/projects/tasks/${id}`, body),
  deleteTask: (id) => request("DELETE", `/projects/tasks/${id}`),
};

// ── Meetings ─────────────────────────────────────────
export const meetingAPI = {
  getAll: (params = "") => request("GET", `/meetings${params}`),
  create: (body) => request("POST", "/meetings", body),
  update: (id, body) => request("PUT", `/meetings/${id}`, body),
  delete: (id) => request("DELETE", `/meetings/${id}`),
};

// ── Procurement — per-entity APIs ────────────────────
export const vendorAPI = {
  getAll: () => request("GET", "/procurement/vendors"),
  create: (body) => request("POST", "/procurement/vendors", body),
  update: (id, body) => request("PUT", `/procurement/vendors/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/vendors/${id}`),
};

export const procRequestAPI = {
  getAll: () => request("GET", "/procurement/requests"),
  create: (body) => request("POST", "/procurement/requests", body),
  update: (id, body) => request("PUT", `/procurement/requests/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/requests/${id}`),
};

export const quotationAPI = {
  getAll: () => request("GET", "/procurement/quotations"),
  create: (body) => request("POST", "/procurement/quotations", body),
  update: (id, body) => request("PUT", `/procurement/quotations/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/quotations/${id}`),
};

export const bidAnalysisAPI = {
  getAll: () => request("GET", "/procurement/bid-analysis"),
  create: (body) => request("POST", "/procurement/bid-analysis", body),
  update: (id, body) => request("PUT", `/procurement/bid-analysis/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/bid-analysis/${id}`),
};

export const purchaseOrderAPI = {
  getAll: () => request("GET", "/procurement/purchase-orders"),
  create: (body) => request("POST", "/procurement/purchase-orders", body),
  update: (id, body) => request("PUT", `/procurement/purchase-orders/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/purchase-orders/${id}`),
};

export const goodsReceivedAPI = {
  getAll: () => request("GET", "/procurement/goods-received"),
  create: (body) => request("POST", "/procurement/goods-received", body),
  update: (id, body) => request("PUT", `/procurement/goods-received/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/goods-received/${id}`),
};

export const unitAPI = {
  getAll: () => request("GET", "/procurement/units"),
  create: (body) => request("POST", "/procurement/units", body),
  update: (id, body) => request("PUT", `/procurement/units/${id}`, body),
  delete: (id) => request("DELETE", `/procurement/units/${id}`),
};

// legacy alias — kept for any old imports
export const procurementAPI = procRequestAPI;