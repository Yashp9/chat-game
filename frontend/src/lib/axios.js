import axios from "axios";

// const url = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "http://13.60.73.152:5001/api" i have to remove it before final showcase.

const url = "/api";

export const axiosInstance = axios.create({
    baseURL:url,
    withCredentials:true,
})


// for development
// http://localhost:5001/api


// for production
//http://13.60.73.152:5001/api