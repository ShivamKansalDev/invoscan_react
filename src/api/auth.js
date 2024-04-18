import { API } from "@/Request";

export const login = (data) => API.request({
    url: 'auth/login',
    method: "POST",
    data
});

export const usersList = (data) => {
    const token = localStorage.getItem('token');
    return API.request({
        url: 'user/all',
        method: "GET",
        data,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
};

export const CompaniesList = (id) => {
    const token = localStorage.getItem('token');
    return API.request({
        url: `company/user/${id}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
};
export const CompaniesDelete = (id) => {
    const token = localStorage.getItem('token');
    return API.request({
        url: `company/${id}`,
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
};

