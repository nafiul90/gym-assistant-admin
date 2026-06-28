import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import usePaymentPackageColumns from "./PaymentPackageHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import usePaymentPackageFilterItems from "./PaymentPackageHOC/useFilterItems";
import {
    ADD_PAYMENTPACKAGE_PATH,
    PAYMENTPACKAGE_LIST_PATH,
} from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_PAYMENTPACKAGE } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const PaymentPackageListView = () => {
    const { dataList, loadingList, totalElements, getAllData } = useGetAllData(
        GET_ALL_PAYMENTPACKAGE,
    );

    const columns = usePaymentPackageColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="PaymentPackage list"
            extra={[
                <Link key="add-PaymentPackage" to={ADD_PAYMENTPACKAGE_PATH}>
                    <Button key="add-button" type="primary">
                        Add PaymentPackage
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search PaymentPackage"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={usePaymentPackageFilterItems()}
                    currentPath={PAYMENTPACKAGE_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={PAYMENTPACKAGE_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default PaymentPackageListView;
