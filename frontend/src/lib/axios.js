import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"http://51.20.251.120:5001/api",
    withCredentials:true,
})


// for development
// http://localhost:5001/api


// for production
//http://51.20.251.120:5001/api