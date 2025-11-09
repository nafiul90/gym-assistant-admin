import React from "react";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import useInvoiceFormItems from "./InvoiceHOC/useFormItems";
import BaseFormComponent from "../../common/BaseFormComponent";
import { CREATE_INVOICE_URL } from "../../../helpers/Constant";

const AddInvoice = () => {
    const pageHeader = <CustomPageHeader title="Add new invoice" />;

    const formItems = useInvoiceFormItems();

    return (
        <PageWrapper pageHeader={pageHeader}>
            <div>
                <BaseFormComponent
                    formItems={formItems}
                    submitUrl={CREATE_INVOICE_URL}
                    data={{ invoiceType: "Income", currency: "BDT" }}
                />
            </div>
        </PageWrapper>
    );
};

export default AddInvoice;
