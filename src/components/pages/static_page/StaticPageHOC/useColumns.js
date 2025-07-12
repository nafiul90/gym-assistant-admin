import React from "react";
import {
    DELETE_STATIC_PAGE_URL,
    UPDATE_STATIC_PAGE_URL
} from "../../../../helpers/Constant";
import CommonSingleNumberInput from "../../../common/CommonSingleNumberInput";
import TableActionButtons from "../../../common/TablesActionButtons";
import { useCheckScreenType } from "../../../common/useCheckScreenType";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Page name",
            dataIndex: "pageName",
            key: "pageName",
            width: 200
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            width: 200
        },
        {
            title: "Serial",
            key: "serial",
            width: 200,
            render: (e) => (
                <CommonSingleNumberInput
                    submitUrl={`${UPDATE_STATIC_PAGE_URL}/${e?._id}`}
                    getBodyData={(value) => ({
                        ...e,
                        serial: Number(value)
                    })}
                    getAllData={props?.callback}
                    defaultValue={e?.serial}
                />
            )
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 150 : 25,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_STATIC_PAGE_URL}
                    moduleName="static-page"
                    callback={props.callback}
                />
            )
        }
    ];
};

export default useColumns;
