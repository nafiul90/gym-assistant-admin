import React from "react";
import { CREATE_STATIC_PAGE_URL } from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useStaticPageFormItems from "./StaticPageHOC/useFormItems";

const AddStaticPage = () => {
    const pageHeader = <CustomPageHeader title="Add New Static Page" />;
    const formItems = useStaticPageFormItems();

    const beforeSubmit = (data) => {
        // if (!data.imageList) {
        //     data.imageList = [];
        // }
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_STATIC_PAGE_URL}
                    beforeSubmit={beforeSubmit}
                    hasDynamicValues={true}
                    dynamicValueName="others"
                />
            </div>
        </PageWrapper>
    );
};

export default AddStaticPage;
