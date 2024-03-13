import axios from 'axios';
// import {AuthResponse} from "../models/response/AuthResponse";

export const API_URL = `http://localhost:5000`

const $api = axios.create({
    withCredentials: false,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config;
})

// $api.interceptors.response.use((config) => {
//     return config;
// },async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && error.config && !error.config._isRetry) {
//         originalRequest._isRetry = false;
//         try {
//             const response = await $api.get(`${API_URL}/auth/refresh`, {
//                 refreshToken: localStorage.getItem('refreshToken')
//             }, {
//                 withCredentials: false
//             })

//             localStorage.setItem('accessToken', response.data.accessToken);
//             return $api.request(originalRequest);
//         } catch (e) {
//             console.log('НЕ АВТОРИЗОВАН')
//         }
//     }
//     throw error;
// })

export default $api;
