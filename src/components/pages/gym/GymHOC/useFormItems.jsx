import { UPLOAD_IMAGE_URL } from "../../../../helpers/Constant";
const useFormItems = (fileList) => {
    const formItems = [
        {
            label: "Gym Name",
            name: "gymName",
            className: "col-span-6",
        },
        {
            label: "Subscription Fee",
            name: "subscriptionFee",
            type: "number",
            className: "col-span-6",
        },
        {
            label: "Due date",
            name: "dueDate",
            type: "number",
            className: "col-span-6",
        },
        {
            label: "Expire Date",
            name: "expireDate",
            type: "number",
            className: "col-span-6",
        },
        {
            label: "Device ip",
            name: "deviceIp",
            className: "col-span-6",
        },
        {
            label: "Device port",
            name: "devicePort",
            className: "col-span-6",
        },
        {
            label: "Sms credit",
            name: "smsCredit",
            className: "col-span-6",
            type: "number",
        },
        {
            label: "Primary User Search",
            name: "primaryUserSearch",
            className: "col-span-6",
            type: "dropdown",
            options: ["User Id", "Name And Phone"],
        },
        {
            label: "Payment invoice type",
            name: "paymentInvoiceType",
            className: "col-span-6",
            type: "dropdown",
            options: ["A4", "roll80"],
        },
        {
            label: "Python Library",
            name: "pyzk",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "BioTime",
            name: "bioTime",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "BioTime server",
            name: "bioTimeServer",
            className: "col-span-6",
        },
        {
            label: "BioTime token",
            name: "bioTimeToken",
            className: "col-span-6",
        },
        {
            label: "Gym Id",
            name: "gymId",
            className: "col-span-6",
            type: "number",
        },
        {
            label: "Auto Entry Disable",
            name: "autoEntryDisable",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "Data encryption",
            name: "encryptionEnabled",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "Export Member Data",
            name: "memberExport",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "All device entry",
            name: "allDeviceEntry",
            className: "col-span-6",
            type: "switch",
        },
        {
            label: "Device list",
            name: "deviceList",
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
                    label: "Ip",
                    name: "ip",
                    className: "col-span-12 sm:col-span-6",
                },
                {
                    label: "Port",
                    name: "port",
                    className: "col-span-12 sm:col-span-6",
                    type: "number",
                },
                {
                    label: "Female Only",
                    name: "femaleOnly",
                    className: "col-span-12 sm:col-span-6",
                    type: "switch",
                },
            ],
        },
        {
            label: "Area list",
            name: "areaList",
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
                    label: "Id",
                    name: "id",
                    className: "col-span-12 sm:col-span-6",
                    type: "number",
                },
                {
                    label: "Gender",
                    name: "gender",
                    className: "col-span-12 sm:col-span-6",
                    type: "dropdown",
                    options: ["MALE", "FEMALE", "BOTH"],
                },
            ],
        },
        {
            label: "Pre reminder",
            name: "paymentExpiredPreReminder",
            className: "col-span-12",
            boxClassName: "grid grid-flow-row-dense grid-cols-12 gap-x-3",
            formClassName: "col-span-12 sm:col-span-6",
            type: "multiple-form",
            items: [
                {
                    label: "Day Before",
                    name: "dayBefore",
                    className: "col-span-12 sm:col-span-6",
                },
            ],
        },
        {
            label: "Post reminder",
            name: "paymentExpiredPostReminder",
            className: "col-span-12",
            boxClassName: "grid grid-flow-row-dense grid-cols-12 gap-x-3",
            formClassName: "col-span-12 sm:col-span-6",
            type: "multiple-form",
            items: [
                {
                    label: "Day After",
                    name: "dayAfter",
                    className: "col-span-12 sm:col-span-6",
                },
            ],
        },
        {
            label: "Invoice number restart",
            name: "newInvoiceNumberStartingDate",
            className: "col-span-6",
            type: "date",
            format: "DD MMMM YYYY hh:mm A",
            showTime: { use12Hours: true },
        },
        {
            label: "Invoice number is required",
            name: "invoiceNumberIsRequired",
            className: "col-span-6",
            type: "switch",
        },
    ];

    return formItems;
};

export default useFormItems;
