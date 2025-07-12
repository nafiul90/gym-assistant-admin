import {
    GET_ALL_GYM,
    GET_ALL_INVOICE,
    UPLOAD_IMAGE_URL,
} from "../../../../helpers/Constant";
const useFormItems = (fileList) => {
    const formItems = [
        // {
        //     label: "Invoice",
        //     name: "invoice",
        //     type: "dropdown",
        //     getOptionsUrl: GET_ALL_INVOICE,
        //     optionFieldName: "invoiceId",
        //     optionValueName: "_id",
        //     className: "col-span-6",
        // },
        {
            label: "Date",
            name: "date",
            type: "date",
            className: "col-span-6",
        },
        {
            label: "Type",
            name: "type",
            type: "dropdown",
            options: [
                "Monthly Fee",
                "SMS",
                "RFID Card",
                "Service Charge",
                "Gym Assistant Software",
                "Custom Gym Management Software",
                "Door Setup",
            ],
            className: "col-span-6",
        },
        {
            label: "Paid amount",
            name: "paidAmount",
            className: "col-span-6",
            type: "number",
        },
        {
            label: "Note",
            name: "note",
            className: "col-span-6",
        },
    ];

    return formItems;
};

export default useFormItems;
