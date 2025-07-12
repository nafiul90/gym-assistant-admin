import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Switch } from "antd";
import React, { useState } from "react";
import api from "../../services/Api";
import { Toast } from "./Toast";
const CommonSingleApproveReject = ({
    value,
    event,
    submitUrl,
    getAllData,
    approveApiData,
    rejectApiData,
    type = "checkbox"
}) => {
    const [approveLoader, SetApproveLoader] = useState(false);
    const onApproveReject = (value) => {
        api.updateData(
            {
                url: `${submitUrl}`,
                setLoading: SetApproveLoader,
                body: value ? approveApiData : rejectApiData
            },
            (res) => {
                getAllData(false, false, true);
                Toast("success", `Successfully value has updated`, "");
            }
        );
    };

    return (
        <div>
            {type === "checkbox" ? (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    // defaultChecked={false}
                    loading={approveLoader}
                    value={value}
                    onChange={(e) => onApproveReject(e)}
                />
            ) : (
                <div className="panel flex justify-between">
                    <p className="text-wrap text-xl font-semibold text-gray-500">
                        {` This item has ${value ? "approved" : "rejected"}. Are you want to ${
                            value ? "reject" : "approve"
                        } this ?`}
                    </p>
                    <div>
                        {value ? (
                            <Button
                                loading={approveLoader}
                                onClick={() =>
                                    onApproveReject(false, rejectApiData)
                                }
                                className="btn btn-danger"
                                text={"btn_reject"}
                            />
                        ) : (
                            <Button
                                loading={approveLoader}
                                onClick={() =>
                                    onApproveReject(true, approveApiData)
                                }
                                text={"btn_approve"}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommonSingleApproveReject;
