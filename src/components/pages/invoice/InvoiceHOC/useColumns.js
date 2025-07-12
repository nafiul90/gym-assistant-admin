import React, { useState } from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import {
    IMAGE_URL,
    DELETE_INVOICE_URL,
    DOWNLOAD_INVOICE_URL,
} from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Button, Image } from "antd";
import { getLocalDate } from "../../../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import {
    ADD_GYMPAYMENT_PATH,
    GYMPAYMENT_LIST_PATH,
} from "../../../../routes/Slugs";
import { PrinterOutlined } from "@ant-design/icons";
import api from "../../../../services/Api";
import LoadingSuspense from "../../../common/LoadingSuspense";

const useColumns = (props) => {
    const screenType = useCheckScreenType();
    const navigate = useNavigate();

    return [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 150,
            render: (e) => getLocalDate(e),
        },
        {
            title: "Id",
            // dataIndex: "invoiceId",
            key: "id",
            width: 100,
            render: (e) => (
                <div>
                    <p>{e.invoiceId}</p>
                    <p>{e.status}</p>
                </div>
            ),
        },
        {
            title: "Gym & Type",
            key: "date",
            width: 150,
            render: (e) => (
                <div>
                    <p>{e?.gym?.gymName}</p>
                    <p>{e?.type}</p>
                </div>
            ),
        },

        {
            title: "Total",
            key: "totalAmount",
            width: 150,
            render: (e) => (
                <div>
                    <p>Total: {e?.totalAmount}</p>
                    <p>Discount: {e?.discount}</p>
                </div>
            ),
        },
        {
            title: "Price info",
            key: "finalPrice",
            width: 150,
            render: (e) => (
                <div>
                    <p>Final price: {e?.finalPrice}</p>
                    <p>Total paid: {e?.totalPaid}</p>
                </div>
            ),
        },

        {
            title: "Due",
            dataIndex: "due",
            key: "due",
            width: 100,
        },
        {
            title: "Payment",
            key: "payment",
            width: 150,
            render: (e) => (
                <div>
                    <Button
                        onClick={() =>
                            navigate(`${ADD_GYMPAYMENT_PATH}/${e._id}`)
                        }
                    >
                        + Payment
                    </Button>
                    <div className="flex gap-2 mt-2">
                        <Button
                            onClick={() =>
                                navigate(
                                    `${GYMPAYMENT_LIST_PATH}?invoice=${e._id}`
                                )
                            }
                        >
                            History
                        </Button>
                        <DownloadInvoiceButton id={e._id} invoiceId={e} />
                    </div>
                </div>
            ),
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 250 : 65,
            render: (e) => (
                <div className="flex gap-2">
                    <TableActionButtons
                        data={e}
                        deleteUrl={DELETE_INVOICE_URL}
                        moduleName="invoice"
                        callback={props.callback}
                    />
                </div>
            ),
        },
    ];
};

const DownloadInvoiceButton = ({ id }) => {
    const [loadingDownload, setLoadingDownload] = useState(false);
    return (
        <Button
            onClick={() => {
                setLoadingDownload(true);

                const link = document.createElement("a");
                link.href = `${DOWNLOAD_INVOICE_URL}/${id}`;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    setLoadingDownload(false);
                }, 2500);
                document.body.removeChild(link);
            }}
        >
            {loadingDownload ? (
                <LoadingSuspense size="small" />
            ) : (
                <PrinterOutlined />
            )}
        </Button>
    );
};

export default useColumns;
