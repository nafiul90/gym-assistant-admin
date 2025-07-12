const useFormItems = (data) => {
    const formItems = [
        {
            label: "Full name",
            name: "fullName",
            className: "col-span-12",
            placeholder: "e.g. Abdur Rahim"
        },
        {
            label: "Email",
            name: "email",
            className: "col-span-12",
            placeholder: "e.g example@upos.com"
        },
        {
            label: "Address",
            name: "address",
            className: "col-span-12",
            placeholder: "e.g. Dhaka"
        },
        {
            label: "Gender",
            name: "gender",
            className: "col-span-12",
            type: "dropdown",
            options: ["MALE", "FEMALE"]
        }
    ];

    return formItems;
};

export default useFormItems;
