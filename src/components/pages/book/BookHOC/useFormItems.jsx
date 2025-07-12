import {
    UPLOAD_FILE_URL,
    UPLOAD_IMAGE_URL
} from "../../../../helpers/Constant";
const useFormItems = (fileList) => {
    const formItems = [
        {
            label: "Thumbnail",
            name: "thumbnail",
            className: "col-span-6",
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
            label: "Short Description",
            name: "shortDescription",
            className: "col-span-6"
        },
        {
            label: "Description",
            name: "description",
            className: "col-span-12",
            type: "richtext"
        },
        {
            label: "Price",
            name: "price",
            type: "number",
            className: "col-span-6"
        },
        {
            label: "Download link",
            name: "downloadLink",
            className: "col-span-6",
            type: "file",
            limit: 1,
            fileList: fileList ?? [],
            uploadUrl: UPLOAD_FILE_URL
        }
    ];

    return formItems;
};

export default useFormItems;
