const useFilterItems = () => {
    const filterItems = [
        {
            label: "Page name",
            name: "pageName",
            className: "col-span-12 lg:col-span-4"
        },
        {
            label: "Slug",
            name: "slug",
            className: "col-span-12 lg:col-span-4"
        }
    ];

    return filterItems;
};

export default useFilterItems;
