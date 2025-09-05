import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { IMAGE_URL, DELETE_PAYMENTS_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Image } from "antd";
import { getLocalDate } from "../../../../helpers/Utils";

const useColumns = (props) => {
    return [
        {
            title: "Date",
            dataIndex: "paymentDate",
            key: "date",
            width: 150,
            render: (e) => getLocalDate(e),
        },
        {
            title: "Member",
            dataIndex: "user",
            key: "user",
            width: 150,
            render: (e) => (
                <div>
                    <p>{e?.fullName}</p>
                    <p>{e?.phone}</p>
                </div>
            ),
        },
        {
            title: "Package",
            dataIndex: "paymentPackage",
            key: "package",
            width: 150,
            render: (e) => (
                <div>
                    <p>{e?.title}</p>
                </div>
            ),
        },
        {
            title: "Total",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 150,
        },
        {
            title: "Paid Amount",
            dataIndex: "paidAmount",
            key: "paidAmount",
            width: 150,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            width: 150,
        },
        {
            title: "Due",
            dataIndex: "due",
            key: "due",
            width: 150,
            render: (e) => Math.abs(e),
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
            width: 150,
            render: (e) => (
                <div>
                    <p>{e?.fullName}</p>
                    <p>{e?.phone}</p>
                </div>
            ),
        },
    ];
};

export default useColumns;
