import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useBookOrderFormItems from "./BookOrderHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {GET_BOOKORDER_BY_ID, UPDATE_BOOKORDER_URL} from "../../../helpers/Constant";

const EditBookOrder = () => {
    const pageHeader = <CustomPageHeader title="Edit BookOrder" />;
    const formItems = useBookOrderFormItems();

    const modifyInitialData = (data) => {
        data.role = data.role?.alias;
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_BOOKORDER_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_BOOKORDER_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditBookOrder;