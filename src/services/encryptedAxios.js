// src/network/encryptedAxios.js
import axios from "axios";
import CryptoJS from "crypto-js";

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

// Response interceptor: Decrypt response
encryptedAxios.interceptors.response.use(
    (response) => {
        if (response?.data?.data && response?.data?.iv) {
            response.data = decryptResponse(response.data);
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default encryptedAxios;
