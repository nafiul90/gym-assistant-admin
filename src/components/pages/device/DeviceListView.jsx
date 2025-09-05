import React, { useEffect, useState } from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import { Button } from "antd";
import useDeviceColumns from "./DeviceHOC/useColumns";
import BaseTable from "../../common/BaseTable";
import BaseFilterComponent from "../../common/BaseFilterComponent";
import useDeviceFilterItems from "./DeviceHOC/useFilterItems";
import { ADD_DEVICE_PATH, DEVICE_LIST_PATH } from "../../../routes/Slugs";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_DEVICE_USERS } from "../../../helpers/Constant";
import { Link, useParams } from "react-router-dom";
import { ScrollConfig, useQuery } from "../../../helpers/Utils";

const DeviceListView = () => {
    const { gym } = useParams();
    // const { ip, port } = useQuery();
    const { dataList, loadingList, totalElements } = useGetAllData(
        `${GET_ALL_DEVICE_USERS}/${gym}`
    );

    const [data, setData] = useState([]);
    useEffect(() => {
        setData(dataList);
    }, [dataList]);
    const columns = useDeviceColumns();
    const getData = (filterData) => {
        setData(
            dataList.filter(
                (e) =>
                    (filterData.pin ? e.PIN2 === filterData.pin : true) &&
                    (filterData.card ? e.Card == filterData.card : true) &&
                    (filterData.name
                        ? typeof e.Name === "string" &&
                          e.Name?.toUpperCase().includes(
                              filterData.name.toUpperCase()
                          )
                        : true)
            )
        );
    };

    const pageHeader = (
        <CustomPageHeader
            title="device list"
            extra={[
                <Link key="add-device" to={ADD_DEVICE_PATH}>
                    <Button key="add-button" type="primary">
                        Add device
                    </Button>
                </Link>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFilterComponent
                    title="Search device"
                    itemCount={data.length}
                    searchAction={getData}
                    filterItems={useDeviceFilterItems()}
                    currentPath={DEVICE_LIST_PATH}
                    hideUrl={true}
                />

                <BaseTable
                    columns={columns}
                    dataSource={data}
                    loading={false}
                    totalElements={totalElements}
                    currentPath={DEVICE_LIST_PATH}
                    scroll={ScrollConfig()}
                />
            </div>
        </PageWrapper>
    );
};

export default DeviceListView;
