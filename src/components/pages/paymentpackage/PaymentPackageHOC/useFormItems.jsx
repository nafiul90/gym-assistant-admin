import { UPLOAD_IMAGE_URL } from "../../../../helpers/Constant";
const useFormItems = (fileList) => {
    const formItems = [
        {
            label: "Title",
            name: "title",
            className: "col-span-6",
        },
        {
            label: "Anytime",
            name: "anytime",
            className: "col-span-6",
            type: "switch",
        },
    ];

    return formItems;
};

export default useFormItems;
