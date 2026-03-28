import moment from "moment";
import dayjs from "dayjs";
import {
    DollarOutlined,
    RiseOutlined,
    FallOutlined,
    BarChartOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_INVOICE, CURRENCY } from "../../../helpers/Constant";
import { n, cur } from "./dashboardUtils";

// First day of current month
const getMonthStart = () => {
    let d = new Date();
    d.setDate(1);
    return dayjs(moment(d).format("DD MMMM YYYY"));
};

const KpiCard = ({ icon, title, primary, primaryLabel, rows, accent, iconBg }) => (
    <div
        style={{
            background: "#fff",
            borderRadius: 18,
            padding: "20px 22px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            border: "1px solid #f0f4ff",
            flex: "1 1 220px",
            minWidth: 0,
            position: "relative",
            overflow: "hidden",
        }}
    >
        {/* Accent bar */}
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: accent,
                borderRadius: "18px 18px 0 0",
            }}
        />

        {/* Icon */}
        <div
            style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: accent,
                marginBottom: 14,
            }}
        >
            {icon}
        </div>

        <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>
            {title}
        </div>
        <div
            style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.1,
                marginBottom: 2,
            }}
        >
            {CURRENCY}{primary}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 14 }}>{primaryLabel}</div>

        <div
            style={{
                borderTop: "1px solid #f5f5f5",
                paddingTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
            }}
        >
            {rows.map((row) => (
                <div
                    key={row.label}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{row.label}</span>
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: row.color || "#374151",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                        }}
                    >
                        {row.arrow === "up" && (
                            <ArrowUpOutlined style={{ fontSize: 10 }} />
                        )}
                        {row.arrow === "down" && (
                            <ArrowDownOutlined style={{ fontSize: 10 }} />
                        )}
                        {CURRENCY}{row.value}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const FinancialSummary = () => {
    const today = getMonthStart();

    const { summary } = useGetAllData(`${GET_ALL_INVOICE}?from=${today}`);
    const { summary: monthly } = useGetAllData(
        `${GET_ALL_INVOICE}?from=${today}&type=Monthly Fee`
    );
    const { summary: expense } = useGetAllData(
        `${GET_ALL_INVOICE}?from=${today}&invoiceType=Expense`
    );

    const revenue = n(summary?.totalFinalPrice) - n(expense?.totalFinalPrice);
    const balance = n(summary?.totalCollection) - n(expense?.totalCollection);
    const totalDue = n(summary?.totalFinalPrice) - n(summary?.totalPaid);
    const monthlyDue = n(monthly?.totalFinalPrice) - n(monthly?.totalPaid);

    return (
        <div>
            <div style={{ marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>
                    This Month — Financial Overview
                </span>
                <span
                    style={{
                        marginLeft: 10,
                        fontSize: 12,
                        color: "#9ca3af",
                        background: "#f0f4ff",
                        padding: "2px 10px",
                        borderRadius: 20,
                    }}
                >
                    {moment().format("MMMM YYYY")}
                </span>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {/* Total */}
                <KpiCard
                    icon={<BarChartOutlined />}
                    title="Total Invoiced"
                    primary={cur(summary?.totalFinalPrice)}
                    primaryLabel="all invoice types"
                    accent="#2758d1"
                    iconBg="#eef2ff"
                    rows={[
                        {
                            label: "Monthly Fee",
                            value: cur(monthly?.totalFinalPrice),
                        },
                        {
                            label: "Expenses",
                            value: cur(expense?.totalFinalPrice),
                            color: "#ef4444",
                            arrow: "down",
                        },
                        {
                            label: "Net Revenue",
                            value: cur(revenue),
                            color: revenue >= 0 ? "#16a34a" : "#ef4444",
                            arrow: revenue >= 0 ? "up" : "down",
                        },
                    ]}
                />

                {/* Collected */}
                <KpiCard
                    icon={<RiseOutlined />}
                    title="Collected"
                    primary={cur(summary?.totalCollection)}
                    primaryLabel="actual payments received"
                    accent="#16a34a"
                    iconBg="#f0fdf4"
                    rows={[
                        {
                            label: "Monthly Fee",
                            value: cur(monthly?.totalCollection),
                            color: "#16a34a",
                            arrow: "up",
                        },
                        {
                            label: "Expenses",
                            value: cur(expense?.totalCollection),
                            color: "#ef4444",
                            arrow: "down",
                        },
                        {
                            label: "Balance",
                            value: cur(balance),
                            color: balance >= 0 ? "#16a34a" : "#ef4444",
                            arrow: balance >= 0 ? "up" : "down",
                        },
                    ]}
                />

                {/* Due */}
                <KpiCard
                    icon={<FallOutlined />}
                    title="Outstanding Due"
                    primary={cur(totalDue)}
                    primaryLabel="unpaid amount"
                    accent="#ef4444"
                    iconBg="#fff1f2"
                    rows={[
                        {
                            label: "Monthly Fee Due",
                            value: cur(monthlyDue),
                            color: "#ef4444",
                            arrow: "down",
                        },
                        {
                            label: "Expense Due",
                            value: cur(n(expense?.totalFinalPrice) - n(expense?.totalPaid)),
                            color: "#f97316",
                        },
                    ]}
                />

                {/* Summary */}
                <KpiCard
                    icon={<DollarOutlined />}
                    title="Net Summary"
                    primary={cur(balance)}
                    primaryLabel="current balance"
                    accent="#7c3aed"
                    iconBg="#f5f3ff"
                    rows={[
                        {
                            label: "Gross Revenue",
                            value: cur(
                                n(summary?.totalCollection) - n(expense?.totalFinalPrice)
                            ),
                            color: "#7c3aed",
                            arrow: "up",
                        },
                        {
                            label: "Total Invoiced",
                            value: cur(summary?.totalFinalPrice),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default FinancialSummary;
