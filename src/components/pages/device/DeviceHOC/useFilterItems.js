const useFilterItems = () => {
    const filterItems = [
        {
            label: "Pin",
            name: "pin",
            placeholder: "e.g. 103",
            className: "col-span-6 md:col-span-4",
        },
        {
            label: "Name",
            name: "name",
            placeholder: "e.g. Abul Kalam Azad",
            className: "col-span-6 md:col-span-4",
        },
    ];

    return filterItems;
};

export default useFilterItems;
