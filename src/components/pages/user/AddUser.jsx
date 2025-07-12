import React from "react";
import { CREATE_USER_URL } from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useUserFormItems from "./UserHOC/useFormItems";

const AddUser = () => {
    const pageHeader = <CustomPageHeader title="Add New User" />;

    const formItems = useUserFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_USER_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddUser;
