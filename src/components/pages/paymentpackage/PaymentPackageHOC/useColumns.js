import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { IMAGE_URL, DELETE_PAYMENTPACKAGE_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Image } from "antd";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 200
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 90 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_PAYMENTPACKAGE_URL}
                    moduleName="PaymentPackage"
                    callback={props.callback}
                />
            )
        }
    ];
};

export default useColumns;