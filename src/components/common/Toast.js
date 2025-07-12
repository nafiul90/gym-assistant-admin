import { notification } from "antd";

export const Toast = (type, title, desc) => {
    let data = desc.response ? desc?.response?.data : desc;
    if (data?.message) {
        data = data?.message;
    }

    notification[type]({
        message: title,
        description: data,
        placement: "bottomRight"
    });
};
