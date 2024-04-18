import { API } from "@/Request";

export const login = (data) => API.request({
    url: 'auth/login',
    method: "POST",
    data
});
