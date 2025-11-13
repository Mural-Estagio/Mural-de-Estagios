import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081',
    validateStatus: (status) => {
        return status >= 200 && status < 300;
      },
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);


export { api }