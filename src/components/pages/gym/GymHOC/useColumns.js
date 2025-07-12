import React from "react";
import TableActionButtons from "../../../common/TablesActionButtons";
import { DELETE_GYM_URL } from "../../../../helpers/Constant";
import { useCheckScreenType } from "../../../common/useCheckScreenType";
import { Button, Image } from "antd";
import CustomImage from "../../../common/CustomImage";
import { Link } from "react-router-dom";
import { DEVICE_LIST_PATH } from "../../../../routes/Slugs";
import MissingUsersCheck from "../MissingUsersCheck";

const useColumns = (props) => {
    const screenType = useCheckScreenType();

    return [
        {
            title: "Image",
            dataIndex: "logo",
            key: "image",
            width: 60,
            render: (e) => <CustomImage width={50} src={`${e}`} />,
        },
        {
            title: "Name",
            dataIndex: "gymName",
            key: "gymName",
            width: 150,
        },
        {
            title: "Security",
            key: "gymName",
            width: 150,
            render: (e) => (
                <div>
                    {!e.deviceList || e.deviceList.length === 0 ? (
                        <p>
                            Ip: {e.deviceIp} : {e.devicePort}
                        </p>
                    ) : (
                        e.deviceList.map((d) => <p>{`${d.ip} : ${d.port}`}</p>)
                    )}
                    <p>Auto disable: {e.autoEntryDisable ? "Yes" : "No"}</p>
                    <p>Library: {e.pyzk ? "Pyzk" : "TadPhp"}</p>
                </div>
            ),
        },
        {
            title: "SMS",
            dataIndex: "smsCredit",
            key: "smsCredit",
            width: 100,
        },
        {
            title: "Check",
            key: "check",
            width: 100,
            render: (e) =>
                e.deviceList && e.deviceList?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {e.deviceList.map((device) => (
                            <Link
                                to={`${DEVICE_LIST_PATH}/${e._id}?ip=${device.ip}&port=${device.port}`}
                            >
                                <Button>{device.title}</Button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Link to={`${DEVICE_LIST_PATH}/${e._id}`}>
                        <Button>Check device</Button>
                    </Link>
                ),
        },
        {
            title: "Missing users",
            key: "missing",
            width: 100,
            render: (e) =>
                e.deviceList && e.deviceList?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {e.deviceList.map((device) => (
                            <MissingUsersCheck
                                gym={e._id}
                                ip={device.ip}
                                port={device.port}
                                title={device.title}
                            />
                        ))}
                    </div>
                ) : (
                    <MissingUsersCheck
                        gym={e._id}
                        ip={e.deviceIp}
                        port={e.devicePort}
                    />
                ),
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: screenType.isDesktop ? 90 : 65,
            render: (e) => (
                <TableActionButtons
                    data={e}
                    deleteUrl={DELETE_GYM_URL}
                    moduleName="gym"
                    callback={props.callback}
                />
            ),
        },
    ];
};

export default useColumns;
