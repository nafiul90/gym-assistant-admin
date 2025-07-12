import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useSmsRecordsFormItems from "./SmsRecordsHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_SMSRECORDS_URL } from "../../../helpers/Constant";

const AddSmsRecords = () => {
    const pageHeader = <CustomPageHeader title="Add new smsRecords" />;

    const formItems = useSmsRecordsFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_SMSRECORDS_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddSmsRecords;