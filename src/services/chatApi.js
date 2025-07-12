import axios from "axios";
import { ACCESS_TOKEN, ROOT_URL } from "../helpers/Constant";

const getAuthHeader = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return { Authorization: `Bearer ${accessToken}` };
};
export const getConversationMessages = async (conversationId, before = "") => {
    const hitURL = `${ROOT_URL}/chat/message/${conversationId}?limit=10&before=${before}`;
    try {
        const res = await axios.get(hitURL, {
            headers: {
                ...getAuthHeader()
            }
        });
        return res.data;
    } catch (err) {
        return err;
    }
};
export const fetchChatConversationsOnClient = async () => {
    const hitURL = `${ROOT_URL}/chat/conversation?adminChat=yes`;
    try {
        const res = await axios.get(hitURL, {
            headers: {
                ...getAuthHeader()
            }
        });
        return res.data;
    } catch (err) {
        return err;
    }
};
export const sendMessage = async (conversationId, body) => {
    const hitURL = `${ROOT_URL}/chat/send-message/${conversationId}`;
    try {
        const res = await axios.post(hitURL, body, {
            headers: {
                ...getAuthHeader()
            }
        });
        return res.data;
    } catch (err) {
        return err;
    }
};

export const getFullFilePath = (path = "") => {
    if (!path) {
        return "";
    }
    if (path.includes("s3-files")) {
        return `${ROOT_URL}/${path}`;
    }
    return `${ROOT_URL}/files/${path}`;
};
