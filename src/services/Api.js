import axios from "axios";
import { Toast } from "../components/common/Toast";
import { ACCESS_TOKEN, GET_USER_PROFILE, LOGIN_URL } from "../helpers/Constant";
import encryptedAxios from "./encryptedAxios";

const api = {
    getAllData: ({ url, setLoading, params }, next) =>
        apiCall({ url, setLoading, params, method: "get" }, next),
    getSingleData: ({ url, setLoading }, next) =>
        apiCall({ url, setLoading, method: "get" }, next),
    createData: ({ url, setLoading, body }, next, onError) =>
        apiCall({ url, setLoading, body, method: "post" }, next, onError),
    updateData: ({ url, setLoading, body }, next, onError) =>
        apiCall({ url, setLoading, body, method: "put" }, next, onError),
    deleteData: ({ url, setLoading }, next) =>
        apiCall({ url, setLoading, method: "delete" }, next),
    auth: {
        login: ({ body, setLoading }, next) =>
            apiCall({ url: LOGIN_URL, setLoading, body, method: "post" }, next),

        getProfile: (setLoading, next) =>
            apiCall({ url: GET_USER_PROFILE, setLoading, method: "get" }, next),
    },
    nexAction: (response, callback) => {
        if (response) {
            callback();
        }
    },
};

const apiCall = async (
    { setLoading, url, body, params, method },
    next,
    onError
) => {
    const getAuthHeader = () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        return { headers: { "x-auth-token": `${accessToken}` } };
    };

    const axiosCall = () => {
        if (["post", "put"].includes(method)) {
            return axios[method](url, body, {
                ...getAuthHeader(),
                params,
            });
        } else {
            return encryptedAxios[method](url, { ...getAuthHeader(), params });
        }
    };

    try {
        setLoading(true);
        const response = await axiosCall();
        next(response);
        setLoading(false);
        return response;
    } catch (error) {
        Toast("error", "Error", error);
        setLoading(false);
        if (onError) {
            onError(error);
        }
    }
};

export default api;
