import { Button, Modal } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    DISABLE_ALL_EXPIRED_USER,
    ENABLE_MISSING_USERS_API,
    EXTENDED_USER_API_URL,
    GET_ALL_USER,
    NOT_EXPIRED_NOT_ACTIVE,
    USER_WITH_NO_PAYMENT_API_URL,
} from "../../../helpers/Constant";
import {
    getAllQueryParams,
    getLocalDate,
    ScrollConfig,
    useQuery,
} from "../../../helpers/Utils";
import { ADD_USER_PATH, USER_LIST_PATH } from "../../../routes/Slugs";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import BaseTable from "../../common/BaseTable";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { useGetAllData } from "../../common/useGetAllData";
import useUserColumns from "./UserHOC/useColumns";
import useUserFilterItems from "./UserHOC/useFilterItems";
import api from "../../../services/Api";
import { Toast } from "../../common/Toast";
import LoadingSuspense from "../../common/LoadingSuspense";
import DownloadExcel from "../../common/DownloadExcel";
import { useUserExcelConfig } from "./UserHOC/useUserExcelConfig";
import {
    useExtendedUserConfig,
    useNoPaymentUserConfig,
} from "./UserHOC/useExtendedUserConfig";

const UserListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_USER);
    const query = useQuery();
    const [expireLoading, setExpireLoading] = useState(false);

    const columns = useUserColumns({ callback: getAllData });

    const disableExpiredUser = () => {
        const gym = query.get("gym");
        !expireLoading &&
            api.getSingleData(
                {
                    url: `${DISABLE_ALL_EXPIRED_USER}/${gym}`,
                    setLoading: setExpireLoading,
                },
                (res) => {
                    Toast("success", "Completed", res.data?.message);
                }
            );
    };

    const pageHeader = (
        <CustomPageHeader
            title="User List"
            extra={[
                <DownloadExcel
                    key="excel"
                    dataUrl={GET_ALL_USER}
                    searchparams={getAllQueryParams(query)}
                    getConfig={useUserExcelConfig}
                    fileName={`user-report-${getLocalDate(new Date(), "dd-mm-yy_h:mm_a")}`}
                />,
                query.get("gym") && (
                    <Button onClick={disableExpiredUser} key="expire-button">
                        {expireLoading ? (
                            <LoadingSuspense size="small" />
                        ) : (
                            "Disable expired users"
                        )}
                    </Button>
                ),
                query.get("gym") && (
                    <DownloadExcel
                        key="excel"
                        dataUrl={EXTENDED_USER_API_URL}
                        searchparams={{ gym: query.get("gym") }}
                        getConfig={useExtendedUserConfig}
                        fileName={`extended-users-${getLocalDate(new Date(), "dd-mm-yy")}`}
                    >
                        Extended users
                    </DownloadExcel>
                ),
                query.get("gym") && (
                    <DownloadExcel
                        key="excel"
                        dataUrl={USER_WITH_NO_PAYMENT_API_URL}
                        searchparams={{ gym: query.get("gym") }}
                        getConfig={useNoPaymentUserConfig}
                        fileName={`no-payment-users-${getLocalDate(new Date(), "dd-mm-yy")}`}
                    >
                        No payment users
                    </DownloadExcel>
                ),
                <Link key="add-user" to={ADD_USER_PATH}>
                    <Button key="add-button" type="primary">
                        Add User
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search Users"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useUserFilterItems()}
                    currentPath={USER_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={USER_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default UserListView;
