import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Collapse,
    Divider,
    Progress,
    Space,
    Spin,
    Tag,
    Typography,
} from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import encryptedAxios from "../../../services/encryptedAxios";
import { ACCESS_TOKEN, ADMIN_DASHBOARD_CHECK_DEVICES } from "../../../helpers/Constant";
import axios from "axios";

const { Text, Title } = Typography;
const { Panel } = Collapse;

// ── API helpers ───────────────────────────────────────────────────────────────

const authHeader = () => ({
    "x-auth-token": localStorage.getItem(ACCESS_TOKEN) || "",
});

const apiGet = async (url) => {
    const res = await axios.get(url, { headers: authHeader() });
    return res.data;
};

const apiPost = async (url, body) => {
    const res = await axios.post(url, body, { headers: authHeader() });
    return res.data;
};

// ── Status constants ──────────────────────────────────────────────────────────

const STATUS = {
    IDLE: "idle",
    RUNNING: "running",
    STOPPED: "stopped",
    DONE: "done",
};

// ── Gym result card ───────────────────────────────────────────────────────────

const GymResultCard = ({ result, onDeactivate, deactivating }) => {
    const hasError = !!result.error;
    const count = result.invalidUsers?.length ?? 0;

    return (
        <Card
            size="small"
            style={{
                marginBottom: 10,
                borderColor: hasError ? "#ff4d4f" : count > 0 ? "#faad14" : "#52c41a",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                    <Text strong>{result.gymName}</Text>
                    {result.ip && (
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                            {result.ip}:{result.port}
                        </Text>
                    )}
                    <div style={{ marginTop: 4 }}>
                        {hasError ? (
                            <Tag icon={<CloseCircleOutlined />} color="error">{result.error}</Tag>
                        ) : count === 0 ? (
                            <Tag icon={<CheckCircleOutlined />} color="success">All clean</Tag>
                        ) : (
                            <Tag icon={<ExclamationCircleOutlined />} color="warning">
                                {count} invalid user{count !== 1 ? "s" : ""}
                            </Tag>
                        )}
                    </div>
                </div>
                {!hasError && count > 0 && (
                    <Button
                        danger
                        size="small"
                        loading={deactivating}
                        onClick={() => onDeactivate(result)}
                        icon={<StopOutlined />}
                    >
                        Deactivate {count}
                    </Button>
                )}
            </div>

            {!hasError && count > 0 && (
                <Collapse ghost size="small" style={{ marginTop: 8 }}>
                    <Panel header={<Text type="secondary" style={{ fontSize: 12 }}>Show users</Text>}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {result.invalidUsers.map((u) => (
                                <div key={u._id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
                                    <Text>{u.fullName || "Unknown"}</Text>
                                    <Text type="secondary">{u.phone}</Text>
                                    <Text type="secondary" style={{ fontFamily: "monospace" }}>
                                        PIN: {u.zkTechoDevicePin ?? u.pin}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </Collapse>
            )}
        </Card>
    );
};

// ── BioTime section ───────────────────────────────────────────────────────────

const BiotimeSection = () => {
    const [status, setStatus] = useState(STATUS.IDLE);
    const [gyms, setGyms] = useState([]);
    const [results, setResults] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [deactivatingId, setDeactivatingId] = useState(null);
    const [summary, setSummary] = useState(null);
    const stopRef = useRef(false);

    const start = async () => {
        stopRef.current = false;
        setResults([]);
        setSummary(null);
        setCurrentIdx(0);
        setStatus(STATUS.RUNNING);

        let gymList = gyms;
        if (gymList.length === 0) {
            try {
                gymList = await apiGet(`${ADMIN_DASHBOARD_CHECK_DEVICES}/biotime-gyms`);
                setGyms(gymList);
            } catch {
                setStatus(STATUS.DONE);
                return;
            }
        }

        let totalInvalid = 0;
        for (let i = 0; i < gymList.length; i++) {
            if (stopRef.current) {
                setStatus(STATUS.STOPPED);
                return;
            }
            setCurrentIdx(i);

            try {
                const result = await apiPost(`${ADMIN_DASHBOARD_CHECK_DEVICES}/check-biotime-gym`, {
                    gymId: gymList[i]._id,
                });
                totalInvalid += result.invalidUsers?.length ?? 0;
                setResults((prev) => [...prev, result]);
            } catch {
                setResults((prev) => [
                    ...prev,
                    { gymId: gymList[i]._id, gymName: gymList[i].gymName, error: "Request failed", invalidUsers: [] },
                ]);
            }
        }

        setSummary({ total: gymList.length, totalInvalid });
        setStatus(STATUS.DONE);
    };

    const stop = () => {
        stopRef.current = true;
    };

    const deactivate = async (result) => {
        const validBioTimeIds = result.invalidUsers
            .map((u) => u.bioTimeId)
            .filter((id) => id != null && id !== 0);

        if (validBioTimeIds.length === 0) {
            alert("No valid BioTime IDs found on these users. They may not have been synced to BioTime.");
            return;
        }

        setDeactivatingId(result.gymId);
        try {
            await apiPost(`${ADMIN_DASHBOARD_CHECK_DEVICES}/deactivate-biotime`, {
                gymId: result.gymId,
                bioTimeIds: validBioTimeIds,
            });
            // Mark as done in results
            setResults((prev) =>
                prev.map((r) =>
                    r.gymId === result.gymId
                        ? { ...r, invalidUsers: [], _deactivated: true }
                        : r
                )
            );
        } catch (err) {
            alert("Deactivation failed: " + (err?.response?.data?.message || err.message));
        } finally {
            setDeactivatingId(null);
        }
    };

    const progress = gyms.length > 0
        ? Math.round(((currentIdx + (status === STATUS.DONE || status === STATUS.STOPPED ? 1 : 0)) / gyms.length) * 100)
        : 0;

    return (
        <Card
            title={
                <Space>
                    <span>BioTime Devices</span>
                    {status === STATUS.RUNNING && <SyncOutlined spin style={{ color: "#1677ff" }} />}
                </Space>
            }
            extra={
                <Space>
                    {status !== STATUS.RUNNING ? (
                        <Button type="primary" onClick={start} loading={status === STATUS.RUNNING}>
                            {status === STATUS.IDLE ? "Check BioTime Devices" : "Re-check"}
                        </Button>
                    ) : (
                        <Button danger onClick={stop} icon={<StopOutlined />}>
                            Stop
                        </Button>
                    )}
                </Space>
            }
            style={{ marginBottom: 24 }}
        >
            {status === STATUS.RUNNING && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Checking {gyms[currentIdx]?.gymName ?? "..."} ({currentIdx + 1} / {gyms.length})
                    </Text>
                    <Progress percent={progress} size="small" style={{ marginTop: 4 }} />
                </div>
            )}

            {status === STATUS.STOPPED && (
                <Alert type="warning" message="Check stopped by user." style={{ marginBottom: 12 }} showIcon />
            )}

            {summary && status === STATUS.DONE && (
                <Alert
                    type={summary.totalInvalid > 0 ? "warning" : "success"}
                    message={
                        summary.totalInvalid > 0
                            ? `Found ${summary.totalInvalid} invalid user(s) across ${summary.total} gym(s).`
                            : `All ${summary.total} BioTime gym(s) are clean.`
                    }
                    style={{ marginBottom: 12 }}
                    showIcon
                />
            )}

            {results.length === 0 && status === STATUS.IDLE && (
                <Text type="secondary">
                    Click "Check BioTime Devices" to scan all active BioTime gyms for users who are
                    deactivated in the system but still have device access.
                </Text>
            )}

            {results.map((r) => (
                <GymResultCard
                    key={r.gymId}
                    result={r}
                    onDeactivate={deactivate}
                    deactivating={deactivatingId === r.gymId}
                />
            ))}
        </Card>
    );
};

// ── PyZK section ──────────────────────────────────────────────────────────────

// Expand a gym's deviceList (or single deviceIp) into a flat list of devices.
function resolveDevices(gym) {
    if (gym.deviceList && gym.deviceList.length > 0) {
        return gym.deviceList
            .filter((d) => d.ip)
            .map((d) => ({ gymId: gym._id, gymName: gym.gymName, ip: d.ip, port: d.port > 0 ? d.port : 4370 }));
    }
    if (gym.deviceIp) {
        const port = parseInt(gym.devicePort, 10);
        return [{ gymId: gym._id, gymName: gym.gymName, ip: gym.deviceIp, port: isNaN(port) || port <= 0 ? 4370 : port }];
    }
    return [];
}

const PyzkSection = () => {
    const [status, setStatus] = useState(STATUS.IDLE);
    const [devices, setDevices] = useState([]); // flat list of { gymId, gymName, ip, port }
    const [results, setResults] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [deactivatingKey, setDeactivatingKey] = useState(null);
    const [summary, setSummary] = useState(null);
    const stopRef = useRef(false);

    const start = async () => {
        stopRef.current = false;
        setResults([]);
        setSummary(null);
        setCurrentIdx(0);
        setStatus(STATUS.RUNNING);

        let deviceList = devices;
        if (deviceList.length === 0) {
            try {
                const gyms = await apiGet(`${ADMIN_DASHBOARD_CHECK_DEVICES}/pyzk-gyms`);
                deviceList = gyms.flatMap(resolveDevices);
                setDevices(deviceList);
            } catch {
                setStatus(STATUS.DONE);
                return;
            }
        }

        if (deviceList.length === 0) {
            setSummary({ total: 0, totalInvalid: 0 });
            setStatus(STATUS.DONE);
            return;
        }

        let totalInvalid = 0;
        for (let i = 0; i < deviceList.length; i++) {
            if (stopRef.current) {
                setStatus(STATUS.STOPPED);
                return;
            }
            setCurrentIdx(i);
            const dev = deviceList[i];

            try {
                const result = await apiPost(`${ADMIN_DASHBOARD_CHECK_DEVICES}/check-pyzk-device`, {
                    gymId: dev.gymId,
                    ip: dev.ip,
                    port: dev.port,
                });
                totalInvalid += result.invalidUsers?.length ?? 0;
                setResults((prev) => [...prev, result]);
            } catch {
                setResults((prev) => [
                    ...prev,
                    { gymId: dev.gymId, gymName: dev.gymName, ip: dev.ip, port: dev.port, error: "Request failed", invalidUsers: [] },
                ]);
            }
        }

        setSummary({ total: deviceList.length, totalInvalid });
        setStatus(STATUS.DONE);
    };

    const stop = () => {
        stopRef.current = true;
    };

    const deactivate = async (result) => {
        const pins = result.invalidUsers.map((u) => u.pin).filter((p) => p != null);
        if (pins.length === 0) return;

        const key = `${result.gymId}-${result.ip}`;
        setDeactivatingKey(key);
        try {
            await apiPost(`${ADMIN_DASHBOARD_CHECK_DEVICES}/deactivate-pyzk`, {
                gymId: result.gymId,
                ip: result.ip,
                port: result.port,
                pins,
            });
            setResults((prev) =>
                prev.map((r) =>
                    r.gymId === result.gymId && r.ip === result.ip
                        ? { ...r, invalidUsers: [], _deactivated: true }
                        : r
                )
            );
        } catch (err) {
            alert("Deactivation failed: " + (err?.response?.data?.message || err.message));
        } finally {
            setDeactivatingKey(null);
        }
    };

    const progress = devices.length > 0
        ? Math.round(((currentIdx + (status === STATUS.DONE || status === STATUS.STOPPED ? 1 : 0)) / devices.length) * 100)
        : 0;

    return (
        <Card
            title={
                <Space>
                    <span>PyZK Devices</span>
                    {status === STATUS.RUNNING && <SyncOutlined spin style={{ color: "#1677ff" }} />}
                </Space>
            }
            extra={
                <Space>
                    {status !== STATUS.RUNNING ? (
                        <Button type="primary" onClick={start}>
                            {status === STATUS.IDLE ? "Check PyZK Devices" : "Re-check"}
                        </Button>
                    ) : (
                        <Button danger onClick={stop} icon={<StopOutlined />}>
                            Stop
                        </Button>
                    )}
                </Space>
            }
        >
            {status === STATUS.RUNNING && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Checking {devices[currentIdx]?.gymName ?? "..."} — {devices[currentIdx]?.ip} ({currentIdx + 1} / {devices.length})
                    </Text>
                    <Progress percent={progress} size="small" style={{ marginTop: 4 }} />
                </div>
            )}

            {status === STATUS.STOPPED && (
                <Alert type="warning" message="Check stopped by user." style={{ marginBottom: 12 }} showIcon />
            )}

            {summary && status === STATUS.DONE && (
                <Alert
                    type={summary.totalInvalid > 0 ? "warning" : "success"}
                    message={
                        summary.totalInvalid > 0
                            ? `Found ${summary.totalInvalid} invalid user(s) across ${summary.total} device(s).`
                            : summary.total === 0
                            ? "No active PyZK gyms found."
                            : `All ${summary.total} PyZK device(s) are clean.`
                    }
                    style={{ marginBottom: 12 }}
                    showIcon
                />
            )}

            {results.length === 0 && status === STATUS.IDLE && (
                <Text type="secondary">
                    Click "Check PyZK Devices" to scan all active PyZK devices for users who are
                    deactivated in the system but still have physical device access.
                </Text>
            )}

            {results.map((r) => (
                <GymResultCard
                    key={`${r.gymId}-${r.ip}`}
                    result={r}
                    onDeactivate={deactivate}
                    deactivating={deactivatingKey === `${r.gymId}-${r.ip}`}
                />
            ))}
        </Card>
    );
};

// ── Deactivate All section ────────────────────────────────────────────────────

const LOG_TYPE_COLOR = {
    info: "#1677ff",
    ok: "#52c41a",
    found: "#faad14",
    done: "#52c41a",
    warn: "#faad14",
    error: "#ff4d4f",
    summary: "#1677ff",
    complete: "#722ed1",
};

const LOG_TYPE_LABEL = {
    info: "INFO",
    ok: "OK",
    found: "FOUND",
    done: "DONE",
    warn: "WARN",
    error: "ERROR",
    summary: "SUMMARY",
    complete: "COMPLETE",
};

const DeactivateAllSection = () => {
    const [running, setRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [done, setDone] = useState(false);
    const logEndRef = useRef(null);
    const readerRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [logs, scrollToBottom]);

    const run = async () => {
        setLogs([]);
        setDone(false);
        setRunning(true);

        try {
            const res = await fetch(
                `${ADMIN_DASHBOARD_CHECK_DEVICES}/deactivate-all`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem(ACCESS_TOKEN) || "",
                    },
                }
            );

            const reader = res.body.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done: streamDone, value } = await reader.read();
                if (streamDone) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop(); // keep incomplete last line
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    try {
                        const entry = JSON.parse(trimmed);
                        setLogs((prev) => [...prev, entry]);
                    } catch {
                        // non-JSON line — ignore
                    }
                }
            }
        } catch (err) {
            setLogs((prev) => [
                ...prev,
                { type: "error", source: "all", message: "Request failed: " + err.message },
            ]);
        } finally {
            readerRef.current = null;
            setRunning(false);
            setDone(true);
        }
    };

    const completeEntry = logs.find((l) => l.type === "complete");

    return (
        <Card
            title={
                <Space>
                    <span>Deactivate All Invalid Users</span>
                    {running && <SyncOutlined spin style={{ color: "#722ed1" }} />}
                </Space>
            }
            extra={
                <Button
                    type="primary"
                    danger
                    onClick={run}
                    loading={running}
                    icon={<StopOutlined />}
                    disabled={running}
                >
                    {done ? "Run Again" : "Deactivate All (BioTime + PyZK)"}
                </Button>
            }
            style={{ marginBottom: 24 }}
        >
            {logs.length === 0 && !running && (
                <Text type="secondary">
                    Scans ALL active BioTime and PyZK gyms in one go, finds users who are
                    deactivated in the system but still have device access, and removes them.
                    Use this for a full sweep instead of checking gym by gym above.
                </Text>
            )}

            {completeEntry && (
                <Alert
                    type="success"
                    showIcon
                    message={completeEntry.message}
                    style={{ marginBottom: 12 }}
                />
            )}

            {logs.length > 0 && (
                <div
                    style={{
                        maxHeight: 360,
                        overflowY: "auto",
                        background: "#0d0d0d",
                        borderRadius: 6,
                        padding: "10px 14px",
                        fontFamily: "monospace",
                        fontSize: 12,
                        lineHeight: "1.8",
                    }}
                >
                    {logs.map((entry, i) => (
                        <div key={i} style={{ display: "flex", gap: 8 }}>
                            <span
                                style={{
                                    color: LOG_TYPE_COLOR[entry.type] || "#aaa",
                                    minWidth: 70,
                                    fontWeight: 600,
                                }}
                            >
                                [{LOG_TYPE_LABEL[entry.type] || entry.type.toUpperCase()}]
                            </span>
                            <span style={{ color: "#d9d9d9" }}>
                                {entry.source && entry.source !== "all" && (
                                    <span style={{ color: "#888", marginRight: 6 }}>
                                        [{entry.source.toUpperCase()}]
                                    </span>
                                )}
                                {entry.gymName && (
                                    <span style={{ color: "#aaa", marginRight: 6 }}>{entry.gymName}{entry.ip ? ` (${entry.ip})` : ""} —</span>
                                )}
                                {entry.message}
                            </span>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            )}
        </Card>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const CheckDevices = () => {
    return (
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <Title level={4} style={{ marginBottom: 4 }}>Check Devices</Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                Scan BioTime and PyZK devices for users who are deactivated in the system but
                still retain physical device access. Deactivate them in one click.
            </Text>
            <DeactivateAllSection />
            <BiotimeSection />
            <PyzkSection />
        </div>
    );
};

export default CheckDevices;
