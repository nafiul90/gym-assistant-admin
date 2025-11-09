import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useBusinessExpenseFormItems from "./BusinessExpenseHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_BUSINESSEXPENSE_URL } from "../../../helpers/Constant";

const AddBusinessExpense = () => {
    const pageHeader = <CustomPageHeader title="Add new businessExpense" />;

    const formItems = useBusinessExpenseFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_BUSINESSEXPENSE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddBusinessExpense;