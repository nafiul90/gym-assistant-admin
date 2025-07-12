import { Button, InputNumber } from "antd";
import React, { useState } from "react";
import api from "../../services/Api";
import { Toast } from "./Toast";
const CommonSingleNumberInput = ({
    submitUrl,
    actionText = "Save",
    getBodyData,
    getAllData,
    defaultValue = null
}) => {
    const [approveLoader, SetApproveLoader] = useState(false);
    const [value, setValue] = useState(defaultValue ?? "");
    const onSubmit = () => {
        const body = getBodyData(value);
        api.updateData(
            {
                url: `${submitUrl}`,
                setLoading: SetApproveLoader,
                body
            },
            (res) => {
                getAllData(false, false, true);
                Toast("success", `Successfully value has updated`, "");
            }
        );
    };

    return (
        <div className="flex items-center gap-2">
            <InputNumber
                defaultValue={defaultValue}
                value={value}
                onChange={(e) => setValue(e)}
            />
            <Button onClick={onSubmit}>{actionText}</Button>
        </div>
    );
};

export default CommonSingleNumberInput;
