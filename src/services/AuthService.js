import $api from "../http";
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email, password) {
        return $api.post<AuthResponse>('/login', {email, password})
    }

    static async registration(email, password) {
        return $api.post('/registration', {email, password})
    }

    static async logout() {
        return $api.post('/logout')
    }
}
