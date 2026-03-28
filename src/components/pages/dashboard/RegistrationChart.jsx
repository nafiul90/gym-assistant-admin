import { useCallback, useEffect, useState } from "react";
import { DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import LineChart from "./LineChart";
import { apiFetch, fmt } from "./dashboardUtils";
import { ADMIN_DASHBOARD_REGISTRATIONS } from "../../../helpers/Constant";

const { RangePicker } = DatePicker;

const PRESETS = [
    { key: "today", label: "Today"   },
    { key: "7d",    label: "7 Days"  },
    { key: "15d",   label: "15 Days" },
    { key: "30d",   label: "30 Days" },
    { key: "custom",label: "Custom"  },
];

const PresetBtn = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        style={{
            padding: "4px 13px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            background: active ? "#7c3aed" : "#f3f4f6",
            color: active ? "#fff" : "#6b7280",
            fontWeight: active ? 600 : 400,
            transition: "all 0.18s",
        }}
    >
        {children}
    </button>
);

const RegistrationChart = () => {
    const [preset, setPreset] = useState("30d");
    const [range, setRange] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const now = dayjs();
            let from, to;
            if (preset === "today") {
                from = fmt(now.startOf("day")); to = fmt(now);
            } else if (preset === "7d") {
                from = fmt(now.subtract(7, "day")); to = fmt(now);
            } else if (preset === "15d") {
                from = fmt(now.subtract(15, "day")); to = fmt(now);
            } else if (preset === "30d") {
                from = fmt(now.subtract(30, "day")); to = fmt(now);
            } else if (preset === "custom" && range) {
                from = fmt(range[0]); to = fmt(range[1]);
            }
            const res = await apiFetch(ADMIN_DASHBOARD_REGISTRATIONS, { from, to });
            setData(Array.isArray(res) ? res : []);
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }, [preset, range]);

    useEffect(() => {
        fetch();
        const id = setInterval(fetch, 30_000);
        return () => clearInterval(id);
    }, [fetch]);

    const total = data.reduce((s, d) => s + d.count, 0);

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                padding: "20px 22px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #f5f3ff",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                <div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>
                        Registrations
                    </span>
                    {total > 0 && (
                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#7c3aed",
                                background: "#f5f3ff",
                                padding: "2px 10px",
                                borderRadius: 20,
                            }}
                        >
                            {total} new
                        </span>
                    )}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {PRESETS.map((p) => (
                        <PresetBtn
                            key={p.key}
                            active={preset === p.key}
                            onClick={() => setPreset(p.key)}
                        >
                            {p.label}
                        </PresetBtn>
                    ))}
                </div>
            </div>

            {preset === "custom" && (
                <RangePicker
                    style={{ marginBottom: 14, width: "100%" }}
                    onChange={(v) => setRange(v)}
                    disabledDate={(d) => d && d > dayjs()}
                />
            )}

            {loading ? (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Spin />
                </div>
            ) : data.length === 0 ? (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 13 }}>
                    No registrations in this period
                </div>
            ) : (
                <LineChart data={data} color="#7c3aed" />
            )}
        </div>
    );
};

export default RegistrationChart;
