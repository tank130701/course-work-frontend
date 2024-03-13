import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
// import axios from 'axios';
import $api, { API_URL } from "../http";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    async login(username, password) {
        try {
            const response = await AuthService.login(username, password);
            console.log(response)
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            const decodedToken = this.parseJwt(response.data.accessToken);

            // console.log(decodedToken);
            this.setUser(decodedToken.user_id);

            
            console.log(decodedToken.user_id)

        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('accessToken');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await $api.get(`${API_URL}/auth/refresh`, {
                refreshToken: localStorage.getItem('refreshToken')
            }, {
                withCredentials: false
            })
            console.log('refresh');
            console.log(response.data.accessToken);
            console.log('refresh');
            localStorage.setItem('accessToken', response.data.accessToken);
            this.setAuth(true);
            
            const decodedToken = this.parseJwt(response.data.accessToken);
            console.log(decodedToken);
            this.setUser(decodedToken.user_id);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };
}