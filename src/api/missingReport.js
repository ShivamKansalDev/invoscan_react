import { API } from "@/Request";

export const getMissingReport = () => {
    const token = localStorage.getItem('token');
    return API.request({
        url: 'missing',
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
};


export const deleteMissingReport = (id) => {
    const token = localStorage.getItem('token');
    return API.request({
        url: `missing/${id}`,
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
};

export const resolveMissingReport = (id) => {
    const token = localStorage.getItem('token');
    return API.request({
        url: `missing/${id}?isResolved=true`,
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
};
