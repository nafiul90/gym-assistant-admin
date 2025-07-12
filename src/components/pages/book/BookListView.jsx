import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useBookColumns from "./BookHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useBookFilterItems from "./BookHOC/useFilterItems";
import { ADD_BOOK_PATH, BOOK_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_BOOK } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const BookListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_BOOK);

    const columns = useBookColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="Book list"
            extra={[
                <Link key="add-Book" to={ADD_BOOK_PATH}>
                    <Button key="add-button" type="primary">
                        Add Book
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search Book"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useBookFilterItems()}
                    currentPath={BOOK_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={BOOK_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default BookListView;
