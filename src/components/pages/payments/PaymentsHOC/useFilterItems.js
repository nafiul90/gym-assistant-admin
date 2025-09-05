import { GET_ALL_GYM, GET_ALL_USER } from "../../../../helpers/Constant";

const useFilterItems = () => {
    const filterItems = [
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
            label: "User",
            name: "user",
            type: "dropdown",
            getOptionsUrl: GET_ALL_USER,
            optionFieldName: "fullName",
            optionValueName: "_id",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Created by",
            name: "createdBy",
            type: "dropdown",
            getOptionsUrl: GET_ALL_USER,
            optionFieldName: "fullName",
            optionValueName: "_id",
            className: "col-span-6 md:col-span-4",
        },
    ];

    return filterItems;
};

export default useFilterItems;
