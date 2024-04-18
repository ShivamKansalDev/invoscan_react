import axios from "axios";
import { API_URL } from "../Config/config.js";
import { API } from "@/Request.js";

API.interceptors.request.use(
    async(config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        return response;
    },
    async(error) => {
        const config = error?.response?.config;
        const status = error?.response?.status;
        if((status === 401) || (status === 451)){
            if(config?.url !== 'auth/login'){
                alert("Session expired");
            }
        }
    },
    (error) => {
        return Promise.reject(error);
    }
)

