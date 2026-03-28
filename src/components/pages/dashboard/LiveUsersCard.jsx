import { useCallback, useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import { apiFetch } from "./dashboardUtils";
import { ADMIN_DASHBOARD_STATS, ADMIN_DASHBOARD_ACTIVE_USERS } from "../../../helpers/Constant";

// Donut segment colors per user type
const TYPE_CONFIG = [
    { key: "MEMBER",      label: "Members",    color: "#22c55e" },
    { key: "GYM_OWNER",   label: "Gym Owners", color: "#8b5cf6" },
    { key: "MANAGER",     label: "Managers",   color: "#f97316" },
    { key: "TRAINER",     label: "Trainers",   color: "#06b6d4" },
    { key: "SUPER_ADMIN", label: "Admins",     color: "#ef4444" },
    { key: "ADMIN",       label: "Admins",     color: "#ef4444" },
];

// Merge SUPER_ADMIN + ADMIN into one "Admins" slice
const buildChartData = (byType) => {
    const adminCount = (byType.SUPER_ADMIN || 0) + (byType.ADMIN || 0);
    const seen = new Set();
    return TYPE_CONFIG.filter((t) => {
        if (t.key === "ADMIN") return false; // merged into SUPER_ADMIN row
        if (seen.has(t.label)) return false;
        seen.add(t.label);
        return true;
    }).map((t) => ({
        label: t.label,
        color: t.color,
        value:
            t.key === "SUPER_ADMIN"
                ? adminCount
                : byType[t.key] || 0,
    })).filter((d) => d.value > 0);
};

const LiveUsersCard = ({ socketStatus }) => {
    const [stats, setStats] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const data = await apiFetch(ADMIN_DASHBOARD_STATS);
            setStats(data);
        } catch (_) {}
    }, []);

    useEffect(() => {
        fetchStats();
        const id = setInterval(fetchStats, 15_000);
        return () => clearInterval(id);
    }, [fetchStats]);

    const byType = stats?.byType || {};
    const online = stats?.online ?? 0;
    const chartData = buildChartData(byType);

    const statusDot = {
        connected:    { color: "#22c55e", label: "Live" },
        disconnected: { color: "#faad14", label: "Disconnected" },
        error:        { color: "#ef4444", label: "Error" },
        connecting:   { color: "#3b82f6", label: "Connecting…" },
    }[socketStatus] || { color: "#9ca3af", label: "—" };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                padding: "20px 22px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #f0f4ff",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                }}
            >
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>
                    Live Users
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: statusDot.color,
                            display: "inline-block",
                            animation:
                                socketStatus === "connected"
                                    ? "pulse 1.5s infinite"
                                    : "none",
                        }}
                    />
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        {statusDot.label} · refreshes 15s
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                {/* Donut */}
                <div style={{ flex: "0 0 180px" }}>
                    {chartData.length > 0 ? (
                        <DonutChart
                            data={chartData}
                            centerText={String(online)}
                            height={180}
                        />
                    ) : (
                        <div
                            style={{
                                height: 180,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            <span style={{ fontSize: 36, fontWeight: 700, color: "#1a1a2e" }}>
                                {online}
                            </span>
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>online</span>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        minWidth: 140,
                    }}
                >
                    {TYPE_CONFIG.filter(
                        (t, i, arr) =>
                            t.key !== "ADMIN" &&
                            arr.findIndex((x) => x.label === t.label) === i
                    ).map((t) => {
                        const count =
                            t.key === "SUPER_ADMIN"
                                ? (byType.SUPER_ADMIN || 0) + (byType.ADMIN || 0)
                                : byType[t.key] || 0;
                        return (
                            <div
                                key={t.key}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 8,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background: t.color,
                                            display: "inline-block",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span style={{ fontSize: 13, color: "#374151" }}>
                                        {t.label}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: count > 0 ? "#1a1a2e" : "#d1d5db",
                                        minWidth: 24,
                                        textAlign: "right",
                                    }}
                                >
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                    <div
                        style={{
                            borderTop: "1px solid #f3f4f6",
                            paddingTop: 10,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>
                            Total Online
                        </span>
                        <span style={{ fontWeight: 800, fontSize: 16, color: "#2758d1" }}>
                            {online}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveUsersCard;
