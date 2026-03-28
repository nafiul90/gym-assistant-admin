import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Avatar,
    Badge,
    DatePicker,
    Select,
    Spin,
    Tag,
    Tooltip,
} from "antd";
import {
    BellFilled,
    BellOutlined,
    UserOutlined,
    TeamOutlined,
    HomeOutlined,
    SafetyOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WifiOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import PageWrapper from "../../common/PageWrapper";
import {
    ACCESS_TOKEN,
    ADMIN_DASHBOARD_ACTIVE_USERS,
    ADMIN_DASHBOARD_APP_ACTIVITY,
    ADMIN_DASHBOARD_ATT_LOGS,
    ADMIN_DASHBOARD_GYMS,
    ADMIN_DASHBOARD_REGISTRATIONS,
    ADMIN_DASHBOARD_STATS,
    IMAGE_URL,
    SOCKET_ROOT_URL,
} from "../../../helpers/Constant";
import encryptedAxios from "../../../services/encryptedAxios";

const { RangePicker } = DatePicker;

// ── Auth header ───────────────────────────────────────────────────────────────

const authHeader = () => ({
    "x-auth-token": localStorage.getItem(ACCESS_TOKEN) || "",
});

const apiFetch = async (url, params = {}) => {
    const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
    ).toString();
    return encryptedAxios
        .get(qs ? `${url}?${qs}` : url, { headers: authHeader() })
        .then((r) => r.data);
};

// ── Sound ─────────────────────────────────────────────────────────────────────

const audioCtxRef = { current: null };

const playBeep = () => {
    try {
        if (!audioCtxRef.current)
            // eslint-disable-next-line
            audioCtxRef.current = new (window.AudioContext || window["webkitAudioContext"])();
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 520;
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
    } catch (_) {}
};

// ── Chart (Chart.js via canvas) ───────────────────────────────────────────────

const BarChart = ({ data, color = "#2758d1", height = 220 }) => {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        // Lazy-import so Chart.js tree-shakes fine
        import("chart.js/auto").then(({ default: Chart }) => {
            if (!canvasRef.current) return;
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
            instanceRef.current = new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: data.map((d) => d.label),
                    datasets: [
                        {
                            data: data.map((d) => d.count),
                            backgroundColor: color,
                            borderRadius: 5,
                            borderSkipped: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { title: (i) => i[0].label } },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 },
                            grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: {
                            grid: { display: false },
                            ticks: { maxRotation: 45, font: { size: 11 } },
                        },
                    },
                },
            });
        });
        return () => {
            instanceRef.current?.destroy();
            instanceRef.current = null;
        };
    }, [data, color]);

    return (
        <div style={{ height }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

const LineChart = ({ data, color = "#2758d1", height = 220 }) => {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        import("chart.js/auto").then(({ default: Chart }) => {
            if (!canvasRef.current) return;
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
            instanceRef.current = new Chart(canvasRef.current, {
                type: "line",
                data: {
                    labels: data.map((d) => d.date),
                    datasets: [
                        {
                            data: data.map((d) => d.count),
                            borderColor: color,
                            backgroundColor: `${color}18`,
                            tension: 0.35,
                            fill: true,
                            pointRadius: 4,
                            pointBackgroundColor: color,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 },
                            grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: {
                            grid: { display: false },
                            ticks: { maxRotation: 45, font: { size: 11 } },
                        },
                    },
                },
            });
        });
        return () => {
            instanceRef.current?.destroy();
            instanceRef.current = null;
        };
    }, [data, color]);

    return (
        <div style={{ height }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, bg, pulse }) => (
    <div
        style={{
            background: bg,
            borderRadius: 16,
            padding: "18px 24px",
            minWidth: 140,
            flex: "1 1 140px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
        }}
    >
        <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.9 }}>{icon}</div>
        <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{value ?? "—"}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{label}</div>
        {pulse && (
            <span
                style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#fff",
                    animation: "pulse 1.5s infinite",
                }}
            />
        )}
    </div>
);

// ── Active User Card ──────────────────────────────────────────────────────────

const UserCard = ({ user }) => {
    const expire = user.membershipExpireDate || user.paymentClearTo;
    const daysLeft = expire
        ? Math.ceil((new Date(expire) - new Date()) / 86_400_000)
        : null;

    const typeColors = {
        MEMBER: "blue",
        GYM_OWNER: "purple",
        MANAGER: "orange",
        TRAINER: "cyan",
        SUPER_ADMIN: "red",
        ADMIN: "red",
        STUFF: "default",
    };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "16px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                border: "1px solid #f0f0f0",
            }}
        >
            <Badge
                dot
                color="#52c41a"
                offset={[-4, 4]}
                style={{ zIndex: 1 }}
            >
                <Avatar
                    size={48}
                    src={
                        user.profilePicture
                            ? `${IMAGE_URL}/${user.profilePicture}`
                            : null
                    }
                    icon={<UserOutlined />}
                    style={{ background: "#e6f4ff", color: "#2758d1" }}
                />
            </Badge>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {user.fullName || "—"}
                </div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                    {user.phone}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <Tag
                        color={typeColors[user.type] || "default"}
                        style={{ fontSize: 10, margin: 0 }}
                    >
                        {user.type}
                    </Tag>
                    {user.gym?.gymName && (
                        <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
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
                            style={{ fontSize: 10, margin: 0 }}
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

// ── Attendance Card ───────────────────────────────────────────────────────────

const AttCard = ({ log, isNew }) => {
    const user = log.user;
    const gymName = log.gymId?.gymName || "—";
    const isCheckIn = log.punchState !== "1";
    const time = new Date(log.punchTime);
    const name =
        user?.fullName || log.firstName || `ID: ${log.empCode}`;

    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 12,
                background: isNew ? "#f6ffed" : "#fafafa",
                border: `1.5px solid ${isNew ? "#b7eb8f" : "#f0f0f0"}`,
                transition: "background 1.5s",
                animation: isNew ? "slideIn 0.35s ease" : "none",
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
                style={{ flexShrink: 0, background: "#e6f4ff", color: "#2758d1" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {name}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>{user?.phone}</div>
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
                    icon={
                        isCheckIn ? (
                            <CheckCircleOutlined />
                        ) : (
                            <CloseCircleOutlined />
                        )
                    }
                    color={isCheckIn ? "success" : "warning"}
                    style={{ margin: 0, fontSize: 11 }}
                >
                    {isCheckIn ? "Check In" : "Check Out"}
                </Tag>
                <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>
                    {gymName}
                </Tag>
                <span style={{ fontSize: 11, color: "#aaa" }}>
                    {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d) => dayjs(d).format("YYYY-MM-DD");

// ── Main Dashboard ────────────────────────────────────────────────────────────

const Dashboard = () => {
    // ── Stats ─────────────────────────────────────────────────────────────
    const [stats, setStats] = useState(null);
    const [activeUsers, setActiveUsers] = useState([]);

    // ── Activity chart ────────────────────────────────────────────────────
    const [activityPeriod, setActivityPeriod] = useState("1d");
    const [activityRange, setActivityRange] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);

    // ── Registration chart ────────────────────────────────────────────────
    const [regPreset, setRegPreset] = useState("30d");
    const [regRange, setRegRange] = useState(null);
    const [regData, setRegData] = useState([]);
    const [regLoading, setRegLoading] = useState(false);

    // ── Live Attendance ───────────────────────────────────────────────────
    const [attLogs, setAttLogs] = useState([]);
    const [attTotal, setAttTotal] = useState(0);
    const [attGymId, setAttGymId] = useState("");
    const [attDateRange, setAttDateRange] = useState(null);
    const [attPage, setAttPage] = useState(1);
    const [attHasMore, setAttHasMore] = useState(false);
    const [attLoading, setAttLoading] = useState(false);
    const [gyms, setGyms] = useState([]);
    const [muted, setMuted] = useState(false);
    const [socketStatus, setSocketStatus] = useState("connecting");
    const newLogIds = useRef(new Set());

    const socketRef = useRef(null);
    const mutedRef = useRef(muted);
    mutedRef.current = muted;

    // ── Fetch helpers ─────────────────────────────────────────────────────

    const fetchStats = useCallback(async () => {
        try {
            const data = await apiFetch(ADMIN_DASHBOARD_STATS);
            setStats(data);
        } catch (_) {}
    }, []);

    const fetchActiveUsers = useCallback(async () => {
        try {
            const data = await apiFetch(ADMIN_DASHBOARD_ACTIVE_USERS);
            setActiveUsers(Array.isArray(data) ? data : []);
        } catch (_) {}
    }, []);

    const fetchActivity = useCallback(async () => {
        setActivityLoading(true);
        try {
            const params = { period: activityPeriod };
            if (activityPeriod === "custom" && activityRange) {
                params.from = fmt(activityRange[0]);
                params.to = fmt(activityRange[1]);
            }
            const data = await apiFetch(ADMIN_DASHBOARD_APP_ACTIVITY, params);
            setActivityData(Array.isArray(data) ? data : []);
        } catch (_) {
        } finally {
            setActivityLoading(false);
        }
    }, [activityPeriod, activityRange]);

    const fetchRegistrations = useCallback(async () => {
        setRegLoading(true);
        try {
            let from, to;
            const now = dayjs();
            if (regPreset === "today") {
                from = fmt(now.startOf("day"));
                to = fmt(now);
            } else if (regPreset === "7d") {
                from = fmt(now.subtract(7, "day"));
                to = fmt(now);
            } else if (regPreset === "15d") {
                from = fmt(now.subtract(15, "day"));
                to = fmt(now);
            } else if (regPreset === "30d") {
                from = fmt(now.subtract(30, "day"));
                to = fmt(now);
            } else if (regPreset === "custom" && regRange) {
                from = fmt(regRange[0]);
                to = fmt(regRange[1]);
            }
            const data = await apiFetch(ADMIN_DASHBOARD_REGISTRATIONS, { from, to });
            setRegData(Array.isArray(data) ? data : []);
        } catch (_) {
        } finally {
            setRegLoading(false);
        }
    }, [regPreset, regRange]);

    const fetchAttLogs = useCallback(
        async (page = 1, append = false) => {
            setAttLoading(true);
            try {
                const params = { page };
                if (attGymId) params.gymId = attGymId;
                if (attDateRange) {
                    params.from = fmt(attDateRange[0]) + "T00:00:00";
                    params.to = fmt(attDateRange[1]) + "T23:59:59";
                }
                const data = await apiFetch(ADMIN_DASHBOARD_ATT_LOGS, params);
                setAttTotal(data.total || 0);
                setAttHasMore(data.hasMore || false);
                setAttPage(data.page || 1);
                setAttLogs((prev) =>
                    append ? [...prev, ...(data.data || [])] : data.data || []
                );
            } catch (_) {
            } finally {
                setAttLoading(false);
            }
        },
        [attGymId, attDateRange]
    );

    // ── Gym list for dropdown ─────────────────────────────────────────────

    useEffect(() => {
        apiFetch(ADMIN_DASHBOARD_GYMS)
            .then((d) => setGyms(Array.isArray(d) ? d : []))
            .catch(() => {});
    }, []);

    // ── Polling: stats + active users every 15s ───────────────────────────

    useEffect(() => {
        fetchStats();
        fetchActiveUsers();
        const id = setInterval(() => {
            fetchStats();
            fetchActiveUsers();
        }, 15_000);
        return () => clearInterval(id);
    }, [fetchStats, fetchActiveUsers]);

    // ── Polling: charts every 30s ─────────────────────────────────────────

    useEffect(() => {
        fetchActivity();
        const id = setInterval(fetchActivity, 30_000);
        return () => clearInterval(id);
    }, [fetchActivity]);

    useEffect(() => {
        fetchRegistrations();
        const id = setInterval(fetchRegistrations, 30_000);
        return () => clearInterval(id);
    }, [fetchRegistrations]);

    // ── Initial attendance load ───────────────────────────────────────────

    useEffect(() => {
        fetchAttLogs(1, false);
        newLogIds.current.clear();
    }, [fetchAttLogs]);

    // ── Socket: live attendance ───────────────────────────────────────────

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return;

        const socket = io(SOCKET_ROOT_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 3000,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setSocketStatus("connected");
            socket.emit("join_admin", { token });
        });

        socket.on("disconnect", () => setSocketStatus("disconnected"));
        socket.on("connect_error", () => setSocketStatus("error"));

        socket.on("new_att_log", (payload) => {
            const incoming = Array.isArray(payload) ? payload : [payload];
            if (incoming.length === 0) return;

            // Mark as new for animation
            const ids = incoming.map((l) => l._id).filter(Boolean);
            ids.forEach((id) => newLogIds.current.add(id));

            // Play sound
            if (!mutedRef.current) playBeep();

            // Prepend to list, keep cap at 200
            setAttLogs((prev) => {
                const merged = [...incoming, ...prev].slice(0, 200);
                return merged;
            });
            setAttTotal((t) => t + incoming.length);

            // Clear "new" highlight after 3s
            setTimeout(() => {
                ids.forEach((id) => newLogIds.current.delete(id));
                // Force re-render to remove highlight
                setAttLogs((prev) => [...prev]);
            }, 3000);
        });

        return () => socket.disconnect();
    }, []);

    // ── Derived ───────────────────────────────────────────────────────────

    const byType = stats?.byType || {};
    const statusColor = {
        connected: "#52c41a",
        disconnected: "#faad14",
        error: "#ff4d4f",
        connecting: "#1677ff",
    };

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <PageWrapper pageHeader="">
            {/* CSS animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.4); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div style={{ padding: "20px 24px", background: "#f5f7fa", minHeight: "100vh" }}>

                {/* ── SECTION 1: LIVE STATS ──────────────────────────────── */}
                <div style={{ marginBottom: 24 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                        }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: statusColor[socketStatus],
                                display: "inline-block",
                                animation:
                                    socketStatus === "connected"
                                        ? "pulse 1.5s infinite"
                                        : "none",
                            }}
                        />
                        <span
                            style={{
                                fontWeight: 700,
                                fontSize: 18,
                                color: "#1a1a2e",
                            }}
                        >
                            Live Users
                        </span>
                        <span style={{ fontSize: 12, color: "#aaa" }}>
                            (refreshes every 15s)
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <StatCard
                            icon={<WifiOutlined />}
                            label="Online Now"
                            value={stats?.online}
                            bg="linear-gradient(135deg,#2758d1,#5b8cff)"
                            pulse
                        />
                        <StatCard
                            icon={<TeamOutlined />}
                            label="Members"
                            value={byType.MEMBER}
                            bg="linear-gradient(135deg,#389e0d,#73d13d)"
                        />
                        <StatCard
                            icon={<HomeOutlined />}
                            label="Gym Owners"
                            value={byType.GYM_OWNER}
                            bg="linear-gradient(135deg,#531dab,#9254de)"
                        />
                        <StatCard
                            icon={<SafetyOutlined />}
                            label="Managers"
                            value={byType.MANAGER}
                            bg="linear-gradient(135deg,#d46b08,#ffa940)"
                        />
                        <StatCard
                            icon={<TrophyOutlined />}
                            label="Trainers"
                            value={byType.TRAINER}
                            bg="linear-gradient(135deg,#006d75,#36cfc9)"
                        />
                        <StatCard
                            icon={<UserOutlined />}
                            label="Admins"
                            value={
                                (byType.SUPER_ADMIN || 0) + (byType.ADMIN || 0)
                            }
                            bg="linear-gradient(135deg,#cf1322,#ff7875)"
                        />
                    </div>
                </div>

                {/* ── SECTION 2: CHARTS ─────────────────────────────────── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                        gap: 20,
                        marginBottom: 24,
                    }}
                >
                    {/* App Usage */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "20px 24px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                                flexWrap: "wrap",
                                gap: 8,
                            }}
                        >
                            <span style={{ fontWeight: 700, fontSize: 16 }}>
                                App Usage
                            </span>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["1h", "1d", "7d", "30d", "custom"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setActivityPeriod(p)}
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 12,
                                            background:
                                                activityPeriod === p
                                                    ? "#2758d1"
                                                    : "#f0f0f0",
                                            color:
                                                activityPeriod === p
                                                    ? "#fff"
                                                    : "#555",
                                            fontWeight:
                                                activityPeriod === p ? 600 : 400,
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {p === "1h"
                                            ? "Last Hour"
                                            : p === "1d"
                                            ? "Today"
                                            : p === "7d"
                                            ? "7 Days"
                                            : p === "30d"
                                            ? "30 Days"
                                            : "Custom"}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {activityPeriod === "custom" && (
                            <RangePicker
                                style={{ marginBottom: 12, width: "100%" }}
                                onChange={(v) => setActivityRange(v)}
                                disabledDate={(d) => d && d > dayjs()}
                            />
                        )}
                        {activityLoading ? (
                            <div
                                style={{
                                    height: 220,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Spin />
                            </div>
                        ) : activityData.length === 0 ? (
                            <div
                                style={{
                                    height: 220,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#bbb",
                                    fontSize: 14,
                                }}
                            >
                                No activity data yet
                            </div>
                        ) : (
                            <BarChart data={activityData} />
                        )}
                        <div
                            style={{
                                fontSize: 11,
                                color: "#bbb",
                                marginTop: 8,
                                textAlign: "right",
                            }}
                        >
                            Based on last API activity per user
                        </div>
                    </div>

                    {/* User Registrations */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "20px 24px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                                flexWrap: "wrap",
                                gap: 8,
                            }}
                        >
                            <span style={{ fontWeight: 700, fontSize: 16 }}>
                                New Registrations
                            </span>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["today", "7d", "15d", "30d", "custom"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setRegPreset(p)}
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 12,
                                            background:
                                                regPreset === p
                                                    ? "#531dab"
                                                    : "#f0f0f0",
                                            color:
                                                regPreset === p ? "#fff" : "#555",
                                            fontWeight:
                                                regPreset === p ? 600 : 400,
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {p === "today"
                                            ? "Today"
                                            : p === "7d"
                                            ? "7 Days"
                                            : p === "15d"
                                            ? "15 Days"
                                            : p === "30d"
                                            ? "30 Days"
                                            : "Custom"}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {regPreset === "custom" && (
                            <RangePicker
                                style={{ marginBottom: 12, width: "100%" }}
                                onChange={(v) => setRegRange(v)}
                                disabledDate={(d) => d && d > dayjs()}
                            />
                        )}
                        {regLoading ? (
                            <div
                                style={{
                                    height: 220,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Spin />
                            </div>
                        ) : regData.length === 0 ? (
                            <div
                                style={{
                                    height: 220,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#bbb",
                                    fontSize: 14,
                                }}
                            >
                                No registrations in this period
                            </div>
                        ) : (
                            <LineChart data={regData} color="#531dab" />
                        )}
                        <div
                            style={{
                                fontSize: 11,
                                color: "#bbb",
                                marginTop: 8,
                                textAlign: "right",
                            }}
                        >
                            Total:{" "}
                            <strong>
                                {regData.reduce((s, d) => s + d.count, 0)}
                            </strong>{" "}
                            new users
                        </div>
                    </div>
                </div>

                {/* ── SECTION 3: ACTIVE USERS ───────────────────────────── */}
                {activeUsers.length > 0 && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "20px 24px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            marginBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <span style={{ fontWeight: 700, fontSize: 16 }}>
                                Currently Active{" "}
                                <Tag color="green" style={{ marginLeft: 4 }}>
                                    {activeUsers.length}
                                </Tag>
                            </span>
                            <span style={{ fontSize: 12, color: "#aaa" }}>
                                active in last 2 minutes
                            </span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(260px, 1fr))",
                                gap: 12,
                                maxHeight: 400,
                                overflowY: "auto",
                            }}
                        >
                            {activeUsers.map((u) => (
                                <UserCard key={u._id} user={u} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SECTION 4: LIVE ATTENDANCE ────────────────────────── */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "20px 24px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 10,
                            marginBottom: 16,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>
                                Live Attendance
                            </span>
                            <span
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: statusColor[socketStatus],
                                    display: "inline-block",
                                    animation:
                                        socketStatus === "connected"
                                            ? "pulse 1.5s infinite"
                                            : "none",
                                }}
                            />
                            <Tag color="default">Total: {attTotal}</Tag>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            {/* Gym filter */}
                            <Select
                                allowClear
                                placeholder="All gyms"
                                style={{ minWidth: 160 }}
                                value={attGymId || undefined}
                                onChange={(v) => {
                                    setAttGymId(v || "");
                                    setAttPage(1);
                                }}
                                options={gyms.map((g) => ({
                                    value: g._id,
                                    label: g.gymName,
                                }))}
                                size="small"
                            />
                            {/* Date range filter */}
                            <RangePicker
                                size="small"
                                onChange={(v) => {
                                    setAttDateRange(v);
                                    setAttPage(1);
                                }}
                                disabledDate={(d) => d && d > dayjs()}
                            />
                            {/* Mute toggle */}
                            <Tooltip
                                title={muted ? "Unmute sound" : "Mute sound"}
                            >
                                <button
                                    onClick={() => setMuted((m) => !m)}
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 8,
                                        padding: "4px 10px",
                                        cursor: "pointer",
                                        background: muted ? "#fff1f0" : "#f6ffed",
                                        color: muted ? "#ff4d4f" : "#52c41a",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontSize: 13,
                                    }}
                                >
                                    {muted ? <BellFilled /> : <BellOutlined />}
                                    {muted ? "Muted" : "Sound"}
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Feed */}
                    {attLoading && attLogs.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: 40,
                            }}
                        >
                            <Spin />
                        </div>
                    ) : attLogs.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                color: "#bbb",
                                padding: "40px 0",
                                fontSize: 14,
                            }}
                        >
                            No attendance records for this period
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                maxHeight: 560,
                                overflowY: "auto",
                            }}
                        >
                            {attLogs.map((log) => (
                                <AttCard
                                    key={log._id}
                                    log={log}
                                    isNew={newLogIds.current.has(log._id)}
                                />
                            ))}
                            {attHasMore && (
                                <button
                                    onClick={() =>
                                        fetchAttLogs(attPage + 1, true)
                                    }
                                    disabled={attLoading}
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 8,
                                        padding: "8px 0",
                                        cursor: "pointer",
                                        background: "#fafafa",
                                        color: "#555",
                                        fontSize: 13,
                                        marginTop: 4,
                                    }}
                                >
                                    {attLoading ? "Loading…" : "Load more"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Dashboard;
