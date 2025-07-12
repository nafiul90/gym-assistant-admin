import React from "react";
import {
    GET_STATIC_PAGE_BY_ID,
    UPDATE_STATIC_PAGE_URL
} from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useStaticPageFormItems from "./StaticPageHOC/useFormItems";

const EditStaticPage = () => {
    const pageHeader = <CustomPageHeader title="Edit the Static Page" />;
    const formItems = useStaticPageFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    const beforeSubmit = (data) => {
        if (!data.imageList) {
            data.imageList = [];
        }
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_STATIC_PAGE_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_STATIC_PAGE_URL}
                    beforeSubmit={beforeSubmit}
                    hasDynamicValues={true}
                    dynamicValueName="others"
                />
            </div>
        </PageWrapper>
    );
};

export default EditStaticPage;
