import { useState } from "react";
import {
    ENABLE_MISSING_USERS_API,
    NOT_EXPIRED_NOT_ACTIVE,
} from "../../../helpers/Constant";
import { Toast } from "../../common/Toast";
import api from "../../../services/Api";
import DownloadExcel from "../../common/DownloadExcel";
import { getLocalDate, ScrollConfig } from "../../../helpers/Utils";
import { Button, Modal, Table } from "antd";
import { UsergroupDeleteOutlined } from "@ant-design/icons";

const MissingUsersCheck = ({ gym, ip, port, title }) => {
    const [notExpireLoading, setNotExpireLoading] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const enableMissingUsers = async () => {
        api.getSingleData(
            {
                url: `${ENABLE_MISSING_USERS_API}/${gym}?ip=${ip}&port=${port}`,
                setLoading: setNotExpireLoading,
            },
            (_) =>
                Toast("success", "Processing", "Check again after some time."),
        );
    };
    const notExpiredNotActive = () => {
        !notExpireLoading &&
            api.getSingleData(
                {
                    url: `${NOT_EXPIRED_NOT_ACTIVE}/${gym}?ip=${ip}&port=${port}`,
                    setLoading: setNotExpireLoading,
                },
                (res) => {
                    setModalContent(
                        <div>
                            <div className="flex gap-2 mt-5 mb-2">
                                <DownloadExcel
                                    fileName={"Missing-device-users"}
                                    dataUrl={`${NOT_EXPIRED_NOT_ACTIVE}/${gym}`}
                                    getConfig={(d) =>
                                        d.map((e) => ({
                                            Id: e.userId,
                                            Name: e.fullName,
                                            Gender: e.gender,
                                            Card: e.card,
                                            "Expired Date": getLocalDate(
                                                e.paymentClearTo,
                                            ),
                                        }))
                                    }
                                    searchparams={{}}
                                />
                                <Button onClick={enableMissingUsers}>
                                    Enable missing users
                                </Button>
                            </div>

                            <Table
                                dataSource={res.data}
                                columns={columns}
                                scroll={ScrollConfig()}
                            />
                        </div>,
                    );
                    setTimeout(() => {
                        setShowModal(true);
                    }, 500);
                },
            );
    };

    return (
        <div>
            <Button
                loading={notExpireLoading}
                onClick={notExpiredNotActive}
                key="not-expired"
            >
                {title ?? <UsergroupDeleteOutlined className="text-red-500" />}
            </Button>
            <Modal
                width={1200}
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
                {modalContent}
            </Modal>
        </div>
    );
};

const columns = [
    {
        title: "Id",
        dataIndex: "userId",
        key: "id",
        width: 100,
    },
    {
        title: "Name",
        dataIndex: "fullName",
        key: "name",
        width: 150,
    },
    {
        title: "Gen",
        dataIndex: "gender",
        key: "gender",
        width: 80,
    },
    {
        title: "Card",
        dataIndex: "card",
        key: "card",
        width: 80,
    },
    {
        title: "Pin",
        key: "name",
        width: 200,
        render: (e) => (
            <div>
                {e.accessList && e.accessList.length > 0
                    ? e.accessList?.map((a, idx) => (
                          <p key={idx}>
                              {a.title} - {a.pin}
                          </p>
                      ))
                    : e.zkTechoDevicePin}
            </div>
        ),
    },
    {
        title: "Active",
        dataIndex: "activeEntry",
        key: "activeEntry",
        width: 100,
        render: (e) => (e ? "Yes" : "No"),
    },
];

export default MissingUsersCheck;
