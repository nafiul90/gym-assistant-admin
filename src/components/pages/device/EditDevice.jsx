import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useDeviceFormItems from "./DeviceHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_DEVICE_BY_ID, UPDATE_DEVICE_URL} from "../../../helpers/Constant";

const EditDevice = () => {
    const pageHeader = <CustomPageHeader title="Edit device" />;
    const formItems = useDeviceFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_DEVICE_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_DEVICE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditDevice;