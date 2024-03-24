import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
import $api, { API_URL } from "../http";
import {jwtDecode} from "jwt-decode";

class Store {
    user = {};
    isAuth = false;
    isLoading = true;
    categoryId = 0;

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

    setCategory(categoryId) {
        this.categoryId = categoryId
        localStorage.setItem('selectedCategoryId', categoryId);
    }

    getCategory(){
        return localStorage.getItem('selectedCategoryId')
    }

    async login(username, password) {
        try {
            const response = await AuthService.login(username, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);

            const decodedToken = this.parseJwt(response.data.accessToken);

            // console.log(decodedToken);
            this.setUser(decodedToken.user_id);

            console.log(decodedToken.user_id)
            this.setAuth(true);
            console.log("Проверка isAuth")
            console.log(this.isAuth)
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
            console.log(response)
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await $api.get(`${API_URL}/auth/refresh`);
            console.log('Проверка в store');
            console.log(response);
            console.log('Проверка в store');

            localStorage.setItem('token', response.data.accessToken);

            this.setAuth(true);

            const decodedToken = this.parseJwt(response.data.accessToken);
            console.log(decodedToken);
            this.setUser(decodedToken.user_id);
        } catch (e) {
            console.log(e.response?.data?.message);
            this.setAuth(false); // установите isAuth в false при ошибке
        } finally {
            this.setLoading(false);
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}
export default Store;