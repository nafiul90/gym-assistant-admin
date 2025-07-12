import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useBookOrderFormItems from "./BookOrderHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_BOOKORDER_URL } from "../../../helpers/Constant";

const AddBookOrder = () => {
    const pageHeader = <CustomPageHeader title="Add new BookOrder" />;

    const formItems = useBookOrderFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_BOOKORDER_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddBookOrder;