import React from "react";
import { DELETE_USER_URL } from "../../../../helpers/Constant";
import TableActionButtons from "../../../common/TablesActionButtons";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { getLocalDate, isPastDate } from "../../../../helpers/Utils";
// import { getLocalDate, isPastDate } from "../../../../helpers/Utils";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Name",
            key: "fullName",
            width: 150,
            render: (e) => (
                <div>
                    <p>{e.fullName}</p>
                    <p>{e.userId}</p>
                </div>
            ),
        },
        {
            title: "Expire",
            key: "expire",
            width: 150,
            render: (e) => (
                <div>
                    <p>
                        {isPastDate(e.paymentClearTo) && (
                            <span className="text-red-600">{"Expired, "}</span>
                        )}
                        <span
                            className={
                                e.activeEntry ? "text-green" : "text-red-600"
                            }
                        >
                            {e.activeEntry ? "Active" : "Not Active"}
                        </span>
                    </p>
                    <p>{getLocalDate(e.paymentClearTo, "DD-MMM-YY")}</p>
                </div>
            ),
        },
        {
            title: "Phone",
            key: "phone",
            width: 150,
            render: (e) => (
                <div>
                    <p>{e.phone}</p>
                    <p>
                        Card: {e.card} Pin: {e.zkTechoDevicePin}
                    </p>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            width: 150,
        },
        {
            title: "SMS Balance",
            dataIndex: "smsBalance",
            key: "smsBalance",
            width: 100,
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 150 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_USER_URL}
                    moduleName="user"
                    callback={props.callback}
                />
            ),
        },
    ];
};

export default useColumns;
