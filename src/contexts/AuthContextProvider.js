import React, { createContext, useContext, useState } from "react";
import { ACCESS_TOKEN, DEVICE_ID_KEY, PROFILE, REFRESH_TOKEN_KEY, RESEND_LOGIN_OTP_URL, SWITCH_GYM, VERIFY_LOGIN_OTP_URL } from "../helpers/Constant";
import api from "../services/Api";
import encryptedAxios from "../services/encryptedAxios";

export const AuthContext = createContext("AuthContext");

const auth = localStorage.getItem(ACCESS_TOKEN);

// Generate or retrieve a stable UUID for this browser
function getOrCreateDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
        id = Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
}

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(!!auth);
    const [profile, setProfile] = useState(null);
    const [role, setRole] = useState();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    // OTP state — set when server returns 206 (new device)
    const [otpState, setOtpState] = useState(null); // { phone, maskedPhone, deviceId }
    const [otpLoading, setOtpLoading] = useState(false);

    const _finalizeLogin = (data) => {
        localStorage.setItem(ACCESS_TOKEN, data.token);
        if (data.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        localStorage.setItem(PROFILE, JSON.stringify(data.user));
        setRole(data.user?.role?.alias);
        setIsLogin(true);
        setOtpState(null);
    };

    const login = async (body) => {
        const deviceId = getOrCreateDeviceId();
        api.auth.login(
            {
                setLoading,
                body: {
                    ...body,
                    deviceId,
                    deviceName: "Web Browser",
                    deviceType: "web",
                },
            },
            (response) => {
                if (response.status === 206) {
                    // New device — OTP verification required
                    setOtpState({
                        phone: response.data.phone,
                        maskedPhone: response.data.maskedPhone,
                        deviceId: response.data.deviceId ?? deviceId,
                    });
                } else {
                    _finalizeLogin(response.data);
                }
            }
        );
    };

    const verifyOtp = async (otp) => {
        if (!otpState) return;
        setOtpLoading(true);
        try {
            const response = await encryptedAxios.post(VERIFY_LOGIN_OTP_URL, {
                phone: otpState.phone,
                deviceId: otpState.deviceId,
                otp,
            });
            _finalizeLogin(response.data);
        } catch (err) {
            // error toast is handled by encryptedAxios or caller
        } finally {
            setOtpLoading(false);
        }
    };

    const resendOtp = async () => {
        if (!otpState) return;
        await encryptedAxios.post(RESEND_LOGIN_OTP_URL, {
            phone: otpState.phone,
            deviceId: otpState.deviceId,
        });
    };

    const cancelOtp = () => setOtpState(null);

    const getUserProfile = async () => {
        api.auth.getProfile(setProfileLoading, (response) => {
            localStorage.setItem(PROFILE, JSON.stringify(response.data));
            setProfile(response.data);
            setIsLogin(true);
            setRole(response.data.role?.alias);
        });
    };

    const switchGym = async () => {
        api.getSingleData({ url: `${SWITCH_GYM}/null`, setLoading }, (res) => {
            localStorage.setItem(ACCESS_TOKEN, res.data?.token);
            getUserProfile();
        });
    };

    const logout = () => {
        setIsLogin(false);
        setProfile(null);
        setOtpState(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider
            value={{
                isLogin,
                profile,
                loading,
                profileLoading,
                role,
                permissions: profile ? profile.permissions : [],
                otpState,
                otpLoading,
                login,
                verifyOtp,
                resendOtp,
                cancelOtp,
                logout,
                getUserProfile,
                switchGym,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
