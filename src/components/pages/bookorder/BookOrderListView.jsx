import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useBookOrderColumns from "./BookOrderHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useBookOrderFilterItems from "./BookOrderHOC/useFilterItems";
import { ADD_BOOKORDER_PATH, BOOKORDER_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_BOOKORDER } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const BookOrderListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_BOOKORDER);

    const columns = useBookOrderColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="BookOrder list"
            extra={[
                <Link key="add-BookOrder" to={ADD_BOOKORDER_PATH}>
                    <Button key="add-button" type="primary">
                        Add BookOrder
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search BookOrder"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useBookOrderFilterItems()}
                    currentPath={BOOKORDER_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={BOOKORDER_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default BookOrderListView;
