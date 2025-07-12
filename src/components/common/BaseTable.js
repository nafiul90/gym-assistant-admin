import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    bindUrlWithParams,
    getAllQueryParams,
    useQuery
} from "../../helpers/Utils";

const BaseTable = ({
    columns,
    dataSource,
    loading,
    totalElements,
    className,
    scroll
}) => {
    const query = useQuery();
    const navigate = useNavigate();
    const currentPath = useLocation()?.pathname;

    const [pagination, setPagination] = useState({
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "30", "50", "100"]
    });

    useEffect(() => {
        const page = parseInt(query.get("page")) || 1;
        const size = parseInt(query.get("size")) || 10;
        setPagination({
            ...pagination,
            current: page,
            pageSize: size,
            total: totalElements
        });
    }, [totalElements]);

    const onChangeTable = (_pagination) => {
        setPagination(_pagination);

        currentPath &&
            navigate(
                bindUrlWithParams(currentPath, {
                    ...getAllQueryParams(query),
                    page: _pagination.current,
                    size: _pagination.pageSize
                })
            );
    };

    return (
        <div className={className}>
            <Table
                columns={columns}
                onChange={onChangeTable}
                dataSource={dataSource}
                pagination={pagination}
                loading={loading}
                scroll={
                    scroll ?? {
                        x: 1000,
                        y: 400
                    }
                }
                rowKey={(record) => record._id}
            />
        </div>
    );
};

export default BaseTable;
