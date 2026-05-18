import React, { useState } from "react";
import { Button, DatePicker, Input, Popconfirm, Select, Space, Tag, Tooltip, message } from "antd";
import { DeleteOutlined, PhoneOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PageWrapper, { CustomPageHeader } from "../../common/PageWrapper";
import BaseTable from "../../common/BaseTable";
import { useGetAllData } from "../../common/useGetAllData";
import {
    DELETE_GYMLEAD_URL,
    GET_ALL_GYMLEAD,
    GYMLEAD_STATUSES,
    GYMLEAD_STATUS_COLORS,
    UPDATE_GYMLEAD_URL,
} from "../../../helpers/Constant";
import api from "../../../services/Api";
import { GYMLEAD_LIST_PATH } from "../../../routes/Slugs";
import { ScrollConfig } from "../../../helpers/Utils";

const { TextArea } = Input;

const STATUS_OPTIONS = GYMLEAD_STATUSES.map((s) => ({
    label: s.charAt(0) + s.slice(1).toLowerCase(),
    value: s,
}));

const GymLeadListView = () => {
    const { dataList, loadingList, totalElements, getAllData, summary } =
        useGetAllData(GET_ALL_GYMLEAD);

    const [statusFilter, setStatusFilter] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    const applyFilters = () => {
        getAllData({
            page: 1,
            size: 10,
            status: statusFilter || undefined,
            search: searchTerm || undefined,
        });
    };

    const resetFilters = () => {
        setStatusFilter(undefined);
        setSearchTerm("");
        getAllData({ page: 1, size: 10 });
    };

    const handleUpdate = (row, payload) => {
        api.updateData(
            { url: `${UPDATE_GYMLEAD_URL}/${row._id}`, body: payload },
            () => {
                message.success("Lead updated.");
                getAllData({ page: 1, size: 10, status: statusFilter, search: searchTerm });
            },
        );
    };

    const handleDelete = (row) => {
        api.deleteData({ url: `${DELETE_GYMLEAD_URL}/${row._id}` }, () => {
            message.success("Lead deleted.");
            getAllData({ page: 1, size: 10, status: statusFilter, search: searchTerm });
        });
    };

    const columns = [
        {
            title: "Submitted",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 130,
            render: (v) => (
                <div className="flex flex-col text-xs">
                    <span className="font-medium">{dayjs(v).format("DD MMM YYYY")}</span>
                    <span className="text-gray-500">{dayjs(v).format("hh:mm A")}</span>
                </div>
            ),
        },
        {
            title: "Gym Name",
            dataIndex: "gymName",
            key: "gymName",
            width: 200,
            render: (v) => <span className="font-semibold">{v}</span>,
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            width: 180,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 150,
            render: (v) => (
                <a href={`tel:${v}`} className="text-blue-600">
                    <PhoneOutlined /> {v}
                </a>
            ),
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            width: 240,
            render: (v) =>
                v ? (
                    <Tooltip title={v}>
                        <span className="line-clamp-2 text-xs text-gray-700">{v}</span>
                    </Tooltip>
                ) : (
                    <span className="text-gray-300 text-xs">—</span>
                ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (v, row) => (
                <Select
                    size="small"
                    value={v}
                    style={{ width: 120 }}
                    options={STATUS_OPTIONS}
                    onChange={(next) => handleUpdate(row, { status: next })}
                />
            ),
            filters: GYMLEAD_STATUSES.map((s) => ({ text: s, value: s })),
        },
        {
            title: "Followup",
            dataIndex: "followupDate",
            key: "followupDate",
            width: 160,
            render: (v, row) => (
                <DatePicker
                    size="small"
                    value={v ? dayjs(v) : null}
                    format="DD MMM YYYY"
                    onChange={(d) =>
                        handleUpdate(row, {
                            followupDate: d ? d.toISOString() : null,
                        })
                    }
                />
            ),
        },
        {
            title: "Admin Note",
            dataIndex: "adminNote",
            key: "adminNote",
            width: 220,
            render: (v, row) => (
                <NoteCell
                    initial={v || ""}
                    onSave={(text) => handleUpdate(row, { adminNote: text })}
                />
            ),
        },
        {
            title: "Tag",
            dataIndex: "status",
            key: "tag",
            width: 90,
            render: (v) => <Tag color={GYMLEAD_STATUS_COLORS[v]}>{v}</Tag>,
        },
        {
            title: "",
            key: "action",
            fixed: "right",
            width: 60,
            render: (_, row) => (
                <Popconfirm
                    title="Delete this lead?"
                    description="This cannot be undone."
                    onConfirm={() => handleDelete(row)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    const statusCounts = summary?.statusCounts || {};

    const pageHeader = (
        <CustomPageHeader
            title="Gym Enquiries (Marketing leads)"
            extra={[
                <Button
                    key="refresh"
                    icon={<ReloadOutlined />}
                    onClick={() => getAllData({ page: 1, size: 10 })}
                >
                    Refresh
                </Button>,
            ]}
        />
    );

    return (
        <PageWrapper pageHeader={pageHeader}>
            {/* Status chips */}
            <div className="flex flex-wrap gap-2 mb-4">
                {GYMLEAD_STATUSES.map((s) => (
                    <Tag
                        key={s}
                        color={GYMLEAD_STATUS_COLORS[s]}
                        className="cursor-pointer"
                        onClick={() => {
                            setStatusFilter(s === statusFilter ? undefined : s);
                            getAllData({
                                page: 1,
                                size: 10,
                                status: s === statusFilter ? undefined : s,
                                search: searchTerm || undefined,
                            });
                        }}
                        style={{
                            padding: "4px 12px",
                            fontSize: 13,
                            border:
                                statusFilter === s
                                    ? "2px solid currentColor"
                                    : "1px solid transparent",
                        }}
                    >
                        {s} ({statusCounts[s] ?? 0})
                    </Tag>
                ))}
            </div>

            {/* Search bar */}
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                <Input
                    allowClear
                    placeholder="Search gym name, location, phone, message…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onPressEnter={applyFilters}
                />
                <Button type="primary" onClick={applyFilters}>
                    Search
                </Button>
                <Button onClick={resetFilters}>Reset</Button>
            </Space.Compact>

            <BaseTable
                columns={columns}
                dataSource={dataList}
                loading={loadingList}
                totalElements={totalElements}
                currentPath={GYMLEAD_LIST_PATH}
                scroll={ScrollConfig}
            />
        </PageWrapper>
    );
};

// Small inline-edit cell for admin notes — saves on blur if changed.
const NoteCell = ({ initial, onSave }) => {
    const [val, setVal] = useState(initial);
    return (
        <TextArea
            value={val}
            size="small"
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="Add note…"
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => {
                if ((val || "") !== (initial || "")) onSave(val);
            }}
        />
    );
};

export default GymLeadListView;
