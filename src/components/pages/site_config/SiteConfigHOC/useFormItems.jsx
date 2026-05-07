const useFormItems = (file) => {
    const formItems = [
        {
            label: "Routine generation prompt",
            name: "routineGenerationPrompt",
            className: "col-span-12",
            type: "textarea",
        },
        {
            label: "Required OTP for new device",
            name: "requiredOtpForNewDevice",
            className: "col-span-12",
            type: "switch",
        },
    ];

    return formItems;
};

export default useFormItems;
