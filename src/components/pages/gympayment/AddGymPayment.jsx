import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useGymPaymentFormItems from "./GymPaymentHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_GYMPAYMENT_URL } from "../../../helpers/Constant";
import { useParams } from "react-router-dom";

const AddGymPayment = () => {
    const pageHeader = <CustomPageHeader title="Add new gymPayment" />;

    const formItems = useGymPaymentFormItems();
    const { invoice } = useParams();

    const beforeSubmit = (data) => {
        data.invoice = invoice;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_GYMPAYMENT_URL}
                    beforeSubmit={beforeSubmit}
                />
            </div>
        </PageWrapper>
    );
};

export default AddGymPayment;
