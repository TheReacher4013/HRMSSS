import api from './apiClient';

export const applyLeave = (data) => api.post('/leaves', data);
export const getLeaves = () => api.get('/leaves');

export const createLoan = (data) => api.post('/loan/create', data);
export const getLoans = () => api.get('/loan/listLoan');


//loan and leave