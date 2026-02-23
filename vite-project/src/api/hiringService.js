import axios from "axios";

// Backend URL (Agar production mein hai toh change karein)
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const hiringService = {

    // 1. CANDIDATE DIRECTORY
    candidateList: () => API.get("/candidates"),
    candidateCreate: (data) => API.post("/candidates", data),
    candidateUpdate: (id, data) => API.put(`/candidates/${id}`, data),
    candidateDelete: (id) => API.delete(`/candidates/${id}`),

    // 2. HIRING BOARD (Selection)
    hiringList: () => API.get("/hiring"),
    hiringCreate: (data) => API.post("/hiring", data),
    hiringUpdate: (id, data) => API.put(`/hiring/${id}`, data),
    hiringDelete: (id) => API.delete(`/hiring/${id}`),

    // 3. SHORTLIST PIPELINE
    getShortlist: () => API.get("/shortlist"),
    addToShortlist: (data) => API.post("/shortlist", data),
    removeFromShortlist: (id) => API.delete(`/shortlist/${id}`),
    updateShortlist: (id, data) => API.put(`/shortlist/${id}`, data),

    // 4. INTERVIEW ASSESSMENT
    saveAssessment: (data) => API.post("/interview", data),
    getAssessments: () => API.get("/interview"),

    // Analytics (Optional: Agar Dashboard banana ho)
    getStats: () => API.get("/analytics/summary")
};

export default hiringService;