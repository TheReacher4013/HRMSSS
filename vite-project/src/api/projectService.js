import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const projectService = {
    // Clients
    clientList: () => API.get("/clients"),
    clientCreate: (data) => API.post("/clients", data),
    clientDelete: (id) => API.delete(`/clients/${id}`),

    // Projects
    projectList: () => API.get("/projects"),
    projectCreate: (data) => API.post("/projects", data),

    // Tasks
    taskList: () => API.get("/tasks"),
    taskCreate: (data) => API.post("/tasks", data),

    // Employees (Team Members)
    employeeList: () => API.get("/employees"),
    employeeCreate: (data) => API.post("/employees", data),

    // Reports
    reportList: () => API.get("/reports"),
    reportCreate: (data) => API.post("/reports", data),
};