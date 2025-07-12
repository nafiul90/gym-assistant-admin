import { PieChartOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextProvider";
import * as PATH from "../routes/Slugs";
import Permission from "./Permission";
const SidebarMenus = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    return [
        {
            key: "profile",
            label: "Profile",
            onClick: () => navigate(PATH.PROFILE_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "user-list",
            label: "User List",
            onClick: () => navigate(PATH.USER_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "gym",
            label: "gym",
            onClick: () => navigate(PATH.GYM_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "invoice",
            label: "invoice",
            onClick: () => navigate(PATH.INVOICE_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "Payments",
            label: "Payment History",
            onClick: () => navigate(PATH.GYMPAYMENT_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        
    {
            key: "smsRecords",
            label: "smsRecords",
            onClick: () => navigate(PATH.SMSRECORDS_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL]
        }, // NAVS_EXPORTS_AREA
        {
            key: "logout",
            label: "Logout",
            onClick: () => authContext.logout(),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
    ];
};
export default SidebarMenus;
