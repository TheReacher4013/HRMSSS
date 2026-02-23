import api from "./apiClient";


// --- 2. SALARY SERVICE ---
export const salaryService = {
    list: () => api.get("/salary/list"),
    // Future mein generate ka logic yahan aayega
};

// --- 3. ADVANCE SERVICE ---
export const advanceService = {
    list: () => api.get("/advance/list"),
    create: (data) => api.post("/advance/create", data),
    update: (id, data) => api.put(`/advance/update/${id}`, data),
    delete: (id) => api.delete(`/advance/delete/${id}`),
};