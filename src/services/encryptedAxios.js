// src/network/encryptedAxios.js
import axios from "axios";
import CryptoJS from "crypto-js";
import { ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_TOKEN_KEY } from "../helpers/Constant";

// Must be 32 characters (256 bits) key
const ENCRYPTION_KEY = "urelaa-gym-2025-13579@#-urelaa-g"; // MUST match backend & Flutter
const IV_LENGTH = 16;

// Encrypt function
function encryptRequest(data) {
    const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return {
        data: encrypted.toString(),
        iv: CryptoJS.enc.Base64.stringify(iv),
    };
}

// Decrypt function
function decryptResponse(responseData) {
    if (!responseData?.data || !responseData?.iv) return responseData;
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Base64.parse(responseData.iv);
    const decrypted = CryptoJS.AES.decrypt(responseData.data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
}

// Refresh token state — prevents concurrent refresh races
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve(token);
    });
    failedQueue = [];
};

// Create axios instance
const encryptedAxios = axios.create({
    baseURL: "", // Change this
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: Encrypt body
encryptedAxios.interceptors.request.use((config) => {
    if (config.method === "post" || config.method === "put") {
        config.data = encryptRequest(config.data);
    }
    return config;
});

// Response interceptor: Decrypt response + handle 401 with token refresh
encryptedAxios.interceptors.response.use(
    (response) => {
        if (response?.data?.data && response?.data?.iv) {
            response.data = decryptResponse(response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers["x-auth-token"] = token;
                    return encryptedAxios(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
                if (!refreshToken) throw new Error("No refresh token");

                // Use raw axios to avoid triggering this interceptor again
                const encryptedBody = encryptRequest({ refreshToken });
                const res = await axios.post(REFRESH_TOKEN, encryptedBody, {
                    headers: { "Content-Type": "application/json" },
                });

                const data = decryptResponse(res.data);
                localStorage.setItem(ACCESS_TOKEN, data.token);
                localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

                processQueue(null, data.token);
                originalRequest.headers["x-auth-token"] = data.token;
                return encryptedAxios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Store a flag so the Login page can show an explanation
                sessionStorage.setItem("session_ended", "1");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default encryptedAxios;
