import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import UserCard from "./UserCard";
import { apiFetch } from "./dashboardUtils";
import { ADMIN_DASHBOARD_ACTIVE_USERS } from "../../../helpers/Constant";

const ActiveUsersSection = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch(ADMIN_DASHBOARD_ACTIVE_USERS);
            setUsers(Array.isArray(res) ? res : []);
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        const id = setInterval(fetchUsers, 15_000);
        return () => clearInterval(id);
    }, [fetchUsers]);

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                padding: "20px 22px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #f0f4ff",
                height: "300px",
                overflowY: "auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                <TeamOutlined style={{ fontSize: 18, color: "#2758d1" }} />
                <span
                    style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}
                >
                    Active Users
                </span>
                {users.length > 0 && (
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#16a34a",
                            background: "#f0fdf4",
                            padding: "2px 10px",
                            borderRadius: 20,
                        }}
                    >
                        {users.length} online now
                    </span>
                )}
                <span
                    style={{
                        fontSize: 11,
                        color: "#d1d5db",
                        marginLeft: "auto",
                    }}
                >
                    active in last 2 min · refreshes 15s
                </span>
            </div>

            {loading && users.length === 0 ? (
                <div
                    style={{
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Spin />
                </div>
            ) : users.length === 0 ? (
                <div
                    style={{
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#d1d5db",
                        fontSize: 13,
                    }}
                >
                    No active users right now
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: 10,
                    }}
                >
                    {users.map((u) => (
                        <UserCard key={u._id} user={u} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveUsersSection;
