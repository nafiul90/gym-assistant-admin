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
            key: "dashboard",
            label: "Dashboard",
            onClick: () => navigate(PATH.DASHBOARD_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
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
            permissions: [Permission.ALL],
        },
        {
            key: "payments",
            label: "payments",
            onClick: () => navigate(PATH.PAYMENTS_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "partner",
            label: "Partner",
            onClick: () => navigate(PATH.PARTNER_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "config",
            label: "Config",
            onClick: () => navigate(PATH.SITE_CONFIG_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "businessExpense",
            label: "businessExpense",
            onClick: () => navigate(PATH.BUSINESSEXPENSE_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "check-devices",
            label: "Check Devices",
            onClick: () => navigate(PATH.CHECK_DEVICES_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "database-backup",
            label: "Database Backup",
            onClick: () => navigate(PATH.DATABASE_BACKUP_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        },
        {
            key: "gym-leads",
            label: "Gym Enquiries",
            onClick: () => navigate(PATH.GYMLEAD_LIST_PATH),
            icon: <PieChartOutlined />,
            children: null,
            permissions: [Permission.ALL],
        }, 
    {
            key: "paymentPackage",
            label: "paymentPackage",
            onClick: () => navigate(PATH.PAYMENTPACKAGE_LIST_PATH),
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
