<<<<<<< Updated upstream
import { API } from "@/Request";

API.interceptors.request.use(
    async(config) => {
        const accessToken = localStorage.getItem("token");
        console.log("@#@#@ RQST INRCPTR: ", accessToken);
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

=======
>>>>>>> Stashed changes
