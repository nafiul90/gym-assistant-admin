import { GET_ALL_GYM } from "../../../../helpers/Constant";

const useFilterItems = () => {
const filterItems = [
    {
        label: "Title",
        name: "title",
        placeholder: "e.g. Give value here",
        className: "col-span-6 md:col-span-4"
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
];

    return filterItems;
};

export default useFilterItems;