import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const masterService = {
    // Requests
    requestList: () => API.get("/requests/list"),
    requestCreate: (data) => API.post("/requests/create", data),

    // Units
    unitList: () => API.get("/units/list"),
    unitCreate: (data) => API.post("/units/create", data),

    // Vendors
    vendorList: () => API.get("/vendors/list"),
    vendorCreate: (data) => API.post("/vendors/create", data),
};