import api from './apiClient';

// Projects
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);