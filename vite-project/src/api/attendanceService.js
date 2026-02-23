import api from './apiClient';

export const checkIn = (data) => api.post('/attendance/checkin', data);
export const checkOut = (id, data) => api.put(`/attendance/checkout/${id}`, data);
export const getAttendance = () => api.get('/attendance');
export const getByEmployee = (empid) => api.get(`/attendance/employee/${empid}`);