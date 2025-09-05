import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import usePartnerFormItems from "./PartnerHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_PARTNER_URL } from "../../../helpers/Constant";

const AddPartner = () => {
    const pageHeader = <CustomPageHeader title="Add new partner" />;

    const formItems = usePartnerFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_PARTNER_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddPartner;