import { useState, useCallback, useEffect } from "react";
import { DatePicker } from "antd";
import { FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { apiFetch, fmt } from "./dashboardUtils";
import { GET_ALL_INVOICE, CURRENCY } from "../../../helpers/Constant";
import { n, cur } from "./dashboardUtils";

const { RangePicker } = DatePicker;

// ── Type order matches the Invoice model enum ─────────────────────────────────

const TYPE_ORDER = [
    "Monthly Fee",
    "RFID Card",
    "SMS",
    "Door setup",
    "Gym Assistant Software",
    "Custom Gym Management Software",
    "Server Bill",
    "Service Charge",
    "Biotime License",
    "Facebook marketing",
    "Aws",
    "Client Visit",
    "Sales Comission",
    "Others",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Group invoice array by their `type` field; preserve TYPE_ORDER then alpha. */
const groupByType = (invoices) => {
    const map = {};
    for (const inv of invoices) {
        const t = inv.type || "Others";
        if (!map[t]) {
            map[t] = {
                type: t,
                totalAmount: 0,
                discount: 0,
                finalPrice: 0,
                totalPaid: 0,
                due: 0,
                count: 0,
                invoices: [],
            };
        }
        map[t].totalAmount += n(inv.totalAmount);
        map[t].discount    += n(inv.discount);
        map[t].finalPrice  += n(inv.finalPrice);
        map[t].totalPaid   += n(inv.totalPaid);
        map[t].due         += n(inv.due);
        map[t].count       += 1;
        map[t].invoices.push(inv);
    }
    const ordered = TYPE_ORDER.filter((t) => map[t]).map((t) => map[t]);
    const rest = Object.keys(map)
        .filter((t) => !TYPE_ORDER.includes(t))
        .sort()
        .map((t) => map[t]);
    return [...ordered, ...rest];
};

/** Sum a field across grouped rows. */
const sectionTotals = (rows) =>
    rows.reduce(
        (acc, r) => ({
            totalAmount: acc.totalAmount + r.totalAmount,
            discount:    acc.discount    + r.discount,
            finalPrice:  acc.finalPrice  + r.finalPrice,
            totalPaid:   acc.totalPaid   + r.totalPaid,
            due:         acc.due         + r.due,
            count:       acc.count       + r.count,
        }),
        { totalAmount: 0, discount: 0, finalPrice: 0, totalPaid: 0, due: 0, count: 0 }
    );

const fmtDate = (d) => (d ? dayjs(d).format("DD MMM YY") : "—");
const gymName = (inv) => inv.gym?.gymName || inv.gym?.name || "—";

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
    card: {
        background: "#fff",
        borderRadius: 18,
        padding: "24px 26px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        border: "1px solid #f0f4ff",
    },
    pill: (color) => ({
        background: color + "18",
        color,
        borderRadius: 20,
        padding: "3px 14px",
        fontSize: 12,
        fontWeight: 700,
        border: `1px solid ${color}30`,
    }),
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
    },
    th: (accent) => ({
        background: accent + "10",
        color: accent,
        fontWeight: 700,
        padding: "10px 12px",
        textAlign: "left",
        borderBottom: `2px solid ${accent}30`,
        whiteSpace: "nowrap",
    }),
    thR: (accent) => ({
        background: accent + "10",
        color: accent,
        fontWeight: 700,
        padding: "10px 12px",
        textAlign: "right",
        borderBottom: `2px solid ${accent}30`,
        whiteSpace: "nowrap",
    }),
    td:  { padding: "9px 12px", borderBottom: "1px solid #f3f4f6", color: "#374151" },
    tdR: { padding: "9px 12px", borderBottom: "1px solid #f3f4f6", color: "#374151",
           textAlign: "right", fontVariantNumeric: "tabular-nums" },
    totalRow: (color) => ({
        background: color + "08",
        fontWeight: 700,
    }),
    grossBanner: (positive) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: positive ? "#f0fdf4" : "#fff1f2",
        border: `1.5px solid ${positive ? "#16a34a" : "#ef4444"}40`,
        borderRadius: 14,
        padding: "18px 24px",
        marginTop: 20,
    }),
};

// ── Summary table (screen) ────────────────────────────────────────────────────

const TypeTable = ({ rows, accent, totals }) => (
    <table style={S.table}>
        <thead>
            <tr>
                {["Type","Count","Total Amount","Discount","Final Price","Paid","Due"].map((h, i) => (
                    <th key={h} style={i < 2 ? S.th(accent) : S.thR(accent)}>{h}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((r) => (
                <tr key={r.type}>
                    <td style={S.td}>{r.type}</td>
                    <td style={S.td}>{r.count}</td>
                    <td style={S.tdR}>{CURRENCY}{cur(r.totalAmount)}</td>
                    <td style={{ ...S.tdR, color: "#f97316" }}>{CURRENCY}{cur(r.discount)}</td>
                    <td style={S.tdR}>{CURRENCY}{cur(r.finalPrice)}</td>
                    <td style={{ ...S.tdR, color: "#16a34a", fontWeight: 600 }}>{CURRENCY}{cur(r.totalPaid)}</td>
                    <td style={{ ...S.tdR, color: r.due > 0 ? "#ef4444" : "#9ca3af" }}>{CURRENCY}{cur(r.due)}</td>
                </tr>
            ))}
            <tr style={S.totalRow(accent)}>
                <td style={{ ...S.td, color: accent, fontWeight: 700 }}>Total</td>
                <td style={{ ...S.td, color: accent, fontWeight: 700 }}>{totals.count}</td>
                <td style={{ ...S.tdR, color: accent, fontWeight: 700 }}>{CURRENCY}{cur(totals.totalAmount)}</td>
                <td style={{ ...S.tdR, color: "#f97316", fontWeight: 700 }}>{CURRENCY}{cur(totals.discount)}</td>
                <td style={{ ...S.tdR, color: accent, fontWeight: 700 }}>{CURRENCY}{cur(totals.finalPrice)}</td>
                <td style={{ ...S.tdR, color: "#16a34a", fontWeight: 700 }}>{CURRENCY}{cur(totals.totalPaid)}</td>
                <td style={{ ...S.tdR, color: "#ef4444", fontWeight: 700 }}>{CURRENCY}{cur(totals.due)}</td>
            </tr>
        </tbody>
    </table>
);

// ── PDF export ────────────────────────────────────────────────────────────────

const exportPdf = ({ incomeRows, expenseRows, incomeTotals, expenseTotals, dateLabel }) => {
    const grossPaid  = incomeTotals.totalPaid  - expenseTotals.totalPaid;
    const grossFinal = incomeTotals.finalPrice - expenseTotals.finalPrice;
    const isPos      = grossPaid >= 0;

    /** Render a full-detail section: one sub-table per type with individual invoices. */
    const sectionHtml = (rows, totals, accentHex, label) => {
        if (rows.length === 0) return `<p class="empty">No ${label} invoices in this period.</p>`;

        const typeTables = rows.map((r) => {
            const itemsCol = r.invoices.some((inv) => (inv.items || []).length > 0);
            const invoiceRows = r.invoices.map((inv) => {
                const itemsStr = (inv.items || [])
                    .map((it) => `${it.title || ""}${it.quantity && it.quantity !== 1 ? ` ×${it.quantity}` : ""}${it.unitPrice ? ` @ ${CURRENCY}${it.unitPrice}` : ""}`)
                    .filter(Boolean)
                    .join("; ");
                return `
                    <tr>
                        <td>${fmtDate(inv.date)}</td>
                        <td>${gymName(inv)}</td>
                        <td class="inv-id">${inv.invoiceId || "—"}</td>
                        ${itemsCol ? `<td class="items-cell">${itemsStr || "—"}</td>` : ""}
                        <td class="num">${CURRENCY}${cur(inv.totalAmount)}</td>
                        <td class="num orange">${CURRENCY}${cur(inv.discount)}</td>
                        <td class="num">${CURRENCY}${cur(inv.finalPrice)}</td>
                        <td class="num green">${CURRENCY}${cur(inv.totalPaid)}</td>
                        <td class="num ${n(inv.due) > 0 ? "red" : "muted"}">${CURRENCY}${cur(inv.due)}</td>
                    </tr>`;
            }).join("");

            return `
                <div class="type-block">
                    <div class="type-title" style="border-left:4px solid ${accentHex}">
                        ${r.type}
                        <span class="count-badge">${r.count} invoice${r.count !== 1 ? "s" : ""}</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Gym</th>
                                <th>Invoice #</th>
                                ${itemsCol ? "<th>Items</th>" : ""}
                                <th class="num">Total Amt</th>
                                <th class="num">Discount</th>
                                <th class="num">Final Price</th>
                                <th class="num">Paid</th>
                                <th class="num">Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoiceRows}
                            <tr class="subtotal" style="background:${accentHex}0d">
                                <td colspan="${itemsCol ? 4 : 3}"><strong>${r.type} Total</strong></td>
                                <td class="num"><strong>${CURRENCY}${cur(r.totalAmount)}</strong></td>
                                <td class="num orange"><strong>${CURRENCY}${cur(r.discount)}</strong></td>
                                <td class="num"><strong>${CURRENCY}${cur(r.finalPrice)}</strong></td>
                                <td class="num green"><strong>${CURRENCY}${cur(r.totalPaid)}</strong></td>
                                <td class="num red"><strong>${CURRENCY}${cur(r.due)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>`;
        }).join("");

        return `
            <div class="section">
                <div class="section-heading" style="color:${accentHex}">
                    ${label} — Breakdown by Type
                </div>
                ${typeTables}
                <table class="grand-table">
                    <thead>
                        <tr style="background:${accentHex}15">
                            <th colspan="4"><strong>${label} Grand Total</strong></th>
                            <th class="num">${CURRENCY}${cur(totals.totalAmount)}</th>
                            <th class="num">${CURRENCY}${cur(totals.discount)}</th>
                            <th class="num">${CURRENCY}${cur(totals.finalPrice)}</th>
                            <th class="num">${CURRENCY}${cur(totals.totalPaid)}</th>
                            <th class="num">${CURRENCY}${cur(totals.due)}</th>
                        </tr>
                    </thead>
                </table>
            </div>`;
    };

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Invoice Report — ${dateLabel}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a2e; padding: 28px 32px; }
  h1 { font-size: 20px; font-weight: 800; margin-bottom: 2px; }
  .sub-head { font-size: 12px; color: #6b7280; margin-bottom: 28px; }

  .section { margin-bottom: 36px; page-break-inside: avoid; }
  .section-heading { font-size: 15px; font-weight: 800; margin-bottom: 16px;
                     padding-bottom: 6px; border-bottom: 2px solid currentColor; }

  .type-block { margin-bottom: 20px; }
  .type-title { font-size: 12px; font-weight: 700; padding: 6px 10px;
                background: #f9fafb; margin-bottom: 0; color: #374151; }
  .count-badge { margin-left: 8px; font-size: 10px; font-weight: 500;
                 color: #6b7280; background: #f3f4f6;
                 padding: 1px 8px; border-radius: 10px; }

  table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  th { padding: 7px 8px; text-align: left; font-size: 10px; font-weight: 700;
       border-bottom: 1.5px solid #e5e7eb; background: #f9fafb; color: #374151; }
  td { padding: 6px 8px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  th.num, td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.items-cell { color: #6b7280; font-size: 9.5px; max-width: 160px; }
  td.inv-id { color: #9ca3af; font-size: 10px; }
  td.green { color: #16a34a; font-weight: 600; }
  td.red { color: #dc2626; }
  td.orange { color: #f97316; }
  td.muted { color: #9ca3af; }
  tr.subtotal td { font-weight: 700; border-top: 1.5px solid #e5e7eb; }
  .grand-table { margin-top: 4px; }

  .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 24px 0; }
  .summary-item { background: #f9fafb; border-radius: 8px; padding: 10px 14px; border-left: 3px solid; }
  .summary-label { font-size: 10px; color: #6b7280; margin-bottom: 3px; }
  .summary-value { font-size: 14px; font-weight: 800; font-variant-numeric: tabular-nums; }

  .gross-box { display: flex; justify-content: space-between; align-items: center;
               border-radius: 10px; padding: 16px 22px; border: 2px solid; margin-top: 4px; }
  .gross-positive { border-color: #16a34a; background: #f0fdf4; }
  .gross-negative { border-color: #dc2626; background: #fff1f2; }
  .gross-label { font-size: 14px; font-weight: 700; }
  .gross-sub { font-size: 10px; color: #6b7280; margin-top: 3px; }
  .gross-value { font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums; }

  .empty { color: #9ca3af; font-size: 12px; padding: 12px 0; }

  @media print {
    body { padding: 12px 16px; }
    .type-block { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <h1>Invoice Report</h1>
  <div class="sub-head">${dateLabel}</div>

  ${sectionHtml(incomeRows, incomeTotals, "#0369a1", "Income")}
  ${sectionHtml(expenseRows, expenseTotals, "#dc2626", "Expense")}

  <div class="summary-grid">
    <div class="summary-item" style="border-color:#0369a1">
      <div class="summary-label">Income — Final Price</div>
      <div class="summary-value" style="color:#0369a1">${CURRENCY}${cur(incomeTotals.finalPrice)}</div>
    </div>
    <div class="summary-item" style="border-color:#dc2626">
      <div class="summary-label">Expense — Final Price</div>
      <div class="summary-value" style="color:#dc2626">${CURRENCY}${cur(expenseTotals.finalPrice)}</div>
    </div>
    <div class="summary-item" style="border-color:${grossFinal >= 0 ? "#16a34a" : "#dc2626"}">
      <div class="summary-label">Net Revenue (Final Price)</div>
      <div class="summary-value" style="color:${grossFinal >= 0 ? "#16a34a" : "#dc2626"}">${grossFinal >= 0 ? "+" : ""}${CURRENCY}${cur(grossFinal)}</div>
    </div>
    <div class="summary-item" style="border-color:#16a34a">
      <div class="summary-label">Income — Paid</div>
      <div class="summary-value" style="color:#16a34a">${CURRENCY}${cur(incomeTotals.totalPaid)}</div>
    </div>
    <div class="summary-item" style="border-color:#dc2626">
      <div class="summary-label">Expense — Paid</div>
      <div class="summary-value" style="color:#dc2626">${CURRENCY}${cur(expenseTotals.totalPaid)}</div>
    </div>
    <div class="summary-item" style="border-color:#f97316">
      <div class="summary-label">Income — Due</div>
      <div class="summary-value" style="color:#f97316">${CURRENCY}${cur(incomeTotals.due)}</div>
    </div>
  </div>

  <div class="gross-box ${isPos ? "gross-positive" : "gross-negative"}">
    <div>
      <div class="gross-label" style="color:${isPos ? "#166534" : "#991b1b"}">
        Gross Income (Collected)
      </div>
      <div class="gross-sub">
        Income Paid &minus; Expense Paid &nbsp;=&nbsp;
        <strong>${CURRENCY}${cur(incomeTotals.totalPaid)}</strong> &minus;
        <strong>${CURRENCY}${cur(expenseTotals.totalPaid)}</strong>
      </div>
    </div>
    <div class="gross-value" style="color:${isPos ? "#16a34a" : "#dc2626"}">
      ${isPos ? "+" : ""}${CURRENCY}${cur(grossPaid)}
    </div>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, "_blank");
    win?.addEventListener("unload", () => URL.revokeObjectURL(url));
};

// ── Main component ────────────────────────────────────────────────────────────

const InvoiceReport = () => {
    const defaultFrom = dayjs().startOf("month");
    const defaultTo   = dayjs();

    const [range,       setRange]       = useState([defaultFrom, defaultTo]);
    const [incomeRows,  setIncomeRows]  = useState([]);
    const [expenseRows, setExpenseRows] = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [fetched,     setFetched]     = useState(false);

    const fetchData = useCallback(async (from, to) => {
        setLoading(true);
        try {
            const params = { from: fmt(from), to: fmt(to), size: 10000 };
            const [incData, expData] = await Promise.all([
                apiFetch(GET_ALL_INVOICE, { ...params, invoiceType: "Income"  }),
                apiFetch(GET_ALL_INVOICE, { ...params, invoiceType: "Expense" }),
            ]);
            setIncomeRows(groupByType(incData?.content  || []));
            setExpenseRows(groupByType(expData?.content || []));
            setFetched(true);
        } catch (e) {
            console.error("InvoiceReport fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchData(defaultFrom, defaultTo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRangeChange = (dates) => {
        if (!dates) return;
        setRange(dates);
        fetchData(dates[0], dates[1]);
    };

    const incomeTotals  = sectionTotals(incomeRows);
    const expenseTotals = sectionTotals(expenseRows);
    const grossPaid     = incomeTotals.totalPaid  - expenseTotals.totalPaid;
    const grossFinal    = incomeTotals.finalPrice - expenseTotals.finalPrice;
    const isPositive    = grossPaid >= 0;

    const dateLabel = range
        ? `${range[0].format("DD MMM YYYY")} — ${range[1].format("DD MMM YYYY")}`
        : "";

    return (
        <div style={S.card}>

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                          flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>
                        Income &amp; Expense Report
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                        Type-wise breakdown · gross income
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <RangePicker
                        value={range}
                        onChange={onRangeChange}
                        format="DD MMM YYYY"
                        allowClear={false}
                        size="middle"
                    />
                    <button
                        onClick={() => fetchData(range[0], range[1])}
                        disabled={loading}
                        style={{ display: "flex", alignItems: "center", gap: 6,
                                 border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 14px",
                                 background: "#fff", cursor: loading ? "not-allowed" : "pointer",
                                 color: "#374151", fontSize: 13, fontWeight: 500 }}
                    >
                        <ReloadOutlined spin={loading} />
                        {loading ? "Loading…" : "Refresh"}
                    </button>

                    {fetched && (
                        <button
                            onClick={() => exportPdf({ incomeRows, expenseRows,
                                                       incomeTotals, expenseTotals, dateLabel })}
                            style={{ display: "flex", alignItems: "center", gap: 6,
                                     border: "none", borderRadius: 8, padding: "6px 16px",
                                     background: "#1a1a2e", cursor: "pointer",
                                     color: "#fff", fontSize: 13, fontWeight: 600 }}
                        >
                            <FilePdfOutlined />
                            Export PDF
                        </button>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "52px 0", color: "#9ca3af", fontSize: 14 }}>
                    Loading report…
                </div>
            ) : !fetched ? null : (
                <>
                    {/* ── Income ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={S.pill("#0369a1")}>INCOME</span>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                            {incomeRows.length} type{incomeRows.length !== 1 ? "s" : ""}
                            &nbsp;·&nbsp;{incomeTotals.count} invoice{incomeTotals.count !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {incomeRows.length === 0 ? (
                        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24, padding: "10px 0" }}>
                            No income invoices in this period.
                        </p>
                    ) : (
                        <div style={{ overflowX: "auto", marginBottom: 28,
                                      borderRadius: 10, border: "1px solid #bae6fd" }}>
                            <TypeTable rows={incomeRows} accent="#0369a1" totals={incomeTotals} />
                        </div>
                    )}

                    {/* ── Expense ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={S.pill("#dc2626")}>EXPENSE</span>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                            {expenseRows.length} type{expenseRows.length !== 1 ? "s" : ""}
                            &nbsp;·&nbsp;{expenseTotals.count} invoice{expenseTotals.count !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {expenseRows.length === 0 ? (
                        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 8, padding: "10px 0" }}>
                            No expense invoices in this period.
                        </p>
                    ) : (
                        <div style={{ overflowX: "auto", marginBottom: 8,
                                      borderRadius: 10, border: "1px solid #fecaca" }}>
                            <TypeTable rows={expenseRows} accent="#dc2626" totals={expenseTotals} />
                        </div>
                    )}

                    {/* ── Summary strip ── */}
                    <div style={{ display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                  gap: 10, marginTop: 20 }}>
                        {[
                            { label: "Income Final Price",  value: incomeTotals.finalPrice,  color: "#0369a1" },
                            { label: "Expense Final Price", value: expenseTotals.finalPrice, color: "#dc2626" },
                            { label: "Net Revenue",         value: grossFinal,
                              color: grossFinal >= 0 ? "#16a34a" : "#dc2626" },
                            { label: "Income Paid",         value: incomeTotals.totalPaid,   color: "#16a34a" },
                            { label: "Expense Paid",        value: expenseTotals.totalPaid,  color: "#dc2626" },
                            { label: "Income Due",          value: incomeTotals.due,         color: "#f97316" },
                        ].map((item) => (
                            <div key={item.label}
                                 style={{ background: "#f9fafb", borderRadius: 10,
                                          padding: "12px 14px", borderLeft: `3px solid ${item.color}` }}>
                                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>
                                    {item.label}
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: item.color,
                                              fontVariantNumeric: "tabular-nums" }}>
                                    {CURRENCY}{cur(item.value)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Gross income banner ── */}
                    <div style={S.grossBanner(isPositive)}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700,
                                          color: isPositive ? "#166534" : "#991b1b" }}>
                                Gross Income (Collected)
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                                Income Paid − Expense Paid &nbsp;=&nbsp;
                                <strong>{CURRENCY}{cur(incomeTotals.totalPaid)}</strong>
                                &nbsp;−&nbsp;
                                <strong>{CURRENCY}{cur(expenseTotals.totalPaid)}</strong>
                            </div>
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums",
                                      color: isPositive ? "#16a34a" : "#dc2626" }}>
                            {isPositive ? "+" : ""}
                            {CURRENCY}{cur(grossPaid)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoiceReport;
