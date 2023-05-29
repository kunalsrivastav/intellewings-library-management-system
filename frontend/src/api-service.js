import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (config?.url?.includes('books') && token) {
        config.headers['Authorization'] = token;
    }
    return config;
})

export const getRequest = (endpoint, params) => {
    return axiosInstance.get(endpoint, params);
}

export const postRequest = (endpoint, body) => {
    return axiosInstance.post(endpoint, body);
}

export const deleteRequest = (endpoint, body) => {
    return axiosInstance.delete(endpoint, { data: body });
}