import { UPLOAD_IMAGE_URL } from "../../../../helpers/Constant";
const useFormItems = (fileList) => {
    const formItems = [
        {
            label: "Image",
            name: "image",
            className: "col-span-12",
            type: "image",
            limit: 1,
            fileList: fileList ?? [],
            uploadUrl: UPLOAD_IMAGE_URL
        },
        {
            label: "Title",
            name: "title",
            className: "col-span-6"
        },
        {
            label: "Caption",
            name: "caption",
            className: "col-span-6"
        },
        {
            label: "Serial",
            name: "serial",
            type: "number",
            className: "col-span-6"
        },
        {
            label: "Schema",
            name: "schema",
            className: "col-span-12",
            placeholder: "",
            type: "textarea"
        }
    ];

    return formItems;
};

export default useFormItems;