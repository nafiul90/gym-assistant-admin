const useFilterItems = () => {
const filterItems = [
    {
        label: "Caption",
        name: "caption",
        placeholder: "e.g. Abdur Rahim",
        className: "col-span-6 md:col-span-4"
    },
    {
        label: "Title",
        name: "title",
        placeholder: "e.g. Give value here",
        className: "col-span-6 md:col-span-4"
    },
    {
        label: "Description",
        name: "description",
        placeholder: "e.g. Give value here",
        className: "col-span-6 md:col-span-4"
    }
];

    return filterItems;
};

export default useFilterItems;