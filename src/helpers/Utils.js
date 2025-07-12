import React from "react";
import { Descriptions } from "antd";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { Toast } from "../components/common/Toast";
import { useCheckScreenType } from "../components/common/useCheckScreenType";
import Permission from "./Permission";

export const getErrorMessage = (error) => {
    if (error.response) {
        return error.response.data;
    } else {
        return error.message;
    }
};
export const startDateFormate = "YYYY-MM-DDT00:00:00.000Z";
export const endDateFormate = "YYYY-MM-DDT23:59:59.000Z";

export const getLocalDate = (date, formate = "MMMM Do YYYY, h:mm a") => {
    return moment(date).format(formate);
};

export const getDurationInDays = (date) => {
    return moment(new Date()).diff(moment(date), "days");
};

export const getParcelAge = (parcel) => {
    let color = "white";
    const age = getDurationInDays(parcel.createdAt);
    if (
        age > 3 &&
        !parcel.status.includes("Deliver") &&
        !parcel.status.includes("Return")
    ) {
        color = "red";
    }

    return <span style={{ color }}>{moment(parcel.createdAt).fromNow()}</span>;
};

export const getParcelText = (parcel) => {
    return getDurationInDays(parcel.createdAt);
};

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const getAllQueryParams = (query) => {
    const data = {};
    for (const [key, value] of query) {
        data[key] = value;
    }
    return data;
};

export const getParams = (query, data) => {
    for (const key of Object.keys(data)) {
        let value = query.get(key);
        if (value?.includes(",")) {
            value = value.split(",");
        } else if (key === "multipleStatus") {
            value = [];
        }

        if (
            key === "dateFrom" ||
            key === "dateTo" ||
            key === "receiveDateFrom" ||
            key === "receiveDateTo"
        ) {
            value = value?.replace(" ", "+");
        }

        data = { ...data, [key]: value || null };
    }
    return data;
};

export const isValueExistInSearch = (data) => {
    for (const key of Object.keys(data)) {
        if (data[key]) {
            return ["1"];
        }
    }
    return ["0"];
};

export const getBase64Image = (data) => {
    const base64 = btoa(
        new Uint8Array(data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
        )
    );

    return "data:;base64," + base64;
};

export const bindUrlWithParams = (url, params) => {
    let result = url;

    Object.keys(params).forEach((key) => {
        if (!params[key]) {
            delete params[key];
        }
    });

    Object.keys(params).forEach((key, index) => {
        if (index === 0) {
            result += `?${key}=${params[key]}`;
        } else {
            result += `&${key}=${params[key]}`;
        }
    });

    return result;
};

export const getFullPreviousRoute = (history) => {
    return `${history.location.pathname}${history.location.search}`;
};

export const resetState = (data) => {
    for (const key of Object.keys(data)) {
        data = { ...data, [key]: "" };
    }
    return data;
};

export const getAllNonObjectValues = (data) => {
    const singleValue = {};

    for (const [key, value] of Object.entries(data)) {
        if (typeof value !== "object") {
            singleValue[key] = value;
        }
    }
    return singleValue;
};

// export const getAllNestedObjectValues = (data) => {
//     let singleValue = [];
//
//     for (const [key, value] of Object.entries(data)) {
//         if (value && typeof value === "object") {
//             singleValue.push(value);
//         }
//     }
//     return singleValue
// }

export const booleanTagColor = (isTrue) => {
    return isTrue ? "blue" : "red";
};

export const getPercentageValue = (value, percent) => {
    return (value * percent) / 100;
};

export const getDiscountAmount = (type, subTotal, discount) => {
    if (type === "Flat") {
        return discount;
    } else {
        return getPercentageValue(subTotal, discount);
    }
};

export const getProductDiscount = (product) => {
    if (product.discountType === "FLAT") {
        return product.discountAmount;
    } else {
        return getPercentageValue(
            product.salePrice,
            product.discountPercentage
        );
    }
};

export const getProductPrice = (product) => {
    return (
        product.salePrice -
        getProductDiscount(product) +
        getPercentageValue(product.salePrice, product.vat)
    );
};

export const hasPermission = (loggedInUserPermissions, permissions) => {
    if (!permissions) {
        return false;
    }

    if (permissions.includes(Permission.ALL)) {
        return true;
    }

    if (!loggedInUserPermissions) {
        return false;
    }

    for (const permission of permissions) {
        if (loggedInUserPermissions.includes(permission)) {
            return true;
        }
    }

    return false;
};

export const copyParcelInfo = (parcel, navigator) => {
    const info = `ZF Id: ${parcel.invoice}
Order Id: ${parcel.merchantOrderId}
Customer name: ${parcel.recipientName}
Customer phone: ${parcel.recipientPhone}
Customer address: ${parcel.recipientAddress}
Location: ${parcel.recipientCity}, ${parcel.recipientArea}
Area: ${parcel.recipientArea}
note: ${parcel.specialInstruction ?? ""}`;

    navigator.clipboard.writeText(info);
    Toast("success", "Copied", "Parcel information has been copied.");
};

export const getDetailItems = (
    object,
    column = 3,
    title = "Summary",
    layout = "vertical"
) => {
    if (!object) {
        return "";
    }

    const summaryList = [];

    for (const i in object) {
        if (typeof object[i] !== "object") {
            summaryList.push(
                <Descriptions.Item className="bg-white" label={i} key={i}>
                    {isNaN(object[i])
                        ? object[i]
                        : parseFloat(object[i]).toFixed(2)}
                </Descriptions.Item>
            );
        }
    }

    return (
        <Descriptions column={column} bordered title={title} layout={layout}>
            {summaryList}
        </Descriptions>
    );
};
export const isPastDate = (inputDateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // strip time

    const inputDate = new Date(inputDateString);
    inputDate.setHours(0, 0, 0, 0); // strip time

    return inputDate < today;
};

export const ScrollConfig = (config) => {
    const screenType = useCheckScreenType();
    let _scrollConfig = {
        x: 0,
        y: 0,
    };
    if (config) {
        return config;
    }
    if (screenType.isMobile) {
        _scrollConfig.x = 600;
        _scrollConfig.y = 1200;
    } else if (screenType.isTab) {
        _scrollConfig.x = 500;
        _scrollConfig.y = 600;
    } else if (screenType.isDesktop) {
        // Assuming it's desktop
        _scrollConfig.x = 1000;
        _scrollConfig.y = 400;
    } else {
        _scrollConfig.x = 100;
        _scrollConfig.y = 400;
    }
    console.log("Config -> ", _scrollConfig);
    return _scrollConfig;
};

export const getDecodedMessage = (message) => {
    try {
        return decodeURIComponent(message);
    } catch (err) {
        return message;
    }
};
