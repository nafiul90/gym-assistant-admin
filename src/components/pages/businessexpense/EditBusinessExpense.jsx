import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useBusinessExpenseFormItems from "./BusinessExpenseHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_BUSINESSEXPENSE_BY_ID, UPDATE_BUSINESSEXPENSE_URL} from "../../../helpers/Constant";

const EditBusinessExpense = () => {
    const pageHeader = <CustomPageHeader title="Edit businessExpense" />;
    const formItems = useBusinessExpenseFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_BUSINESSEXPENSE_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_BUSINESSEXPENSE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditBusinessExpense;