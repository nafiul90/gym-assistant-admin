import React from "react";
import { CREATE_SITE_CONFIG_URL } from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useSiteConfigFormItems from "./SiteConfigHOC/useFormItems";

const AddSiteConfig = () => {
    const pageHeader = <CustomPageHeader title="Add New Site Config" />;
    const formItems = useSiteConfigFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_SITE_CONFIG_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddSiteConfig;
