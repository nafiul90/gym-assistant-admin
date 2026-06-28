import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import usePaymentPackageFormItems from "./PaymentPackageHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_PAYMENTPACKAGE_URL } from "../../../helpers/Constant";

const AddPaymentPackage = () => {
    const pageHeader = <CustomPageHeader title="Add new PaymentPackage" />;

    const formItems = usePaymentPackageFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_PAYMENTPACKAGE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddPaymentPackage;