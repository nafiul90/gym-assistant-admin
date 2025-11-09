import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { DELETE_BUSINESSEXPENSE_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Type",
            dataIndex: "businessExpenseType",
            key: "businessExpenseType",
            width: 200,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 200,
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            width: 200,
        },
        {
            title: "Gym",
            dataIndex: "gym",
            key: "gym",
            width: 100,
            render: (e) => <p>{e.gymName}</p>,
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 90 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_BUSINESSEXPENSE_URL}
                    moduleName="businessExpense"
                    callback={props.callback}
                />
            ),
        },
    ];
};

export default useColumns;
