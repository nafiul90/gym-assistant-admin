import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { IMAGE_URL, DELETE_SMSRECORDS_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Image } from "antd";
import { getDecodedMessage, getLocalDate } from "../../../../helpers/Utils";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Info",
            key: "type",
            width: 150,
            render: (e) => (
                <div>
                    <p>{getLocalDate(e.createdAt)}</p>
                    <p>{e.type}</p>
                    <p>{e.gym?.gymName}</p>
                    <p>{e.to?.length < 15 ? e.to : ""}</p>
                </div>
            ),
        },
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
            width: 200,
            render: (e) => getDecodedMessage(e),
        },
        {
            title: "Text",
            dataIndex: "Text",
            key: "text",
            width: 100,
        },
        {
            title: "Calculation",
            key: "calculation",
            width: 150,
            render: (e) => (
                <div>
                    <p>Text part: {e.smsPart ?? 1}</p>
                    <p>Total Member: {e.totalMembers ?? 1}</p>
                    <p>Total Sms: {e.totalSms ?? 1}</p>
                </div>
            ),
        },
    ];
};

export default useColumns;
