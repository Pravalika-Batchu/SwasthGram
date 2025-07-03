// // src/axiosConfig.js
// import axios from 'axios';

// const instance = axios.create({
//     baseURL: 'http://localhost:8000',
// });

// instance.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('access');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => Promise.reject(error)
// );

// instance.interceptors.response.use(
//     res => res,
//     err => {
//         if (err.response && err.response.status === 401) {
//             localStorage.removeItem('access');
//             window.location.href = '/login';
//         }
//         return Promise.reject(err);
//     }
// );

// export default instance;


import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://swasthgram-backend.onrender.com/api/',
});

instance.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const refresh = localStorage.getItem('refresh');
                const res = await axios.post('https://swasthgram-backend.onrender.com/api/auth/token/refresh/', { refresh });

                const newAccess = res.data.access;
                localStorage.setItem('access', newAccess);
                original.headers['Authorization'] = `Bearer ${newAccess}`;

                return instance(original); // Retry original request
            } catch (refreshErr) {
                console.log("Token refresh failed");
                window.location.href = "/login"; // force login
            }
        }

        return Promise.reject(err);
    }
);

export default instance;
