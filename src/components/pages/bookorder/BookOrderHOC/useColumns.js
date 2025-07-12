import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { IMAGE_URL, DELETE_BOOKORDER_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Image } from "antd";
import { getLocalDate } from "../../../../helpers/Utils";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "date",
            render: (e) => getLocalDate(e)
        },
        {
            title: "Phone",
            dataIndex: "user",
            key: "phone",
            render: (e) => e.phone
        },
        {
            title: "Book",
            dataIndex: "book",
            key: "title",
            render: (e) => e.title
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
            width: 150
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 90 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_BOOKORDER_URL}
                    moduleName="BookOrder"
                    callback={props.callback}
                />
            )
        }
    ];
};

export default useColumns;
