import React from "react";

const DiscountTypeSwitch = ({ value, setValue }) => {
    return (
        <div className="flex text-sm font-light">
            <DiscountType
                value="Flat"
                isActive={value === "Flat"}
                handleClick={setValue}
            />
            <DiscountType
                value="Percentage"
                isActive={value === "Percentage"}
                handleClick={setValue}
            />
        </div>
    );
};

const DiscountType = ({ value, isActive, handleClick }) => {
    return (
        <div
            className={`p-2 cursor-pointer bg-${
                isActive ? "blue-500" : "white"
            } border border-blue-200`}
            onClick={() => handleClick(value)}
        >
            <p className={`${isActive ? "text-white" : ""} font-semibold`}>
                {value}
            </p>
        </div>
    );
};

export default DiscountTypeSwitch;
