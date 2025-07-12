import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { GET_ALL_STATIC_PAGES } from "../../../helpers/Constant";
import {
    ADD_STATIC_PAGE_PATH,
    STATIC_PAGE_LIST_PATH,
} from "../../../routes/Slugs";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import BaseTable from "../../common/BaseTable";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { useGetAllData } from "../../common/useGetAllData";
import useStaticPageColumns from "./StaticPageHOC/useColumns";
import useStaticPageFilterItems from "./StaticPageHOC/useFilterItems";

import { ScrollConfig } from "../../../helpers/Utils";

const StaticPageListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_STATIC_PAGES);

    const columns = useStaticPageColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="Static Page List"
            extra={[
                <Link key="add-static-page" to={ADD_STATIC_PAGE_PATH}>
                    <Button key="add-button" type="primary">
                        Add Static Page
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search Static Page"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useStaticPageFilterItems()}
                    currentPath={STATIC_PAGE_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={STATIC_PAGE_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default StaticPageListView;
