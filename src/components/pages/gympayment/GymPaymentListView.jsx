import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useGymPaymentColumns from "./GymPaymentHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useGymPaymentFilterItems from "./GymPaymentHOC/useFilterItems";
import {
    ADD_GYMPAYMENT_PATH,
    GYMPAYMENT_LIST_PATH,
} from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_GYMPAYMENT } from "../../../helpers/Constant";
import { Link } from "react-router-dom";
import { ScrollConfig } from "../../../helpers/Utils";

const GymPaymentListView = () => {
    const { dataList, loadingList, totalElements, getAllData } =
        useGetAllData(GET_ALL_GYMPAYMENT);

    const columns = useGymPaymentColumns({ callback: getAllData });

    const pageHeader = <CustomPageHeader title="Payment History" />;

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search Payment"
                    itemCount={totalElements}
                    searchAction={getAllData}
                    filterItems={useGymPaymentFilterItems()}
                    currentPath={GYMPAYMENT_LIST_PATH}
                />

                <BaseTable
                    columns={columns}
                    dataSource={dataList}
                    loading={loadingList}
                    totalElements={totalElements}
                    currentPath={GYMPAYMENT_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default GymPaymentListView;
