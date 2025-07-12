import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useInvoiceFormItems from "./InvoiceHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import {
    GET_INVOICE_BY_ID,
    UPDATE_INVOICE_URL,
} from "../../../helpers/Constant";
import dayjs from "dayjs";

const EditInvoice = () => {
    const pageHeader = <CustomPageHeader title="Edit invoice" />;
    const formItems = useInvoiceFormItems(true);

    const modifyInitialData = (data) => {
        data.date = dayjs(data.date);
        return data;
    };

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    initialDataUrl={GET_INVOICE_BY_ID}
                    modifyInitialData={modifyInitialData}
                    submitUrl={UPDATE_INVOICE_URL}
                />
            </div>
        </PageWrapper>
    );
};

export default EditInvoice;
