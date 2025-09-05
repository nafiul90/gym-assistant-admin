import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import usePaymentsFormItems from "./PaymentsHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_PAYMENTS_URL } from "../../../helpers/Constant";

const AddPayments = () => {
    const pageHeader = <CustomPageHeader title="Add new payments" />;

    const formItems = usePaymentsFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_PAYMENTS_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddPayments;