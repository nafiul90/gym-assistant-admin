import React, { useState } from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button, Modal } from "antd";
import useGymColumns from "./GymHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useGymFilterItems from "./GymHOC/useFilterItems";
import { ADD_GYM_PATH, GYM_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import {
    CHECK_DEVICES_URL,
    CHECK_EXPIRED_USERS_DEVICES_STATUS_URL,
    GET_ALL_GYM,
} from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";
import api from "../../../services/Api";
import { Toast } from "../../common/Toast";

const GymListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_GYM);
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [loadingUserCheck, setLoadingUserCheck] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const columns = useGymColumns({ callback: getAllData });

    const checkDevices = () => {
        api.getSingleData(
            { url: CHECK_DEVICES_URL, setLoading: setLoadingCheck },
            (res) => {}
        );
        Toast(
            "success",
            "Request on process",
            "You will get a mail in gymassistat.info@gmail.com once the process is done."
        );
    };

    const checkExpiredUsers = () => {
        api.getSingleData(
            {
                url: CHECK_EXPIRED_USERS_DEVICES_STATUS_URL,
                setLoading: setLoadingUserCheck,
            },
            (res) => {
                setModalContent(
                    <div>
                        <p style={{ fontSize: "18px", margin: "5px" }}>
                            Expired but active in devices:{" "}
                        </p>
                        {res.data?.map((e) => (
                            <p style={{ margin: "5px" }}>
                                {e.gym} - {e.userCount}
                            </p>
                        ))}
                    </div>
                );
                setTimeout(() => {
                    setOpenModal(true);
                }, 500);
            }
        );
    };

    const pageHeader = (
        <CustomPageHeader
            title="gym list"
            extra={[
                <Button
                    loading={loadingUserCheck}
                    onClick={checkExpiredUsers}
                    key="user-check"
                >
                    Check expired users
                </Button>,
                <Button onClick={checkDevices} key="device-check">
                    Check devices status
                </Button>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <Modal
                    footer={null}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                >
                    {modalContent}
                </Modal>
                <BaseFilterComponent
                    title="Search gym"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useGymFilterItems()}
                    currentPath={GYM_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={GYM_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default GymListView;
