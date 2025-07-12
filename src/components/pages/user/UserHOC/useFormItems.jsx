import { GET_ALL_GYM } from "../../../../helpers/Constant";

const useFormItems = (editing) => {
    const formItems = [
        {
            label: "Full name",
            autoFocus: true,
            name: "fullName",
            className: "col-span-6",
            rules: [{ required: true, message: "Full name is required" }],
            placeholder: "e.g. Give your Full name here",
        },
        {
            label: "Type",
            name: "type",
            className: "col-span-6",
            placeholder: "e.g. Give your Full name here",
            type: "dropdown",
            options: ["MEMBER", "MANAGER", "STUFF", "GYM_OWNER", "TRAINER"],
        },
        {
            label: "Gender",
            name: "gender",
            className: "col-span-6",
            placeholder: "e.g. MALE",
            type: "dropdown",
            options: ["MALE", "FEMALE", "OTHER"],
        },
        {
            label: "Phone",
            name: "phone",
            className: "col-span-6",
            placeholder: "e.g. Give value here",
        },
        {
            label: "Email",
            name: "email",
            className: "col-span-6",
            placeholder: "e.g. example@upos.com",
        },
        {
            label: "Device pin",
            name: "zkTechoDevicePin",
            className: "col-span-6",
            placeholder: "e.g. 103",
        },

        {
            label: "Access List",
            name: "accessList",
            type: "multiple-form",
            className: "col-span-6",
            items: [
                {
                    label: "Title",
                    name: "title",
                    className: "col-span-6",
                },
                {
                    label: "IP",
                    name: "ip",
                    className: "col-span-6",
                },
                {
                    label: "Port",
                    name: "port",
                    type: "number",
                    className: "col-span-6",
                },
                {
                    label: "Pin",
                    name: "pin",
                    type: "number",
                    className: "col-span-6",
                },
            ],
        },
        {
            label: "Gym list",
            name: "gymList",
            type: "dropdown",
            mode: "multiple",
            getOptionsUrl: GET_ALL_GYM,
            optionFieldName: "gymName",
            optionValueName: "_id",
            className: "col-span-4",
        },
    ];

    if (!editing) {
        formItems.push({
            label: "Password",
            name: "password",
            className: "col-span-6",
            rules: [{ required: true, message: "Password is required" }],
            placeholder: "Enter password",
        });
    }

    return formItems;
};

export default useFormItems;
