import axios from "axios";

const API = axios.create({
    baseURL: "https://readhive-backend.onrender.com",
});


export default API;
