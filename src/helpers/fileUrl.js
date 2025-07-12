import { ROOT_URL } from "./Constant";
export const getFullFilePath = (path = "") => {
    if (!path) {
        return "";
    }
    if (path.includes("s3-files")) {
        return `${ROOT_URL}/${path}`;
    }
    return `${ROOT_URL}/files/${path}`;
};
