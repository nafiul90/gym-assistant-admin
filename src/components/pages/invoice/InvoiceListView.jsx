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

const InvoiceListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
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
