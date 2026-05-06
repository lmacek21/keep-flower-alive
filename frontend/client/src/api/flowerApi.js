import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
});

export const getFlowers = () => API.get("/flower/list");
export const createFlower = (data) => API.post("/flower/create", data);