import api from './apiClient';

export const awardActions = {
    create: (data) => api.post('/award/create', data),
    list: () => api.get('/award/list')
};

export const noticeActions = {
    create: (data) => api.post('/notice/create', data),
    list: () => api.get('/notice/listNotice')
};

export const departmentActions = {
    create: (data) => api.post('/department/CreateDep', data),
    list: () => api.get('/department/listDep')
};

//(Awards, Notices, Dept)