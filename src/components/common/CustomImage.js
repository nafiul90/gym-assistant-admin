import React from "react";
import { IMAGE_URL } from "../../helpers/Constant";

import { FileImageOutlined, UserOutlined } from "@ant-design/icons";

const CustomImage = ({ height, width, borderRadius, src, avatar, size }) => {
    return src ? (
        <img
            src={`${IMAGE_URL}/${src}`}
            style={{
                height: `${height}px`,
                width: `${width}px`,
                borderRadius: `${borderRadius}px`
            }}
            alt="empty"
        />
    ) : avatar ? (
        <UserOutlined
            style={{ fontSize: `${size ?? height - 20}px`, color: "#8c8d8f" }}
        />
    ) : (
        <FileImageOutlined style={{ fontSize: "25px", color: "#8c8d8f" }} />
    );
};

export default CustomImage;
