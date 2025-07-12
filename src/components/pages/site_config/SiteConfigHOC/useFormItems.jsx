import { UPLOAD_SITE_CONFIG_LOGO_URL } from "../../../../helpers/Constant";

const useFormItems = (file) => {
    const formItems = [
        {
            label: "Site title",
            name: "siteTitle",
            className: "col-span-4",
            autoFocus: true
        },
        {
            label: "Site Version",
            name: "siteVersion",
            className: "col-span-4"
        },
        {
            label: "Logo",
            name: "logo",
            className: "col-span-1",
            type: "image",
            limit: 1,
            fileList: file ?? [],
            uploadUrl: UPLOAD_SITE_CONFIG_LOGO_URL
        },
        {
            label: "Favicon",
            name: "favicon",
            className: "col-span-1",
            type: "image",
            limit: 1,
            fileList: file ?? [],
            uploadUrl: UPLOAD_SITE_CONFIG_LOGO_URL
        },
        {
            label: "Login Page Image",
            name: "loginPageImage",
            className: "col-span-2",
            type: "image",
            limit: 1,
            fileList: file ?? [],
            uploadUrl: UPLOAD_SITE_CONFIG_LOGO_URL
        },
        {
            label: "Description",
            name: "description",
            className: "col-span-12",
            type: "richtext"
        },
        {
            label: "Phone number",
            name: "phoneNo",
            className: "col-span-4"
        },
        {
            label: "Email",
            name: "email",
            className: "col-span-4"
        },
        {
            label: "Address",
            name: "address",
            className: "col-span-4"
        },
        {
            label: "Facebook Link",
            name: "facebookLink",
            className: "col-span-3"
        },
        {
            label: "Messenger Link",
            name: "messengerLink",
            className: "col-span-3"
        },
        {
            label: "Whatsapp Link",
            name: "whatsappLink",
            className: "col-span-3"
        },
        {
            label: "Telegram Link",
            name: "telegramLink",
            className: "col-span-3"
        },
        {
            label: "Instagram Link",
            name: "instagramLink",
            className: "col-span-3"
        },
        {
            label: "Pinterest Link",
            name: "pinterestLink",
            className: "col-span-3"
        },
        {
            label: "Youtube Link",
            name: "youtubeLink",
            className: "col-span-3"
        },
        {
            label: "X Link",
            name: "xLink",
            className: "col-span-3"
        },
        {
            label: "Linkedin Link",
            name: "linkedinLink",
            className: "col-span-3"
        },
    ];

    return formItems;
};

export default useFormItems;
