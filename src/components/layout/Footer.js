import React from "react";
import { SITE_NAME } from "../../helpers/Constant";

const CustomFooter = () => {
    const style = {
        textAlign: "center",
        background: "white"
    };
    return <div style={style}>Created by {SITE_NAME}.</div>;
};

export default CustomFooter;
