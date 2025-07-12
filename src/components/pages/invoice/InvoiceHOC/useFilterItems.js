import { GET_ALL_GYM } from "../../../../helpers/Constant";

const useFilterItems = () => {
    const filterItems = [
        {
            label: "Type",
            name: "type",
            type: "dropdown",
            options: [
                "Monthly Fee",
                "RFID Card",
                "Service Charge",
                "Gym Assistant Software",
                "Custom Gym Management Software",
                "Door Setup",
            ],
            className: "col-span-6",
        },
        {
            label: "Gym",
            name: "gym",
            type: "dropdown",
            getOptionsUrl: GET_ALL_GYM,
            optionFieldName: "gymName",
            optionValueName: "_id",
            className: "col-span-6",
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
