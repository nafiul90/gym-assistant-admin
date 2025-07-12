import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useDeviceFormItems from "./DeviceHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_DEVICE_URL } from "../../../helpers/Constant";

const AddDevice = () => {
    const pageHeader = <CustomPageHeader title="Add new device" />;

    const formItems = useDeviceFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_DEVICE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddDevice;