import { UPLOAD_IMAGE_URL } from "../../../../helpers/Constant";
const useFormItems = (fileList) => {
    const formItems = [
        {
            label: "Logo",
            name: "logo",
            className: "col-span-12",
            type: "image",
            limit: 1,
            fileList: fileList ?? [],
            uploadUrl: `${UPLOAD_IMAGE_URL}/partner`,
        },
        {
            label: "Name",
            name: "name",
            className: "col-span-6",
        },
        {
            label: "Address",
            name: "address",
            className: "col-span-6",
        },

        {
            label: "Description",
            name: "description",
            className: "col-span-6",
        },
        {
            label: "Website",
            name: "website",
            className: "col-span-6",
        },
        {
            label: "Facebook",
            name: "facebook",
            className: "col-span-6",
        },
        {
            label: "showInLoginPage",
            name: "showInLoginPage",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "showForOwners",
            name: "showForOwners",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "showForTrainers",
            name: "showForTrainers",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "showForMembers",
            name: "showForMembers",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "Banners",
            name: "banners",
            className: "col-span-12",
            boxClassName: "grid grid-flow-row-dense grid-cols-12 gap-x-3",
            formClassName: "col-span-12 sm:col-span-6",
            type: "multiple-form",
            items: [
                {
                    label: "Title",
                    name: "title",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Subtitle",
                    name: "subtitle",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Link",
                    name: "link",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Image",
                    name: "image",
                    className: "col-span-12 sm:col-span-6",
                    type: "image",
                    fileList: [],
                    uploadUrl: `${UPLOAD_IMAGE_URL}/partner`,
                },
                {
                    label: "Serial",
                    name: "serial",
                    type: "number",
                    className: "col-span-6",
                },
            ],
        },
        {
            label: "Products",
            name: "products",
            className: "col-span-12",
            boxClassName: "grid grid-flow-row-dense grid-cols-12 gap-x-3",
            formClassName: "col-span-12 sm:col-span-6",
            type: "multiple-form",
            items: [
                {
                    label: "Title",
                    name: "title",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Price",
                    name: "price",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Link",
                    name: "link",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Image",
                    name: "image",
                    className: "col-span-12 sm:col-span-6",
                    type: "image",
                    fileList: [],
                    uploadUrl: `${UPLOAD_IMAGE_URL}/partner`,
                },
                {
                    label: "Serial",
                    name: "serial",
                    type: "number",
                    className: "col-span-6",
                },
            ],
        },
        {
            label: "Serial",
            name: "serial",
            type: "number",
            className: "col-span-6",
        },
    ];

    return formItems;
};

export default useFormItems;
