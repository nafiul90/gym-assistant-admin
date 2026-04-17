import { useCallback, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Select, Spin } from "antd";
import { BellOutlined, BellFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import io from "socket.io-client";
import AttCard from "./AttCard";
import { apiFetch, playBeep } from "./dashboardUtils";
import {
    ACCESS_TOKEN,
    ADMIN_DASHBOARD_ATT_LOGS,
    ADMIN_DASHBOARD_GYMS,
    SOCKET_ROOT_URL,
} from "../../../helpers/Constant";

const { RangePicker } = DatePicker;

const LiveAttendance = ({ onSocketStatus }) => {
    const [logs, setLogs] = useState([]);
    const [newIds, setNewIds] = useState(new Set());
    const [muted, setMuted] = useState(false);
    const [gymFilter, setGymFilter] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Refs so socket handler always sees the latest filter values
    const mutedRef = useRef(false);
    mutedRef.current = muted;
    const gymFilterRef = useRef(null);
    gymFilterRef.current = gymFilter;
    const dateRangeRef = useRef(null);
    dateRangeRef.current = dateRange;
    const gymsRef = useRef([]);
    gymsRef.current = gyms;

    // Load gyms for filter dropdown
    useEffect(() => {
        apiFetch(ADMIN_DASHBOARD_GYMS)
            .then((res) => setGyms(Array.isArray(res) ? res : []))
            .catch(() => {});
    }, []);

    // Fetch logs from API
    const fetchLogs = useCallback(
        async (pageNum = 1, replace = true) => {
            if (replace) setInitialLoading(true);
            else setLoadingMore(true);
            try {
                const params = { page: pageNum };
                if (gymFilter) params.gymId = gymFilter;
                if (dateRange) {
                    // Send YYYY-MM-DD; backend forces 00:00:00 / 23:59:59
                    params.from = dayjs(dateRange[0]).format("YYYY-MM-DD");
                    params.to = dayjs(dateRange[1]).format("YYYY-MM-DD");
                }
                const res = await apiFetch(ADMIN_DASHBOARD_ATT_LOGS, params);
                // Backend returns { data, hasMore, page, total }
                const items = Array.isArray(res?.data) ? res.data : [];
                setHasMore(res?.hasMore ?? false);
                if (replace) {
                    setLogs(items);
                } else {
                    setLogs((prev) => [...prev, ...items]);
                }
            } catch (_) {
            } finally {
                setInitialLoading(false);
                setLoadingMore(false);
            }
        },
        [gymFilter, dateRange],
    );

    // Re-fetch when filters change
    useEffect(() => {
        setPage(1);
        fetchLogs(1, true);
    }, [fetchLogs]);

    // Socket — mount-only; uses refs to read current filter state
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN) || "";
        const socket = io(SOCKET_ROOT_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 2000,
        });

        socket.on("connect", () => {
            socket.emit("join_admin", { token });
            onSocketStatus?.("connected");
        });
        socket.on("disconnect", () => onSocketStatus?.("disconnected"));
        socket.on("connect_error", () => onSocketStatus?.("error"));
        socket.on("reconnecting", () => onSocketStatus?.("connecting"));

        socket.on("new_att_log", (incoming) => {
            const items = Array.isArray(incoming) ? incoming : [incoming];

            // Enrich plain-string gymId with the full gym object from our list
            const enriched = items.map((log) => {
                if (log.gymId && typeof log.gymId === "string") {
                    const gymObj = gymsRef.current.find(
                        (g) => g._id === log.gymId,
                    );
                    return gymObj ? { ...log, gymId: gymObj } : log;
                }
                return log;
            });

            const currentGymFilter = gymFilterRef.current;
            const currentDateRange = dateRangeRef.current;
            const todayStr = dayjs().format("YYYY-MM-DD");

            const filtered = enriched.filter((log) => {
                // Gym filter
                const logGymId = log.gymId?._id || log.gymId;
                if (currentGymFilter && logGymId !== currentGymFilter)
                    return false;

                // Date filter: selected range OR today-only (default)
                const punchDay = dayjs(log.punchTime).format("YYYY-MM-DD");
                if (currentDateRange) {
                    const fromDay = dayjs(currentDateRange[0]).format(
                        "YYYY-MM-DD",
                    );
                    const toDay = dayjs(currentDateRange[1]).format(
                        "YYYY-MM-DD",
                    );
                    if (punchDay < fromDay || punchDay > toDay) return false;
                } else {
                    if (punchDay !== todayStr) return false;
                }

                return true;
            });

            if (filtered.length === 0) return;

            if (!mutedRef.current) playBeep();

            setLogs((prev) => {
                const merged = [...filtered, ...prev];
                const seen = new Set();
                return merged.filter((l) => {
                    if (seen.has(l._id)) return false;
                    seen.add(l._id);
                    return true;
                });
            });

            const freshIds = new Set(filtered.map((l) => l._id));
            setNewIds((prev) => new Set([...prev, ...freshIds]));
            setTimeout(() => {
                setNewIds((prev) => {
                    const next = new Set(prev);
                    freshIds.forEach((id) => next.delete(id));
                    return next;
                });
            }, 4000);
        });

        return () => {
            socket.disconnect();
            onSocketStatus?.("disconnected");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchLogs(next, false);
    };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                padding: "20px 22px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #f0f4ff",
                height: "500px",
                overflowY: "auto",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 14,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#1a1a2e",
                        }}
                    >
                        Live Attendance
                    </span>
                    {logs.length > 0 && (
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#2758d1",
                                background: "#eef2ff",
                                padding: "2px 10px",
                                borderRadius: 20,
                            }}
                        >
                            {logs.length}
                        </span>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Select
                        placeholder="All Gyms"
                        allowClear
                        style={{ minWidth: 150 }}
                        size="small"
                        value={gymFilter}
                        onChange={(v) => setGymFilter(v || null)}
                        options={gyms.map((g) => ({
                            label: g.gymName,
                            value: g._id,
                        }))}
                    />
                    <RangePicker
                        size="small"
                        onChange={(v) => setDateRange(v || null)}
                        disabledDate={(d) => d && d > dayjs()}
                        style={{ width: 220 }}
                    />
                    <Button
                        size="small"
                        type={muted ? "default" : "primary"}
                        icon={muted ? <BellFilled /> : <BellOutlined />}
                        onClick={() => setMuted((m) => !m)}
                        title={muted ? "Unmute sound" : "Mute sound"}
                    >
                        {muted ? "Muted" : "Sound On"}
                    </Button>
                </div>
            </div>

            {/* Log list */}
            {initialLoading ? (
                <div
                    style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Spin />
                </div>
            ) : logs.length === 0 ? (
                <div
                    style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#d1d5db",
                        fontSize: 13,
                    }}
                >
                    No attendance records yet
                </div>
            ) : (
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                    {logs.map((log) => (
                        <AttCard
                            key={log._id}
                            log={log}
                            isNew={newIds.has(log._id)}
                        />
                    ))}
                    {hasMore && (
                        <div style={{ textAlign: "center", paddingTop: 8 }}>
                            <Button
                                size="small"
                                onClick={loadMore}
                                loading={loadingMore}
                            >
                                Load More
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveAttendance;
