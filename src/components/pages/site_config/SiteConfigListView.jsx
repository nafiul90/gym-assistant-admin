import React from "react";
import { GET_ALL_SITE_CONFIGS } from "../../../helpers/Constant";
import {
    ADD_SITE_CONFIG_PATH,
    SITE_CONFIG_LIST_PATH,
} from "../../../routes/Slugs";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import BaseTable from "../../common/BaseTable";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { useGetAllData } from "../../common/useGetAllData";
import useSiteConfigColumns from "./SiteConfigHOC/useColumns";
import useSiteConfigFilterItems from "./SiteConfigHOC/useFilterItems";

import { Button } from "antd";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const SiteConfigListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_SITE_CONFIGS);

    const columns = useSiteConfigColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="Site Configurations"
            extra={[
                <Link key="add-site-config" to={ADD_SITE_CONFIG_PATH}>
                    <Button key="add-button" type="primary">
                        Add Site Config
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search Site Config"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useSiteConfigFilterItems()}
                    currentPath={SITE_CONFIG_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={SITE_CONFIG_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default SiteConfigListView;
