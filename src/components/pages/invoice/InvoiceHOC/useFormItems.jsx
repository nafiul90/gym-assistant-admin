import { GET_ALL_GYM, UPLOAD_IMAGE_URL } from "../../../../helpers/Constant";
const useFormItems = (edit) => {
    const formItems = [
        {
            label: "Date",
            name: "date",
            type: "date",
            className: "col-span-12 sm:col-span-4",
        },
        {
            label: "Gym",
            name: "gym",
            type: "dropdown",
            getOptionsUrl: GET_ALL_GYM,
            optionFieldName: "gymName",
            optionValueName: "_id",
            className: "col-span-12 sm:col-span-4",
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
                "Biotime License",
            ],
            className: "col-span-12 sm:col-span-4",
        },
        {
            label: "Currency",
            name: "currency",
            type: "dropdown",
            options: ["BDT", "USD"],
            className: "col-span-12 sm:col-span-6",
        },
        {
            label: "Paid amount",
            name: "totalPaid",
            className: "col-span-12 sm:col-span-6",
            type: "number",
        },
        {
            label: "Discount",
            name: "discount",
            className: "col-span-12 sm:col-span-6",
            type: "number",
        },
        {
            label: "Note",
            name: "note",
            className: "col-span-12 sm:col-span-6",
            type: "textarea",
        },
        {
            label: "Items",
            name: "items",
            className: "col-span-12",
            boxClassName: "grid grid-flow-row-dense grid-cols-12 gap-x-3",
            formClassName: "col-span-12 sm:col-span-6",
            type: "multiple-form",
            items: [
                {
                    label: "Title",
                    name: "title",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Note",
                    name: "note",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Unit Price",
                    name: "unitPrice",
                    className: "col-span-12 sm:col-span-4",
                    type: "number",
                },
                {
                    label: "Unit Type",
                    name: "unitType",
                    className: "col-span-12 sm:col-span-4",
                    type: "dropdown",
                    options: ["Gym", "Pcs", "M", "Kg", "L", "Unit"],
                },
                {
                    label: "Quantity",
                    name: "quantity",
                    className: "col-span-12 sm:col-span-4",
                    type: "number",
                },
            ],
        },
    ];

    return formItems;
};

export default useFormItems;
