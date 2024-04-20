import { API } from "@/Request";

export const getAllInvoices = () => {
    return API.request({
        url: 'stock/all',
        method: "GET"
    })
};

export const deleteInvoice = (invoiceId) => {
    return API.request({
        url: `stock/${invoiceId}`,
        method: "DELETE"
    })
};

export const markCompleteInvoice = (invoiceId, data) => {
    return API.request({
        url: `/stock/update-stock${invoiceId}`,
        method: "PATCH",
        data: data
    })
};