import axios from 'axios';
import { toast } from 'react-toastify';
export const baseUrl = 'http://18.130.0.242:4000/api/';

export const API = axios.create({
    baseURL: baseUrl
})

export const siteURL = baseUrl;
export const fileURL = baseUrl + 'uploads/';

API.interceptors.request.use(
    async(config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            console.log("@@@@@ INRCPTR: ", accessToken);
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
class Request {
    show() {
        document.getElementById("ajax-loader").style.display = "block";
    }
    hide() {
        document.getElementById("ajax-loader").style.display = "none";
    }
    getHeader() {
        const token = localStorage.getItem('token');
        if (token != undefined && token && token != null) {
            return {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            }
        }
        return {
            headers: {
            }
        }
    }
    error = err => {
        try {
            if(err.response.status === 451) {
                toast.warning(err.response.data.message);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href="/"                
            } else if (err.response.status === 401) {
                toast.error(err.response.data.message);
            } else {
                toast.warning(err.response.data.message);
            }
        } catch (e) {
        }
    }
    errorMessage = message => {
        try {
            toast.warning(message);
        } catch (e) {
        }
    }
    success = message => {
        try {
            toast.success(message);
        } catch (e) {
        }
    }
    get(url) {
        return new Promise((next, error) => {
            this.show()
            API.get(url, this.getHeader())
                .then(d => {
                    this.hide()
                    if (d.data.message !== undefined) {
                        if (d.data.statusCode) {
                            // this.success(d.data.message)
                        } else {
                            this.errorMessage(d.data.message)
                        }
                    }
                    if (d.data.statusCode) {
                        next(d.data)
                    }
                })
                .catch(err => {
                    this.hide()
                    this.error(err)
                })
        })
    }
    post(url, data) {
        return new Promise((next, error) => {
            this.show()
            API.post(url, data, this.getHeader())
                .then(d => {
                    this.hide()
                    if (d.data.message !== undefined) {
                        if (d.data.statusCode) {
                            this.success(d.data.message)
                        } else {
                            this.errorMessage(d.data.message)
                        }
                    }
                    if (d.data.statusCode) {
                        next(d.data)
                    }
                })
                .catch(err => {
                    this.hide()
                    this.error(err)
                })
        })
    }
    postUpload(url, data) {
        return new Promise((next, error) => {
            this.show()
            API.post(url, data, this.getHeader())
                .then(d => {
                    this.hide()
                    if (d.data.message !== undefined) {
                        if (d.data.statusCode) {
                            this.success(d.data.message)
                        } else {
                            this.errorMessage(d.data.message)
                        }
                    }
                    if (d.data.error !== undefined) {
                        this.errorMessage(d.data.error)
                    }
                    if (d.data) {
                        next(d.data)
                    }
                })
                .catch(err => {
                    this.hide()
                    this.error(err)
                })
        })
    }
    put(url, data) {
        return new Promise((next, error) => {
            this.show()
            API.put(url, data, this.getHeader())
                .then(d => {
                    this.hide()
                    if (d.data.message !== undefined) {
                        if (d.data.statusCode) {
                            this.success(d.data.message)
                        } else {
                            this.errorMessage(d.data.message)
                        }
                    }
                    if (d.data.statusCode) {
                        next(d.data)
                    }
                })
                .catch(err => {
                    this.hide()
                    this.error(err)
                })
        })
    }
    patch(url, data) {
        return new Promise((next, error) => {
            this.show()
            API.patch(url, data, this.getHeader())
                .then(d => {
                    this.hide()
                    if (d.data.message !== undefined) {
                        if (d.data.statusCode) {
                            this.success(d.data.message)
                        } else {
                            this.errorMessage(d.data.message)
                        }
                    }
                    if (d.data.statusCode) {
                        next(d.data)
                    }
                })
                .catch(err => {
                    this.hide()
                    this.error(err)
                })
        })
    }
    delete(url) {
        return new Promise((next, error) => {
            this.show()
            API.delete(url, this.getHeader())
                .then(d => {
                    this.hide()
                    if (d.data.message !== undefined) {
                        if (d.data.statusCode) {
                            this.success(d.data.message)
                        } else {
                            this.errorMessage(d.data.message)
                        }
                    }
                    if (d.data.statusCode) {
                        next(d.data)
                    }
                })
                .catch(err => {
                    this.hide()
                    this.error(err)
                })
        })
    }
}
export default new Request();