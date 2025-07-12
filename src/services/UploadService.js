import axios from "axios";
import { ACCESS_TOKEN } from "../helpers/Constant";
import encryptedAxios from "./encryptedAxios";

export default class UploadService {
    static upload(path, data) {
        return encryptedAxios.post(path, data, UploadService.getAuthHeader());
    }

    static getAuthHeader() {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        return {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    // responseType: 'arraybuffer'

    // static changeProductStatus(email, status) {
    //     return axios.post(`${URL.UPDATE_PRODUCT_STATUS}/${email}?status=${status}`)
    // }
}
