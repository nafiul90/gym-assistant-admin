const useFilterItems = () => {
    const filterItems = [
        {
            label: "Gym name",
            name: "gymName",
            placeholder: "e.g. Abdur Rahim",
            className: "col-span-12 md:col-span-6 lg:col-span-4",
        },
        {
            label: "Auto Entry Disable",
            name: "autoEntryDisable",
            type: "switch",
            className: "col-span-6 md:col-span-6 lg:col-span-4",
        },
        {
            label: "Python Gateway",
            name: "pyzk",
            type: "switch",
            className: "col-span-6 md:col-span-6 lg:col-span-3",
        },
        {
            label: "Data encryption",
            name: "encryptionEnabled",
            className: "col-span-6 md:col-span-6 lg:col-span-3",
            type: "switch",
        },
    ];

    return filterItems;
};

export default useFilterItems;
