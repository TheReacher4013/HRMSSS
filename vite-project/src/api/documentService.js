import api from './apiClient';

export const uploadDocument = (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getDocuments = () => api.get('/documents');
export const getDocByEmp = (empid) => api.get(`/documents/employee/${empid}`);