import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useBookFormItems from "./BookHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_BOOK_BY_ID, UPDATE_BOOK_URL} from "../../../helpers/Constant";

const EditBook = () => {
    const pageHeader = <CustomPageHeader title="Edit Book" />;
    const formItems = useBookFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_BOOK_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_BOOK_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditBook;