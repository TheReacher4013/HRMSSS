import api from './apiClient';

export const createPayroll = (data) => api.post('/payroll', data);
export const getAllPayroll = () => api.get('/payroll');
export const getEmpPayroll = (empid) => api.get(`/payroll/employee/${empid}`);

// PDF Download Trigger
export const downloadPayslip = async (id) => {
    const response = await api.get(`/payroll/download/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payslip.pdf');
    link.click();
};