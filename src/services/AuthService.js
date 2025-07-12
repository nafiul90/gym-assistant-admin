import axios from "axios";
import {
    ACCESS_TOKEN,
    GET_USER_PROFILE,
    LOGIN_URL,
    REFRESH_TOKEN,
} from "../helpers/Constant";
import encryptedAxios from "./encryptedAxios";

export default class AuthService {
    static login(data) {
        return encryptedAxios.post(LOGIN_URL, data);
    }

    static getUserProfile() {
        return encryptedAxios.get(
            GET_USER_PROFILE,
            AuthService.getAuthHeader()
        );
    }

    static refreshToken() {
        return encryptedAxios.get(REFRESH_TOKEN, AuthService.getAuthHeader());
    }

    static getAuthHeader = () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        return { headers: { "x-auth-token": accessToken } };
    };
}
