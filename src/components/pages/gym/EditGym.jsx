import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useGymFormItems from "./GymHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { GET_GYM_BY_ID, UPDATE_GYM_URL } from "../../../helpers/Constant";
import dayjs from "dayjs";

const EditGym = () => {
    const pageHeader = <CustomPageHeader title="Edit gym" />;
    const formItems = useGymFormItems();

    const modifyInitialData = (data) => {
        data.newInvoiceNumberStartingDate = dayjs(
            data.newInvoiceNumberStartingDate
        );
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_GYM_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_GYM_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditGym;
