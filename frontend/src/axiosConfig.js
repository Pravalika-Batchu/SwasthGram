// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

instance.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('access');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default instance;


