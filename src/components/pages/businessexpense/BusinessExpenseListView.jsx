import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useBusinessExpenseColumns from "./BusinessExpenseHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useBusinessExpenseFilterItems from "./BusinessExpenseHOC/useFilterItems";
import {
    ADD_BUSINESSEXPENSE_PATH,
    BUSINESSEXPENSE_LIST_PATH,
} from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_BUSINESSEXPENSE } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const BusinessExpenseListView = () => {
    const { dataList, loadingList, totalElements, getAllData } = useGetAllData(
        GET_ALL_BUSINESSEXPENSE,
    );

    const columns = useBusinessExpenseColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="businessExpense list"
            extra={[
                <Link key="add-businessExpense" to={ADD_BUSINESSEXPENSE_PATH}>
                    <Button key="add-button" type="primary">
                        Add businessExpense
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search businessExpense"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useBusinessExpenseFilterItems()}
                    currentPath={BUSINESSEXPENSE_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={BUSINESSEXPENSE_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default BusinessExpenseListView;
