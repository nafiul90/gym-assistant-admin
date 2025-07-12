import { Button } from "antd";
import React from "react";

const CustomButton = (props) => {
    return (
        <Button
            type={props.type ?? "primary"}
            className={props.className ?? "bg-red-500 hover:bg-red-300"}
            {...props}
        >
            {props.children}
        </Button>
    );
};

export default CustomButton;
