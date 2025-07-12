import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useGymPaymentFormItems from "./GymPaymentHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {
    GET_GYMPAYMENT_BY_ID,
    UPDATE_GYMPAYMENT_URL,
} from "../../../helpers/Constant";
import dayjs from "dayjs";

const EditGymPayment = () => {
    const pageHeader = <CustomPageHeader title="Edit gymPayment" />;
    const formItems = useGymPaymentFormItems();

    const modifyInitialData = (data) => {
        data.date = dayjs(data.date);
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_GYMPAYMENT_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_GYMPAYMENT_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditGymPayment;
