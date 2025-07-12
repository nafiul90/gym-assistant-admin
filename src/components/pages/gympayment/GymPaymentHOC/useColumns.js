import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { DELETE_GYMPAYMENT_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { getLocalDate } from "../../../../helpers/Utils";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 150,
            render: (e) => getLocalDate(e),
        },

        {
            title: "Gym",
            dataIndex: "gym",
            key: "gym",
            width: 150,
            render: (e) => e?.gymName,
        },
        {
            title: "Invoice Id",
            dataIndex: "invoice",
            key: "invoice",
            width: 100,
            render: (e) => e?.invoiceId,
        },
        {
            title: "Payment Id",
            dataIndex: "paymentId",
            key: "id",
            width: 100,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
        },
        {
            title: "Paid Amount",
            dataIndex: "paidAmount",
            key: "paidAmount",
            width: 150,
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 130 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_GYMPAYMENT_URL}
                    moduleName="gymPayment"
                    callback={props.callback}
                />
            ),
        },
    ];
};

export default useColumns;
