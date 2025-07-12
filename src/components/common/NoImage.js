import { FileImageOutlined } from "@ant-design/icons";
import React from "react";

const NoImage = ({ size, color }) => {
    return (
        <FileImageOutlined
            style={{
                fontSize: size ? `${size}px` : "25px",
                color: color ?? "#8c8d8f"
            }}
        />
    );
};

export default NoImage;
