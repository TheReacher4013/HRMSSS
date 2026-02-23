import axios from "axios";

// Aapka backend URL (check kar lein 5000 hai ya koi aur port)
const API = axios.create({ baseURL: "http://localhost:5000/api/bids" });

export const bidService = {
    // Sabhi bids fetch karne ke liye
    list: () => API.get("/list"),

    // Nayi bid create karne ke liye
    create: (data) => API.post("/create", data),

    // Bid delete karne ke liye
    delete: (id) => API.delete(`/delete/${id}`),

    // Bid update karne ke liye
    update: (id, data) => API.put(`/update/${id}`, data)
};