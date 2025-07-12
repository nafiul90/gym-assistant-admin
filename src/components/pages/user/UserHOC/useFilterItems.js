import { GET_ALL_GYM } from "../../../../helpers/Constant";

const useFilterItems = () => {
    const filterItems = [
        {
            label: "Name",
            name: "fullName",
            placeholder: "e.g. Abdur Rahim",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Phone",
            name: "phone",
            placeholder: "e.g. Give value here",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Gym",
            name: "gym",
            type: "dropdown",
            getOptionsUrl: GET_ALL_GYM,
            optionFieldName: "gymName",
            optionValueName: "_id",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Type",
            name: "type",
            type: "dropdown",
            options: [
                "SUPER_ADMIN",
                "ADMIN",
                "STUFF",
                "MANAGER",
                "MEMBER",
                "GYM_OWNER",
                "TRAINER",
            ],
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Gender",
            name: "gender",
            type: "dropdown",
            options: ["MALE", "FEMALE", "OTHERS"],
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Payment Status",
            name: "paymentStatus",
            type: "dropdown",
            options: [
                "In package and full paid",
                "In package with due",
                "Package expired",
                "Package expired with dues",
            ],
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Device pin",
            name: "zkTechoDevicePin",
            type: "number",
            placeholder: "",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Active entry",
            name: "activeEntry",
            type: "switch",
            placeholder: "",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Email",
            name: "email",
            placeholder: "nafiul@gmail.com",
            className: "col-span-6 md:col-span-4",
        },
    ];

    return filterItems;
};

export default useFilterItems;
