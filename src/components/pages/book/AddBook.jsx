import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useBookFormItems from "./BookHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_BOOK_URL } from "../../../helpers/Constant";

const AddBook = () => {
    const pageHeader = <CustomPageHeader title="Add new Book" />;

    const formItems = useBookFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_BOOK_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default AddBook;