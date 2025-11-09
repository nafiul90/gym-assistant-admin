import { GET_ALL_GYM } from "../../../../helpers/Constant";

const useFilterItems = () => {
    const filterItems = [
        {
            label: "Invoice Type",
            name: "invoiceType",
            type: "dropdown",
            options: ["Income", "Expense"],
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Type",
            name: "type",
            type: "dropdown",
            options: [
                "Monthly Fee",
                "RFID Card",
                "SMS",
                "Door setup",
                "Gym Assistant Software",
                "Custom Gym Management Software",
                "Server Bill",
                "Service Charge",
                "Biotime License",
                "Facebook marketing",
                "Aws",
                "Client Visit",
                "Sales Comission",
                "Others",
            ],
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Status",
            name: "status",
            type: "dropdown",
            options: ["Pending", "Completed", "Canceled"],
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Gym",
            name: "gym",
            type: "dropdown",
            getOptionsUrl: GET_ALL_GYM,
            optionFieldName: "gymName",
            optionValueName: "_id",
            className: "col-span-12 md:col-span-4",
        },
        {
            label: "Date from",
            name: "from",
            type: "date",
            placeholder: "Select date",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Date to",
            name: "to",
            type: "date",
            placeholder: "Select date",
            className: "col-span-6 md:col-span-4",
        },
    ];

    return filterItems;
};

export default useFilterItems;
