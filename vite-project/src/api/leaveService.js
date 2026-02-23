import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// --- 1. LEAVE APPLICATIONS (Employee Requests) ---
export const getLeaves = () => axios.get(`${API_BASE_URL}/leaves`);
export const applyLeave = (data) => axios.post(`${API_BASE_URL}/leaves`, data);
export const updateLeaveStatus = (id, status) => axios.put(`${API_BASE_URL}/leaves/${id}`, { status });
export const deleteLeave = (id) => axios.delete(`${API_BASE_URL}/leaves/${id}`);

// --- 2. HOLIDAYS (Weekly Off Settings) ---
export const getHolidays = () => axios.get(`${API_BASE_URL}/holidays`);
export const updateHolidays = (days) => axios.put(`${API_BASE_URL}/holidays`, { days });

// --- 3. LEAVE TYPES (Policies) ---
export const getLeaveTypes = () => axios.get(`${API_BASE_URL}/leave-types`);
export const createLeaveType = (data) => axios.post(`${API_BASE_URL}/leave-types`, data);
export const updateLeaveType = (id, data) => axios.put(`${API_BASE_URL}/leave-types/${id}`, data);
export const deleteLeaveType = (id) => axios.delete(`${API_BASE_URL}/leave-types/${id}`);