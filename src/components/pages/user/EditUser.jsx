import React from "react";
import { GET_USER_BY_ID, UPDATE_USER_URL } from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useUserFormItems from "./UserHOC/useFormItems";

const EditUser = () => {
    const pageHeader = <CustomPageHeader title="Edit User" />;
    const formItems = useUserFormItems(true);

    const modifyInitialData = (data) => {
        if (data.accessList?.length === 0) {
            delete data.accessList;
        } else {
            data.accessList = data.accessList.map((e) => ({
                ...e,
                pin: parseInt(e.pin),
            }));
        }
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_USER_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_USER_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditUser;
