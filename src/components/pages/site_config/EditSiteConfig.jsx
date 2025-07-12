import React from "react";
import {
    GET_SITE_CONFIG_BY_ID,
    UPDATE_SITE_CONFIG_URL
} from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useSiteConfigFormItems from "./SiteConfigHOC/useFormItems";

const EditSiteConfig = () => {
    const pageHeader = <CustomPageHeader title="Edit the Site Config" />;
    const formItems = useSiteConfigFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_SITE_CONFIG_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_SITE_CONFIG_URL}
                    hasDynamicValues={true}
                    dynamicValueName="others"
                />
            </div>
        </PageWrapper>
    );
};

export default EditSiteConfig;
