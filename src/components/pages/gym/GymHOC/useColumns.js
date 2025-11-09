import React, { useState } from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import {
    CREATE_INVOICE_URL,
    DELETE_GYM_URL,
} from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Button } from "antd";

import { Link } from "react-router-dom";
import { DEVICE_LIST_PATH } from "../../../../routes/Slugs";
import MissingUsersCheck from "../MissingUsersCheck";
import api from "../../../../services/Api";
import {
    getAllQueryParams,
    getLocalDate,
    useQuery,
} from "../../../../helpers/Utils";
import { Toast } from "../../../common/Toast";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Payment",
            key: "payment",
            width: 150,
            render: (e) =>
                e.active ? (
                    <InvoiceStatus gym={e} callback={props.callback} />
                ) : (
                    <div className="h-2 w-2 bg-red-500 rounded-md"></div>
                ),
        },
        {
            title: "Name",
            dataIndex: "gymName",
            key: "gymName",
            width: 150,
        },
        {
            title: "Security",
            key: "gymName",
            width: 180,
            render: (e) => (
                <div>
                    {!e.deviceList || e.deviceList.length === 0 ? (
                        <p>
                            {e.deviceIp} : {e.devicePort}
                        </p>
                    ) : (
                        e.deviceList.map((d) => <p>{`${d.ip} : ${d.port}`}</p>)
                    )}
                    <p className={e.autoEntryDisable ? "text-green" : ""}>
                        Auto disable: {e.autoEntryDisable ? "Yes" : "No"}
                    </p>
                    <p>{e.bioTime ? "Biotime" : e.pyzk ? "Pyzk" : "TadPhp"}</p>
                </div>
            ),
        },
        {
            title: "SMS",
            dataIndex: "smsCredit",
            key: "smsCredit",
            width: 100,
            render: (e) => (
                <div
                    className={
                        e < 0
                            ? "px-3 border border-red-300 bg-red-50 rounded-md"
                            : "px-3 border border-blue-300 bg-blue-50 rounded-md"
                    }
                >
                    {e}
                </div>
            ),
        },
        {
            title: "Check",
            key: "check",
            width: 100,
            render: (e) =>
                e.deviceList && e.deviceList?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {e.deviceList.map((device) => (
                            <Link
                                to={`${DEVICE_LIST_PATH}/${e._id}?ip=${device.ip}&port=${device.port}`}
                            >
                                <Button>{device.title}</Button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Link to={`${DEVICE_LIST_PATH}/${e._id}`}>
                        <img src="/f18.png" />
                    </Link>
                ),
        },
        {
            title: "Missing users",
            key: "missing",
            width: 100,
            render: (e) =>
                e.deviceList && e.deviceList?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {e.deviceList.map((device) => (
                            <MissingUsersCheck
                                gym={e._id}
                                ip={device.ip}
                                port={device.port}
                                title={device.title}
                            />
                        ))}
                    </div>
                ) : (
                    <MissingUsersCheck
                        gym={e._id}
                        ip={e.deviceIp}
                        port={e.devicePort}
                    />
                ),
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 90 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_GYM_URL}
                    moduleName="gym"
                    callback={props.callback}
                />
            ),
        },
    ];
};

const InvoiceStatus = ({ gym, callback }) => {
    const [loading, setLoading] = useState(false);
    const query = useQuery();

    // console.log("query -=> ", useLocation());

    const createInvoice = async () => {
        api.createData(
            {
                url: CREATE_INVOICE_URL,
                setLoading,
                body: {
                    date: new Date(),
                    gym: gym._id,
                    type: "Monthly Fee",
                    currency: "BDT",
                    items: [
                        {
                            title: `Monthly fee for ${getLocalDate(new Date(), "MMMM YYYY")}`,
                            unitPrice: gym.subscriptionFee,
                            unitType: "Gym",
                            quantity: 1,
                        },
                    ],
                },
            },
            (_) => {
                callback(getAllQueryParams(query));
                Toast("success", "Success", "Invoice created successfully.");
            },
        );
    };

    const dueMonths = (clearTo) => {
        if (!clearTo) return 1;
        clearTo = new Date(clearTo);
        const today = new Date();
        return today.getMonth() - clearTo.getMonth();
    };

    const invoicePending = (lastDate) => {
        if (!lastDate) return 1;
        lastDate = new Date(lastDate);
        const today = new Date();
        return today.getMonth() - lastDate.getMonth();
    };

    return (
        <div>
            {invoicePending(gym.lastInvoiceDate) ? (
                loading ? (
                    <LoadingOutlined />
                ) : (
                    <Button type="primary" onClick={createInvoice}>
                        Create Invoice
                    </Button>
                )
            ) : null}
            {dueMonths(gym.paymentClearTo) ? (
                <p className="text-red-600">
                    Due: {dueMonths(gym.paymentClearTo)} Months
                </p>
            ) : (
                <p className="text-green">Paid</p>
            )}
            Fee: {gym.subscriptionFee}
        </div>
    );
};

export default useColumns;
