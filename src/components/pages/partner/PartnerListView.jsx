import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import usePartnerColumns from "./PartnerHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import usePartnerFilterItems from "./PartnerHOC/useFilterItems";
import { ADD_PARTNER_PATH, PARTNER_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_PARTNER } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const PartnerListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_PARTNER);

    const columns = usePartnerColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="partner list"
            extra={[
                <Link key="add-partner" to={ADD_PARTNER_PATH}>
                    <Button key="add-button" type="primary">
                        Add partner
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search partner"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={usePartnerFilterItems()}
                    currentPath={PARTNER_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={PARTNER_LIST_PATH}
                    scroll={ScrollConfig}
                />
            </div>
        </PageWrapper>
    );
};

export default PartnerListView;
