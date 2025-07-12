import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useSmsRecordsColumns from "./SmsRecordsHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useSmsRecordsFilterItems from "./SmsRecordsHOC/useFilterItems";
import {
    ADD_SMSRECORDS_PATH,
    SMSRECORDS_LIST_PATH,
} from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_SMSRECORDS } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const SmsRecordsListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_SMSRECORDS);

    const columns = useSmsRecordsColumns({ callback: getAllData });

    const pageHeader = (
        <CustomPageHeader
            title="smsRecords list"
            extra={[
                <Link key="add-smsRecords" to={ADD_SMSRECORDS_PATH}>
                    <Button key="add-button" type="primary">
                        Add smsRecords
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search smsRecords"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useSmsRecordsFilterItems()}
                    currentPath={SMSRECORDS_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={SMSRECORDS_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default SmsRecordsListView;
