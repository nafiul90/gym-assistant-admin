import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import usePartnerFormItems from "./PartnerHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_PARTNER_BY_ID, UPDATE_PARTNER_URL} from "../../../helpers/Constant";

const EditPartner = () => {
    const pageHeader = <CustomPageHeader title="Edit partner" />;
    const formItems = usePartnerFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_PARTNER_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_PARTNER_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditPartner;