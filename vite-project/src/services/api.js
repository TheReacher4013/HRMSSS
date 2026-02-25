// // src/services/api.js
// // Central API utility — all backend calls go through here

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // ─── Helpers ──────────────────────────────────────────────────────────────

// const getToken = () => localStorage.getItem("token");

// const headers = () => ({
//   "Content-Type": "application/json",
//   ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
// });

// const request = async (method, path, body = null) => {
//   const options = { method, headers: headers() };
//   if (body) options.body = JSON.stringify(body);

//   const res = await fetch(`${BASE_URL}${path}`, options);
//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "API error");
//   }
//   return data;
// };

// // ─── Auth ──────────────────────────────────────────────────────────────────
// export const authAPI = {
//   login:          (body) => request("POST", "/auth/login", body),
//   register:       (body) => request("POST", "/auth/register", body),
//   getMe:          ()     => request("GET",  "/auth/me"),
//   changePassword: (body) => request("PUT",  "/auth/change-password", body),
// };

// // ─── Employees ─────────────────────────────────────────────────────────────
// export const employeeAPI = {
//   getAll:   (params = "") => request("GET",    `/employees${params}`),
//   getOne:   (id)          => request("GET",    `/employees/${id}`),
//   getStats: ()            => request("GET",    "/employees/stats"),
//   create:   (body)        => request("POST",   "/employees", body),
//   update:   (id, body)    => request("PUT",    `/employees/${id}`, body),
//   delete:   (id)          => request("DELETE", `/employees/${id}`),
// };

// // ─── Departments ───────────────────────────────────────────────────────────
// export const departmentAPI = {
//   getAll:         ()         => request("GET",    "/departments"),
//   create:         (body)     => request("POST",   "/departments", body),
//   update:         (id, body) => request("PUT",    `/departments/${id}`, body),
//   delete:         (id)       => request("DELETE", `/departments/${id}`),
//   getAllSubs:      ()         => request("GET",    "/departments/sub"),
//   createSub:      (body)     => request("POST",   "/departments/sub/create", body),
//   updateSub:      (id, body) => request("PUT",    `/departments/sub/${id}`, body),
//   deleteSub:      (id)       => request("DELETE", `/departments/sub/${id}`),
// };

// // ─── Attendance ────────────────────────────────────────────────────────────
// export const attendanceAPI = {
//   getAll:   (params = "") => request("GET",    `/attendance${params}`),
//   getMissing: (date)      => request("GET",    `/attendance/missing?date=${date}`),
//   create:   (body)        => request("POST",   "/attendance", body),
//   update:   (id, body)    => request("PUT",    `/attendance/${id}`, body),
//   delete:   (id)          => request("DELETE", `/attendance/${id}`),
// };

// // ─── Leaves ────────────────────────────────────────────────────────────────
// export const leaveAPI = {
//   getAll:            (params = "") => request("GET",    `/leaves${params}`),
//   create:            (body)        => request("POST",   "/leaves", body),
//   update:            (id, body)    => request("PUT",    `/leaves/${id}`, body),
//   delete:            (id)          => request("DELETE", `/leaves/${id}`),
//   getHolidays:       ()            => request("GET",    "/leaves/holidays"),
//   createHoliday:     (body)        => request("POST",   "/leaves/holidays", body),
//   updateHoliday:     (id, body)    => request("PUT",    `/leaves/holidays/${id}`, body),
//   deleteHoliday:     (id)          => request("DELETE", `/leaves/holidays/${id}`),
//   getWeeklyHolidays: ()            => request("GET",    "/leaves/weekly-holidays"),
//   updateWeeklyHoliday: (body)      => request("PUT",    "/leaves/weekly-holidays", body),
// };

// // ─── Notices ───────────────────────────────────────────────────────────────
// export const noticeAPI = {
//   getAll:  (params = "") => request("GET",    `/notices${params}`),
//   create:  (body)        => request("POST",   "/notices", body),
//   update:  (id, body)    => request("PUT",    `/notices/${id}`, body),
//   delete:  (id)          => request("DELETE", `/notices/${id}`),
// };

// // ─── Awards ────────────────────────────────────────────────────────────────
// export const awardAPI = {
//   getAll:  ()         => request("GET",    "/awards"),
//   create:  (body)     => request("POST",   "/awards", body),
//   update:  (id, body) => request("PUT",    `/awards/${id}`, body),
//   delete:  (id)       => request("DELETE", `/awards/${id}`),
// };

// // ─── Payroll ───────────────────────────────────────────────────────────────
// export const payrollAPI = {
//   getAll:         (params = "") => request("GET",    `/payroll${params}`),
//   create:         (body)        => request("POST",   "/payroll", body),
//   update:         (id, body)    => request("PUT",    `/payroll/${id}`, body),
//   delete:         (id)          => request("DELETE", `/payroll/${id}`),
//   getAdvances:    ()            => request("GET",    "/payroll/advances"),
//   createAdvance:  (body)        => request("POST",   "/payroll/advances", body),
//   updateAdvance:  (id, body)    => request("PUT",    `/payroll/advances/${id}`, body),
//   deleteAdvance:  (id)          => request("DELETE", `/payroll/advances/${id}`),
// };

// // ─── Loans ────────────────────────────────────────────────────────────────
// export const loanAPI = {
//   getAll:  ()         => request("GET",    "/loans"),
//   create:  (body)     => request("POST",   "/loans", body),
//   update:  (id, body) => request("PUT",    `/loans/${id}`, body),
//   delete:  (id)       => request("DELETE", `/loans/${id}`),
// };

// // ─── Projects ─────────────────────────────────────────────────────────────
// export const projectAPI = {
//   getClients:    ()         => request("GET",    "/projects/clients"),
//   createClient:  (body)     => request("POST",   "/projects/clients", body),
//   updateClient:  (id, body) => request("PUT",    `/projects/clients/${id}`, body),
//   deleteClient:  (id)       => request("DELETE", `/projects/clients/${id}`),
//   getAll:        (params="")=> request("GET",    `/projects${params}`),
//   create:        (body)     => request("POST",   "/projects", body),
//   update:        (id, body) => request("PUT",    `/projects/${id}`, body),
//   delete:        (id)       => request("DELETE", `/projects/${id}`),
//   getTasks:      (params="")=> request("GET",    `/projects/tasks${params}`),
//   createTask:    (body)     => request("POST",   "/projects/tasks", body),
//   updateTask:    (id, body) => request("PUT",    `/projects/tasks/${id}`, body),
//   deleteTask:    (id)       => request("DELETE", `/projects/tasks/${id}`),
// };

// // ─── Recruitment ──────────────────────────────────────────────────────────
// export const recruitmentAPI = {
//   getAll:  (params="")=> request("GET",    `/recruitment${params}`),
//   create:  (body)     => request("POST",   "/recruitment", body),
//   update:  (id, body) => request("PUT",    `/recruitment/${id}`, body),
//   delete:  (id)       => request("DELETE", `/recruitment/${id}`),
// };

// // ─── Procurement ──────────────────────────────────────────────────────────
// export const procurementAPI = {
//   getVendors:         ()         => request("GET",    "/procurement/vendors"),
//   createVendor:       (body)     => request("POST",   "/procurement/vendors", body),
//   updateVendor:       (id, body) => request("PUT",    `/procurement/vendors/${id}`, body),
//   deleteVendor:       (id)       => request("DELETE", `/procurement/vendors/${id}`),
//   getRequests:        ()         => request("GET",    "/procurement/requests"),
//   createRequest:      (body)     => request("POST",   "/procurement/requests", body),
//   updateRequest:      (id, body) => request("PUT",    `/procurement/requests/${id}`, body),
//   deleteRequest:      (id)       => request("DELETE", `/procurement/requests/${id}`),
//   getQuotations:      ()         => request("GET",    "/procurement/quotations"),
//   createQuotation:    (body)     => request("POST",   "/procurement/quotations", body),
//   getPurchaseOrders:  ()         => request("GET",    "/procurement/purchase-orders"),
//   createPurchaseOrder:(body)     => request("POST",   "/procurement/purchase-orders", body),
//   getGoodsReceived:   ()         => request("GET",    "/procurement/goods-received"),
//   createGoodsReceived:(body)     => request("POST",   "/procurement/goods-received", body),
//   getUnits:           ()         => request("GET",    "/procurement/units"),
//   createUnit:         (body)     => request("POST",   "/procurement/units", body),
// };

// // ─── Meetings ─────────────────────────────────────────────────────────────
// export const meetingAPI = {
//   getAll:  ()         => request("GET",    "/meetings"),
//   create:  (body)     => request("POST",   "/meetings", body),
//   update:  (id, body) => request("PUT",    `/meetings/${id}`, body),
//   delete:  (id)       => request("DELETE", `/meetings/${id}`),
// };





// src/services/api.js — Central API utility

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const request = async (method, path, body = null) => {
  const options = { method, headers: headers() };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
};

export const authAPI = {
  login: (body) => request("POST", "/auth/login", body),
  register: (body) => request("POST", "/auth/register", body),
  getMe: () => request("GET", "/auth/me"),
  changePassword: (body) => request("PUT", "/auth/change-password", body),
};

export const employeeAPI = {
  getAll: (params = "") => request("GET", `/employees${params}`),
  getOne: (id) => request("GET", `/employees/${id}`),
  getStats: () => request("GET", "/employees/stats"),
  create: (body) => request("POST", "/employees", body),
  update: (id, body) => request("PUT", `/employees/${id}`, body),
  delete: (id) => request("DELETE", `/employees/${id}`),
};

export const departmentAPI = {
  getAll: () => request("GET", "/departments"),
  create: (body) => request("POST", "/departments", body),
  update: (id, body) => request("PUT", `/departments/${id}`, body),
  delete: (id) => request("DELETE", `/departments/${id}`),
  getAllSubs: () => request("GET", "/departments/sub"),
  createSub: (body) => request("POST", "/departments/sub/create", body),
  updateSub: (id, body) => request("PUT", `/departments/sub/${id}`, body),
  deleteSub: (id) => request("DELETE", `/departments/sub/${id}`),
};

export const attendanceAPI = {
  getAll: (params = "") => request("GET", `/attendance${params}`),
  getToday: () => request("GET", "/attendance/today"),
  getMissing: (date) => request("GET", `/attendance/missing?date=${date}`),
  punchIn: () => request("POST", "/attendance/punch-in"),
  punchOut: () => request("POST", "/attendance/punch-out"),
  create: (body) => request("POST", "/attendance", body),
  update: (id, body) => request("PUT", `/attendance/${id}`, body),
  delete: (id) => request("DELETE", `/attendance/${id}`),
};

export const leaveAPI = {
  getAll: (params = "") => request("GET", `/leaves${params}`),
  create: (body) => request("POST", "/leaves", body),
  update: (id, body) => request("PUT", `/leaves/${id}`, body),
  delete: (id) => request("DELETE", `/leaves/${id}`),
  getHolidays: () => request("GET", "/leaves/holidays"),
  createHoliday: (body) => request("POST", "/leaves/holidays", body),
  updateHoliday: (id, body) => request("PUT", `/leaves/holidays/${id}`, body),
  deleteHoliday: (id) => request("DELETE", `/leaves/holidays/${id}`),
  getWeeklyHolidays: () => request("GET", "/leaves/weekly-holidays"),
  updateWeeklyHoliday: (body) => request("PUT", "/leaves/weekly-holidays", body),
};

export const noticeAPI = {
  getAll: (params = "") => request("GET", `/notices${params}`),
  create: (body) => request("POST", "/notices", body),
  update: (id, body) => request("PUT", `/notices/${id}`, body),
  delete: (id) => request("DELETE", `/notices/${id}`),
};

export const awardAPI = {
  getAll: () => request("GET", "/awards"),
  create: (body) => request("POST", "/awards", body),
  update: (id, body) => request("PUT", `/awards/${id}`, body),
  delete: (id) => request("DELETE", `/awards/${id}`),
};

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

export const loanAPI = {
  getAll: () => request("GET", "/loans"),
  create: (body) => request("POST", "/loans", body),
  update: (id, body) => request("PUT", `/loans/${id}`, body),
  delete: (id) => request("DELETE", `/loans/${id}`),
};

export const projectAPI = {
  getClients: () => request("GET", "/projects/clients"),
  createClient: (body) => request("POST", "/projects/clients", body),
  updateClient: (id, body) => request("PUT", `/projects/clients/${id}`, body),
  deleteClient: (id) => request("DELETE", `/projects/clients/${id}`),
  getAll: (params = "") => request("GET", `/projects${params}`),
  create: (body) => request("POST", "/projects", body),
  update: (id, body) => request("PUT", `/projects/${id}`, body),
  delete: (id) => request("DELETE", `/projects/${id}`),
  getTasks: (params = "") => request("GET", `/projects/tasks${params}`),
  createTask: (body) => request("POST", "/projects/tasks", body),
  updateTask: (id, body) => request("PUT", `/projects/tasks/${id}`, body),
  deleteTask: (id) => request("DELETE", `/projects/tasks/${id}`),
};

export const recruitmentAPI = {
  getAll: (params = "") => request("GET", `/recruitment${params}`),
  create: (body) => request("POST", "/recruitment", body),
  update: (id, body) => request("PUT", `/recruitment/${id}`, body),
  delete: (id) => request("DELETE", `/recruitment/${id}`),
};

export const procurementAPI = {
  getVendors: () => request("GET", "/procurement/vendors"),
  createVendor: (body) => request("POST", "/procurement/vendors", body),
  getRequests: () => request("GET", "/procurement/requests"),
  createRequest: (body) => request("POST", "/procurement/requests", body),
  updateRequest: (id, body) => request("PUT", `/procurement/requests/${id}`, body),
  getQuotations: () => request("GET", "/procurement/quotations"),
  createQuotation: (body) => request("POST", "/procurement/quotations", body),
  getPurchaseOrders: () => request("GET", "/procurement/purchase-orders"),
  createPurchaseOrder: (body) => request("POST", "/procurement/purchase-orders", body),
  getGoodsReceived: () => request("GET", "/procurement/goods-received"),
  createGoodsReceived: (body) => request("POST", "/procurement/goods-received", body),
  getUnits: () => request("GET", "/procurement/units"),
  createUnit: (body) => request("POST", "/procurement/units", body),
};

export const meetingAPI = {
  getAll: () => request("GET", "/meetings"),
  create: (body) => request("POST", "/meetings", body),
  update: (id, body) => request("PUT", `/meetings/${id}`, body),
  delete: (id) => request("DELETE", `/meetings/${id}`),
};
