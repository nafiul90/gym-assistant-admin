import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { IMAGE_URL, DELETE_DEVICE_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Image } from "antd";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "PIN",
            key: "pin2",
            width: 100,
            render: (e) => (
                <div>
                    <p>Pin: {e.PIN2}</p>
                    <p>Id: {e.PIN}</p>
                </div>
            ),
        },
        {
            title: "Name",
            dataIndex: "Name",
            key: "Name",
            width: 100,
        },
        {
            title: "Card",
            dataIndex: "Card",
            key: "Card",
            width: 100,
        },
        {
            title: "Password",
            dataIndex: "Password",
            key: "password",
            width: 100,
        },
        {
            title: "Privilege",
            dataIndex: "Privilege",
            key: "Privilege",
            width: 100,
        },
        // {
        //     title: "",
        //     key: "action",
        //     fixed: "right",
        //     width: screenType.isDesktop ? 90 : 65,
        //     render: (e) => (
        //         <TableActionButtons
        //             data={e}
        //             deleteUrl={DELETE_DEVICE_URL}
        //             moduleName="device"
        //             callback={props.callback}
        //         />
        //     )
        // }
    ];
};

export default useColumns;
