import { Avatar, Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { IMAGE_URL } from "../../../helpers/Constant";

const AttCard = ({ log, isNew }) => {
    const user = log.user;
    const gymName = log.gymId?.gymName || "—";
    const isCheckIn = log.punchState !== "1";
    const time = new Date(log.punchTime);
    const name = user?.fullName || log.firstName || `ID: ${log.empCode}`;

    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 12,
                background: isNew ? "#f6ffed" : "#fafafa",
                border: `1.5px solid ${isNew ? "#95de64" : "#f0f0f0"}`,
                transition: "background 1.5s, border-color 1.5s",
                animation: isNew ? "attSlideIn 0.35s ease" : "none",
            }}
        >
            <Avatar
                size={40}
                src={
                    user?.profilePicture
                        ? `${IMAGE_URL}/${user.profilePicture}`
                        : null
                }
                icon={<UserOutlined />}
                style={{
                    flexShrink: 0,
                    background: "#e8f0fe",
                    color: "#2758d1",
                }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#1a1a2e",
                    }}
                >
                    {name}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{user?.phone}</div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                    flexShrink: 0,
                }}
            >
                <Tag
                    icon={isCheckIn ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    color={isCheckIn ? "success" : "warning"}
                    style={{ margin: 0, fontSize: 11 }}
                >
                    {isCheckIn ? "Check In" : "Check Out"}
                </Tag>
                <Tag color="geekblue" style={{ margin: 0, fontSize: 10 }}>
                    {gymName}
                </Tag>
                <span style={{ fontSize: 11, color: "#bbb" }}>
                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        </div>
    );
};

export default AttCard;
