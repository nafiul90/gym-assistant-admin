import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import usePaymentsColumns from "./PaymentsHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import usePaymentsFilterItems from "./PaymentsHOC/useFilterItems";
import { ADD_PAYMENTS_PATH, PAYMENTS_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_PAYMENTS } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { getLocalDate, ScrollConfig, useQuery } from "../../../helpers/Utils";
import DownloadExcel from "../../common/DownloadExcel";
import { usePaymentConfig } from "./PaymentsHOC/excelConfig";
import pDate from "./PaymentsHOC/fit-and-fitness-payment.json";

const PaymentsListView = () => {
    const { dataList, loadingList, totalElements, getAllData } = useGetAllData(
        `${GET_ALL_PAYMENTS}?canceled=false`,
    );

    const columns = usePaymentsColumns({ callback: getAllData });
    const query = useQuery();

    const pageHeader = (
        <CustomPageHeader
            title="payments list"
            extra={[
                query.get("gym") && (
                    // <DownloadExcel
                    //     key="excel"
                    //     dataUrl={GET_ALL_PAYMENTS}
                    //     searchparams={{
                    //         gym: query.get("gym"),
                    //         canceled: false,
                    //     }}
                    //     getConfig={usePaymentConfig}
                    //     fileName={`Payment-report-${getLocalDate(new Date(), "dd-mm-yy")}`}
                    // >
                    //     Download
                    // </DownloadExcel>
                    <DownloadExcel
                        key="excel"
                        // dataUrl={GET_ALL_PAYMENTS}
                        isLocalFile={true}
                        localFile={pDate}
                        searchparams={{
                            gym: query.get("gym"),
                            canceled: false,
                        }}
                        // getConfig={usePaymentConfig}
                        fileName={`Payment-report-${getLocalDate(new Date(), "dd-mm-yy")}`}
                    >
                        Download old
                    </DownloadExcel>
                ),
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search payments"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={usePaymentsFilterItems()}
                    currentPath={PAYMENTS_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={PAYMENTS_LIST_PATH}
                    scroll={ScrollConfig}
                />
            </div>
        </PageWrapper>
    );
};

export default PaymentsListView;
