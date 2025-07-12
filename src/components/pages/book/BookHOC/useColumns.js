import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { IMAGE_URL, DELETE_BOOK_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Image } from "antd";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Image",
            dataIndex: "thumbnail",
            key: "image",
            width: 160,
            render: (e) => <Image width={150} src={`${IMAGE_URL}/${e}`} />
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 150 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_BOOK_URL}
                    moduleName="Book"
                    callback={props.callback}
                />
            )
        }
    ];
};

export default useColumns;
