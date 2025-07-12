import { Spin } from "antd";
import React from "react";

const LoadingSuspense = ({ height, width, size = "large" }) => {
    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height,
        width,
    };

    return (
        <div style={style}>
            <Spin size={size} />
        </div>
    );
};

LoadingSuspense.defaultProps = {
    width: "100%",
    height: "100%",
};

export default LoadingSuspense;
