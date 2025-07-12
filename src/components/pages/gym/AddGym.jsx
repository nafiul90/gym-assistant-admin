import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useGymFormItems from "./GymHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_GYM_URL } from "../../../helpers/Constant";

const AddGym = () => {
    const pageHeader = <CustomPageHeader title="Add new gym" />;

    const formItems = useGymFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_GYM_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddGym;