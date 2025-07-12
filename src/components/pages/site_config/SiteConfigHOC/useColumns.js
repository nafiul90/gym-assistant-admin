import { Image } from "antd";
import React from "react";
import { IMAGE_URL } from "../../../../helpers/Constant";
import TableActionButtons from "../../../common/TablesActionButtons";
import { useCheckScreenType } from "../../../common/useCheckScreenType";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Site title",
            dataIndex: "siteTitle",
            key: "siteTitle",
            width: 200
        },
        {
            title: "Logo",
            dataIndex: "logo",
            key: "logo",
            width: 150,
            render: (e) => <Image width={150} src={`${IMAGE_URL}/${e}`} />
        },
        {
            title: "Favicon",
            dataIndex: "favicon",
            key: "favicon",
            width: 150,
            render: (e) => <Image width={150} src={`${IMAGE_URL}/${e}`} />
        },
        {
            title: "Login Page Image",
            dataIndex: "loginPageImage",
            key: "loginPageImage",
            width: 150,
            render: (e) => <Image width={150} src={`${IMAGE_URL}/${e}`} />
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 80 : 25,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    moduleName="site-config"
                    callback={props.callback}
                    showDelete={false}
                    showView={false}
                />
            )
        }
    ];
};

export default useColumns;
