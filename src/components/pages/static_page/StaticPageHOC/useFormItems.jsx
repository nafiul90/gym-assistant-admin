import { UPLOAD_STATIC_PAGE_IMAGE_URL } from "../../../../helpers/Constant";

const useFormItems = (file) => {
    const formItems = [
        {
            label: "Page Image",
            name: "pageImage",
            className: "col-span-2",
            type: "image",
            limit: 1,
            fileList: file ?? [],
            uploadUrl: UPLOAD_STATIC_PAGE_IMAGE_URL
        },
        {
            label: "Page name",
            name: "pageName",
            className: "col-span-5",
            autoFocus: true
        },
        {
            label: "Slug",
            name: "slug",
            className: "col-span-5",
            rules: [{ required: true, message: "This field is required" }]
        },
        {
            label: "Title",
            name: "title",
            className: "col-span-4"
        },
        {
            label: "Caption",
            name: "caption",
            className: "col-span-3"
        },
        {
            label: "Description",
            name: "description",
            className: "col-span-5"
        },
        {
            label: "Content",
            name: "content",
            className: "col-span-12",
            type: "richtext"
        },
        {
            label: "Meta title",
            name: "metaTitle",
            className: "col-span-4"
        },
        {
            label: "Meta description",
            name: "metaDescription",
            className: "col-span-4"
        },
        {
            label: "OG Image",
            name: "ogImage",
            className: "col-span-2",
            type: "image",
            limit: 1,
            fileList: file ?? [],
            uploadUrl: UPLOAD_STATIC_PAGE_IMAGE_URL
        },
        {
            label: "TwitterCard",
            name: "twitterCard",
            className: "col-span-2",
            type: "image",
            limit: 1,
            fileList: file ?? [],
            uploadUrl: UPLOAD_STATIC_PAGE_IMAGE_URL
        },
        {
            label: "Schema",
            name: "schema",
            className: "col-span-12",
            type: "textarea"
        },
        {
            label: "Serial",
            name: "serial",
            type: "number",
            className: "col-span-6"
        }
    ];

    return formItems;
};

export default useFormItems;
