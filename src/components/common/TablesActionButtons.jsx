import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/Api";

const TableActionButtons = ({
    data,
    moduleName,
    deleteUrl,
    callback,
    showView = false,
    showEdit = true,
    showDelete = true,
}) => {
    const [loading, setLoading] = useState(false);

    const onDelete = () => {
        api.deleteData({ setLoading, url: `${deleteUrl}/${data._id}` }, (_) => {
            callback && callback();
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {showView && (
                <Link to={`/${moduleName}-details/${data?._id}`}>
                    <Button size="small">
                        <EyeOutlined />
                    </Button>
                </Link>
            )}

            {showEdit && (
                <Link to={`/edit-${moduleName}/${data?._id}`}>
                    <Button size="small">
                        <EditOutlined />
                    </Button>
                </Link>
            )}
            {showDelete && (
                <div>
                    <Popconfirm
                        title={`Delete this ${moduleName} ?`}
                        description="Are you sure to delete this ?"
                        onConfirm={onDelete}
                        okText="Yes"
                        cancelText="No"
                        placement="topLeft"
                    >
                        <Button loading={loading} danger size="small">
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </div>
            )}
        </div>
    );
};

export default TableActionButtons;
