import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useInvoiceColumns from "./InvoiceHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useInvoiceFilterItems from "./InvoiceHOC/useFilterItems";
import { ADD_INVOICE_PATH, INVOICE_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_INVOICE } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";
import LoadingSuspense from "../../common/LoadingSuspense";

const InvoiceListView = () => {
    const { dataList, loadingList, totalElements, getAllData, summary } =
        useGetAllData(GET_ALL_INVOICE);

    const columns = useInvoiceColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="Invoice list"
            extra={[
                <Link key="add-invoice" to={ADD_INVOICE_PATH}>
                    <Button key="add-button" type="primary">
                        Add invoice
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search invoice"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useInvoiceFilterItems()}
                    currentPath={INVOICE_LIST_PATH}
                />
                {loadingList ? (
                    <LoadingSuspense />
                ) : (
                    <div className="flex gap-4 mb-2">
                        <p>Total: {summary?.totalFinalPrice?.toFixed(0)}</p>
                        <p>Paid: {summary?.totalPaid?.toFixed(0)}</p>
                        <p>
                            Due:{" "}
                            {(
                                summary?.totalFinalPrice - summary?.totalPaid
                            )?.toFixed(0)}
                        </p>
                    </div>
                )}

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={INVOICE_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default InvoiceListView;
