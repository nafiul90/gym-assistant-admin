import { GET_ALL_GYM } from "../../../../helpers/Constant";

const useFilterItems = () => {
    const filterItems = [
        {
            label: "Type",
            name: "type",
            type: "dropdown",
            options: [
                "Payment alert sms",
                "Gym Payment receipt sms",
                "Software Payment receipt sms",
                "Software marketing sms",
                "Gym marketing sms",
                "Software notice sms",
                "Gym notice sms",
                "Gym payment due",
                "Any sms",
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
