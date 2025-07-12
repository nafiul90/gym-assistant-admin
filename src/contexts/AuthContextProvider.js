import React, { createContext, useContext, useState } from "react";
import { ACCESS_TOKEN, PROFILE, SWITCH_GYM } from "../helpers/Constant";
import api from "../services/Api";

export const AuthContext = createContext("AuthContext");

const auth = localStorage.getItem(ACCESS_TOKEN);

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(!!auth);
    const [profile, setProfile] = useState(null);
    const [role, setRole] = useState();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const login = async (body) => {
        api.auth.login({ setLoading, body }, (response) => {
            localStorage.setItem(ACCESS_TOKEN, response.data.token);
            localStorage.setItem(PROFILE, JSON.stringify(response.data.user));
            setRole(response.data.user.role?.alias);
            setIsLogin(true);
        });
    };

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
                login,
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
