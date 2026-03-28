const useFormItems = (file) => {
    const formItems = [
        {
            label: "Routine generation prompt",
            name: "routineGenerationPrompt",
            className: "col-span-12",
            type: "textarea",
        },
    ];

    return formItems;
};

export default useFormItems;
