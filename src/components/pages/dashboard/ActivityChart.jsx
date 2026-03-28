import { useCallback, useEffect, useState } from "react";
import { DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import BarChart from "./BarChart";
import { apiFetch, fmt } from "./dashboardUtils";
import { ADMIN_DASHBOARD_APP_ACTIVITY } from "../../../helpers/Constant";

const { RangePicker } = DatePicker;

const PERIODS = [
    { key: "1h",     label: "Last Hour" },
    { key: "1d",     label: "Today"     },
    { key: "7d",     label: "7 Days"    },
    { key: "30d",    label: "30 Days"   },
    { key: "custom", label: "Custom"    },
];

const PeriodBtn = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        style={{
            padding: "4px 13px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            background: active ? "#2758d1" : "#f3f4f6",
            color: active ? "#fff" : "#6b7280",
            fontWeight: active ? 600 : 400,
            transition: "all 0.18s",
        }}
    >
        {children}
    </button>
);

const ActivityChart = () => {
    const [period, setPeriod] = useState("1d");
    const [range, setRange] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const params = { period };
            if (period === "custom" && range) {
                params.from = fmt(range[0]);
                params.to = fmt(range[1]);
            }
            const res = await apiFetch(ADMIN_DASHBOARD_APP_ACTIVITY, params);
            setData(Array.isArray(res) ? res : []);
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }, [period, range]);

    useEffect(() => {
        fetch();
        const id = setInterval(fetch, 30_000);
        return () => clearInterval(id);
    }, [fetch]);

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
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>
                    App Usage
                </span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {PERIODS.map((p) => (
                        <PeriodBtn
                            key={p.key}
                            active={period === p.key}
                            onClick={() => setPeriod(p.key)}
                        >
                            {p.label}
                        </PeriodBtn>
                    ))}
                </div>
            </div>

            {period === "custom" && (
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
                    No activity data yet
                </div>
            ) : (
                <BarChart data={data} />
            )}

            <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 8, textAlign: "right" }}>
                Unique active users per time bucket
            </div>
        </div>
    );
};

export default ActivityChart;
