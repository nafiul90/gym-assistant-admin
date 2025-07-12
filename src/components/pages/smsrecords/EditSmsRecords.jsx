import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useSmsRecordsFormItems from "./SmsRecordsHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_SMSRECORDS_BY_ID, UPDATE_SMSRECORDS_URL} from "../../../helpers/Constant";

const EditSmsRecords = () => {
    const pageHeader = <CustomPageHeader title="Edit smsRecords" />;
    const formItems = useSmsRecordsFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_SMSRECORDS_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_SMSRECORDS_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditSmsRecords;