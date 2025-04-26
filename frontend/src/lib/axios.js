import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"http://51.20.251.120:5001/api",
    withCredentials:true,
})

