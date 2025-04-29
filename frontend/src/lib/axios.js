import axios from "axios";

const url = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "http://51.20.251.120:5001/api"

export const axiosInstance = axios.create({
    baseURL:url,
    withCredentials:true,
})


// for development
// http://localhost:5001/api


// for production
//http://51.20.251.120:5001/api