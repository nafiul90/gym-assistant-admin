import { Avatar, Badge, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IMAGE_URL } from "../../../helpers/Constant";

const TYPE_COLOR = {
    MEMBER: "blue",
    GYM_OWNER: "purple",
    MANAGER: "orange",
    TRAINER: "cyan",
    SUPER_ADMIN: "red",
    ADMIN: "red",
    STUFF: "default",
};

const UserCard = ({ user }) => {
    const expire = user.membershipExpireDate || user.paymentClearTo;
    const daysLeft = expire
        ? Math.ceil((new Date(expire) - new Date()) / 86_400_000)
        : null;

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                border: "1px solid #f0f4ff",
                transition: "box-shadow 0.2s",
            }}
        >
            <Badge dot color="#52c41a" offset={[-3, 3]}>
                <Avatar
                    size={46}
                    src={
                        user.profilePicture
                            ? `${IMAGE_URL}/${user.profilePicture}`
                            : null
                    }
                    icon={<UserOutlined />}
                    style={{ background: "#e8f0fe", color: "#2758d1", flexShrink: 0 }}
                />
            </Badge>
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
                    {user.fullName || "—"}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 5 }}>
                    {user.phone}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    <Tag
                        color={TYPE_COLOR[user.type] || "default"}
                        style={{ fontSize: 10, margin: 0, lineHeight: "18px" }}
                    >
                        {user.type}
                    </Tag>
                    {user.gym?.gymName && (
                        <Tag
                            color="geekblue"
                            style={{ fontSize: 10, margin: 0, lineHeight: "18px" }}
                        >
                            {user.gym.gymName}
                        </Tag>
                    )}
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
        </div>
    );
};

export default UserCard;
