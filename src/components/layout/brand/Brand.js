import PropTypes from "prop-types";
import React, { useContext } from "react";

/* SCSS */
import { ThemeContext } from "../../../contexts/ThemeContextProvider";
import "./brand.scss";

const Brand = ({ icon, brandText, className }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div
            className={className}
            style={{ background: theme === "dark" ? "black" : "white" }}
        >
            <span className="icon">{icon}</span>
            <span className="text">{brandText}</span>
        </div>
    );
};

Brand.defaultProps = {
    className: "brand",
    brandText: "Brand"
};

Brand.propTypes = {
    icon: PropTypes.element.isRequired
};

export default Brand;
