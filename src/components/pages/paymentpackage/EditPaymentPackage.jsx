import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import usePaymentPackageFormItems from "./PaymentPackageHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_PAYMENTPACKAGE_BY_ID, UPDATE_PAYMENTPACKAGE_URL} from "../../../helpers/Constant";

const EditPaymentPackage = () => {
    const pageHeader = <CustomPageHeader title="Edit PaymentPackage" />;
    const formItems = usePaymentPackageFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_PAYMENTPACKAGE_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_PAYMENTPACKAGE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditPaymentPackage;