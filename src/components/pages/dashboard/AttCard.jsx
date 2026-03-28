import { Avatar, Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { IMAGE_URL } from "../../../helpers/Constant";

const TYPE_COLOR = {
    MEMBER: "blue",
    GYM_OWNER: "purple",
    MANAGER: "orange",
    TRAINER: "cyan",
    SUPER_ADMIN: "red",
    ADMIN: "red",
};

const AttCard = ({ log, isNew }) => {
    const user = log.user;
    const gym = typeof log.gymId === "object" ? log.gymId : null;
    const gymName = gym?.gymName || "—";
    const showCheckCheckout = gym?.showCheckCheckout ?? false;
    const isCheckIn = log.punchState !== "1";

    const punchDate = new Date(log.punchTime);
    const today = new Date();
    const isToday = punchDate.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = punchDate.toDateString() === yesterday.toDateString();
    const dateLabel = isToday
        ? "Today"
        : isYesterday
        ? "Yesterday"
        : punchDate.toLocaleDateString([], { month: "short", day: "numeric" });
    const timeLabel = punchDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const name = user?.fullName || log.firstName || `ID: ${log.empCode}`;

    const expire = user?.membershipExpireDate || user?.paymentClearTo;
    const daysLeft = expire
        ? Math.ceil((new Date(expire) - new Date()) / 86_400_000)
        : null;

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
                style={{ flexShrink: 0, background: "#e8f0fe", color: "#2758d1" }}
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
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>
                    {user?.phone}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {user?.type && (
                        <Tag
                            color={TYPE_COLOR[user.type] || "default"}
                            style={{ fontSize: 10, margin: 0, lineHeight: "18px" }}
                        >
                            {user.type}
                        </Tag>
                    )}
                    <Tag
                        color="geekblue"
                        style={{ fontSize: 10, margin: 0, lineHeight: "18px" }}
                    >
                        {gymName}
                    </Tag>
                    {daysLeft !== null && (
                        <Tag
                            color={
                                daysLeft < 0
                                    ? "red"
                                    : daysLeft < 7
                                    ? "orange"
                                    : "green"
                            }
                            style={{ fontSize: 10, margin: 0, lineHeight: "18px" }}
                        >
                            {daysLeft < 0
                                ? `Expired ${Math.abs(daysLeft)}d ago`
                                : `${daysLeft}d left`}
                        </Tag>
                    )}
                </div>
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
                {showCheckCheckout && (
                    <Tag
                        icon={isCheckIn ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        color={isCheckIn ? "success" : "warning"}
                        style={{ margin: 0, fontSize: 11 }}
                    >
                        {isCheckIn ? "Check In" : "Check Out"}
                    </Tag>
                )}
                <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>
                    {dateLabel}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    {timeLabel}
                </span>
            </div>
        </div>
    );
};

export default AttCard;
