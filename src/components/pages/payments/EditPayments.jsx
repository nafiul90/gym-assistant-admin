import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import usePaymentsFormItems from "./PaymentsHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_PAYMENTS_BY_ID, UPDATE_PAYMENTS_URL} from "../../../helpers/Constant";

const EditPayments = () => {
    const pageHeader = <CustomPageHeader title="Edit payments" />;
    const formItems = usePaymentsFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_PAYMENTS_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_PAYMENTS_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditPayments;