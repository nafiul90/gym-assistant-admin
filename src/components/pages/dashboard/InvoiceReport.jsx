import { useState, useCallback, useEffect } from "react";
import { DatePicker } from "antd";
import { FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { apiFetch, fmt } from "./dashboardUtils";
import { GET_INVOICE_INCOME_REPORT, CURRENCY } from "../../../helpers/Constant";
import { n, cur } from "./dashboardUtils";

const { RangePicker } = DatePicker;

// ── Type order (matches Invoice model enum) ───────────────────────────────────

const TYPE_ORDER = [
    "Monthly Fee", "RFID Card", "SMS", "Door setup",
    "Gym Assistant Software", "Custom Gym Management Software",
    "Server Bill", "Service Charge", "Biotime License",
    "Facebook marketing", "Aws", "Client Visit", "Sales Comission", "Others",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Group Invoice docs by type, preserving TYPE_ORDER then alpha. */
const groupInvoices = (invoices) => {
    const map = {};
    for (const inv of invoices) {
        const t = inv.type || "Others";
        if (!map[t]) map[t] = { type: t, totalAmount: 0, discount: 0,
                                 finalPrice: 0, totalPaid: 0, due: 0,
                                 count: 0, invoices: [] };
        map[t].totalAmount += n(inv.totalAmount);
        map[t].discount    += n(inv.discount);
        map[t].finalPrice  += n(inv.finalPrice);
        map[t].totalPaid   += n(inv.totalPaid);
        map[t].due         += n(inv.due);
        map[t].count       += 1;
        map[t].invoices.push(inv);
    }
    return sortByTypeOrder(map);
};

/**
 * Group GymPayment docs (previousDueCollections) by their invoice's type.
 * The key metric here is `paidAmount` (what was actually collected).
 */
const groupPayments = (payments) => {
    const map = {};
    for (const p of payments) {
        const t = p.invoice?.type || "Others";
        if (!map[t]) map[t] = { type: t, paidAmount: 0, count: 0, payments: [] };
        map[t].paidAmount += n(p.paidAmount);
        map[t].count      += 1;
        map[t].payments.push(p);
    }
    return sortByTypeOrder(map);
};

const sortByTypeOrder = (map) => {
    const ordered = TYPE_ORDER.filter((t) => map[t]).map((t) => map[t]);
    const rest    = Object.keys(map)
        .filter((t) => !TYPE_ORDER.includes(t))
        .sort()
        .map((t) => map[t]);
    return [...ordered, ...rest];
};

const sectionTotals = (rows) =>
    rows.reduce(
        (acc, r) => ({
            totalAmount: acc.totalAmount + n(r.totalAmount),
            discount:    acc.discount    + n(r.discount),
            finalPrice:  acc.finalPrice  + n(r.finalPrice),
            totalPaid:   acc.totalPaid   + n(r.totalPaid),
            due:         acc.due         + n(r.due),
            count:       acc.count       + r.count,
        }),
        { totalAmount: 0, discount: 0, finalPrice: 0, totalPaid: 0, due: 0, count: 0 }
    );

const paymentSectionTotals = (rows) =>
    rows.reduce(
        (acc, r) => ({ paidAmount: acc.paidAmount + n(r.paidAmount), count: acc.count + r.count }),
        { paidAmount: 0, count: 0 }
    );

const fmtDate = (d) => (d ? dayjs(d).format("DD MMM YY") : "—");
const gymName = (doc) => doc?.gym?.gymName || doc?.gym?.name || "—";

// ── Style helpers ─────────────────────────────────────────────────────────────

const S = {
    card: {
        background: "#fff", borderRadius: 18, padding: "24px 26px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #f0f4ff",
    },
    pill: (color) => ({
        background: color + "18", color, borderRadius: 20, padding: "3px 14px",
        fontSize: 12, fontWeight: 700, border: `1px solid ${color}30`,
    }),
    subPill: (color) => ({
        background: color + "12", color, borderRadius: 12, padding: "2px 10px",
        fontSize: 11, fontWeight: 600, border: `1px solid ${color}25`,
    }),
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th:  (a) => ({ background: a + "10", color: a, fontWeight: 700, padding: "9px 11px",
                   textAlign: "left",  borderBottom: `2px solid ${a}30`, whiteSpace: "nowrap" }),
    thR: (a) => ({ background: a + "10", color: a, fontWeight: 700, padding: "9px 11px",
                   textAlign: "right", borderBottom: `2px solid ${a}30`, whiteSpace: "nowrap" }),
    td:  { padding: "8px 11px", borderBottom: "1px solid #f3f4f6", color: "#374151" },
    tdR: { padding: "8px 11px", borderBottom: "1px solid #f3f4f6", color: "#374151",
           textAlign: "right", fontVariantNumeric: "tabular-nums" },
    totalRow: (c) => ({ background: c + "08", fontWeight: 700 }),
    subSection: (color) => ({
        border: `1px solid ${color}30`, borderRadius: 10, overflow: "hidden", marginBottom: 16,
    }),
    subSectionHead: (color) => ({
        background: color + "08", padding: "8px 14px", display: "flex",
        alignItems: "center", gap: 8, borderBottom: `1px solid ${color}20`,
    }),
    grossBanner: (pos) => ({
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: pos ? "#f0fdf4" : "#fff1f2",
        border: `1.5px solid ${pos ? "#16a34a" : "#ef4444"}40`,
        borderRadius: 14, padding: "18px 24px", marginTop: 20,
    }),
    summaryStrip: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))",
                    gap: 10, marginTop: 20 },
    summaryItem: (color) => ({
        background: "#f9fafb", borderRadius: 10, padding: "11px 13px",
        borderLeft: `3px solid ${color}`,
    }),
};

// ── Screen tables ─────────────────────────────────────────────────────────────

const InvoiceTypeTable = ({ rows, accent, totals }) => (
    <table style={S.table}>
        <thead>
            <tr>
                {["Type","#","Total Amt","Discount","Final Price","Paid","Due"].map((h, i) => (
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

const DueCollectionTable = ({ rows, accent, totals }) => (
    <table style={S.table}>
        <thead>
            <tr>
                <th style={S.th(accent)}>Invoice Type</th>
                <th style={S.th(accent)}># Payments</th>
                <th style={S.thR(accent)}>Collected</th>
            </tr>
        </thead>
        <tbody>
            {rows.map((r) => (
                <tr key={r.type}>
                    <td style={S.td}>{r.type}</td>
                    <td style={S.td}>{r.count}</td>
                    <td style={{ ...S.tdR, color: "#16a34a", fontWeight: 600 }}>{CURRENCY}{cur(r.paidAmount)}</td>
                </tr>
            ))}
            <tr style={S.totalRow(accent)}>
                <td style={{ ...S.td, color: accent, fontWeight: 700 }}>Total</td>
                <td style={{ ...S.td, color: accent, fontWeight: 700 }}>{totals.count}</td>
                <td style={{ ...S.tdR, color: "#16a34a", fontWeight: 700 }}>{CURRENCY}{cur(totals.paidAmount)}</td>
            </tr>
        </tbody>
    </table>
);

// ── PDF export ────────────────────────────────────────────────────────────────

const buildPdf = ({
    currentRows, prevDueRows, expenseRows,
    currentTotals, prevDueTotals, expenseTotals,
    dateLabel,
}) => {
    const totalIncomePaid = currentTotals.totalPaid + prevDueTotals.paidAmount;
    const grossPaid       = totalIncomePaid - expenseTotals.totalPaid;
    const grossFinal      = currentTotals.finalPrice - expenseTotals.finalPrice;
    const isPos           = grossPaid >= 0;

    /* Detailed invoice table for a group */
    const invoiceDetailTable = (rows, accentHex) =>
        rows.map((r) => `
            <div class="type-block">
                <div class="type-title" style="border-left:4px solid ${accentHex}">
                    ${r.type}
                    <span class="badge">${r.count} invoice${r.count !== 1 ? "s" : ""}</span>
                </div>
                <table>
                    <thead><tr>
                        <th>Date</th><th>Gym</th><th>Invoice #</th><th>Items</th>
                        <th class="r">Total Amt</th><th class="r">Discount</th>
                        <th class="r">Final Price</th><th class="r">Paid</th><th class="r">Due</th>
                    </tr></thead>
                    <tbody>
                        ${r.invoices.map((inv) => {
                            const itemsStr = (inv.items || [])
                                .map((it) => [
                                    it.title,
                                    it.quantity && it.quantity !== 1 ? `×${it.quantity}` : "",
                                    it.unitPrice ? `@ ${CURRENCY}${it.unitPrice}` : "",
                                ].filter(Boolean).join(" "))
                                .filter(Boolean).join("; ");
                            return `<tr>
                                <td>${fmtDate(inv.date)}</td>
                                <td>${gymName(inv)}</td>
                                <td class="muted">${inv.invoiceId || "—"}</td>
                                <td class="items">${itemsStr || "—"}</td>
                                <td class="r">${CURRENCY}${cur(inv.totalAmount)}</td>
                                <td class="r orange">${CURRENCY}${cur(inv.discount)}</td>
                                <td class="r">${CURRENCY}${cur(inv.finalPrice)}</td>
                                <td class="r green">${CURRENCY}${cur(inv.totalPaid)}</td>
                                <td class="r ${n(inv.due) > 0 ? "red" : "muted"}">${CURRENCY}${cur(inv.due)}</td>
                            </tr>`;
                        }).join("")}
                        <tr class="sub" style="background:${accentHex}0c">
                            <td colspan="4"><strong>${r.type} Subtotal</strong></td>
                            <td class="r"><strong>${CURRENCY}${cur(r.totalAmount)}</strong></td>
                            <td class="r orange"><strong>${CURRENCY}${cur(r.discount)}</strong></td>
                            <td class="r"><strong>${CURRENCY}${cur(r.finalPrice)}</strong></td>
                            <td class="r green"><strong>${CURRENCY}${cur(r.totalPaid)}</strong></td>
                            <td class="r red"><strong>${CURRENCY}${cur(r.due)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>`).join("");

    /* Detailed payment table for previous-due rows */
    const prevDueDetailTable = (rows, accentHex) =>
        rows.map((r) => `
            <div class="type-block">
                <div class="type-title" style="border-left:4px solid ${accentHex}">
                    ${r.type}
                    <span class="badge">${r.count} payment${r.count !== 1 ? "s" : ""}</span>
                </div>
                <table>
                    <thead><tr>
                        <th>Collected On</th><th>Gym</th>
                        <th>Invoice #</th><th>Invoice Date</th>
                        <th class="r">Collected</th>
                    </tr></thead>
                    <tbody>
                        ${r.payments.map((p) => `<tr>
                            <td>${fmtDate(p.date)}</td>
                            <td>${gymName(p.invoice)}</td>
                            <td class="muted">${p.invoice?.invoiceId || "—"}</td>
                            <td class="muted">${fmtDate(p.invoice?.date)}</td>
                            <td class="r green"><strong>${CURRENCY}${cur(p.paidAmount)}</strong></td>
                        </tr>`).join("")}
                        <tr class="sub" style="background:${accentHex}0c">
                            <td colspan="4"><strong>${r.type} Subtotal</strong></td>
                            <td class="r green"><strong>${CURRENCY}${cur(r.paidAmount)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>`).join("");

    const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<title>Invoice Report — ${dateLabel}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:11px;color:#1a1a2e;padding:28px 32px}
  h1{font-size:20px;font-weight:800;margin-bottom:2px}
  .sub-head{font-size:11px;color:#6b7280;margin-bottom:24px}
  .section{margin-bottom:30px}
  .section-heading{font-size:14px;font-weight:800;padding-bottom:5px;
    border-bottom:2px solid currentColor;margin-bottom:14px}
  .sub-section{margin-bottom:18px}
  .sub-heading{font-size:12px;font-weight:700;padding:6px 12px;border-radius:6px;
    margin-bottom:8px;display:inline-block}
  .type-block{margin-bottom:16px}
  .type-title{font-size:11px;font-weight:700;padding:5px 9px;background:#f9fafb;
    color:#374151;border-bottom:1px solid #e5e7eb;page-break-after:avoid}
  .badge{margin-left:8px;font-size:9px;font-weight:500;color:#6b7280;
    background:#f3f4f6;padding:1px 7px;border-radius:8px}
  table{width:100%;border-collapse:collapse;font-size:10px}
  th{padding:6px 8px;text-align:left;font-size:9.5px;font-weight:700;
    border-bottom:1.5px solid #e5e7eb;background:#f9fafb;color:#374151}
  td{padding:5px 8px;border-bottom:1px solid #f3f4f6;vertical-align:top}
  th.r,td.r{text-align:right;font-variant-numeric:tabular-nums}
  td.items{color:#6b7280;font-size:9px;max-width:140px}
  td.muted{color:#9ca3af;font-size:9.5px}
  td.green{color:#16a34a;font-weight:600}
  td.red{color:#dc2626}
  td.orange{color:#f97316}
  tr.sub td{font-weight:700;border-top:1.5px solid #e5e7eb}
  .grand{margin-top:6px}
  .grand th{background:#1a1a2e12;font-size:10.5px}
  .summary-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:20px 0}
  .si{background:#f9fafb;border-radius:7px;padding:9px 12px;border-left:3px solid}
  .sl{font-size:9px;color:#6b7280;margin-bottom:3px}
  .sv{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}
  .gross-box{display:flex;justify-content:space-between;align-items:center;
    border-radius:9px;padding:14px 20px;border:2px solid;margin-top:4px}
  .gp{border-color:#16a34a;background:#f0fdf4}
  .gn{border-color:#dc2626;background:#fff1f2}
  .g-label{font-size:13px;font-weight:700}
  .g-sub{font-size:9px;color:#6b7280;margin-top:3px}
  .g-val{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums}
  @media print{
    body{padding:10px 14px}
    .type-block{page-break-inside:auto}
    .type-title{page-break-after:avoid;break-after:avoid}
    tr{page-break-inside:avoid;break-inside:avoid}
    thead{display:table-header-group}
  }
</style></head><body>

<h1>Invoice Report</h1>
<div class="sub-head">${dateLabel}</div>

<!-- INCOME SECTION -->
<div class="section" style="color:#0369a1">
  <div class="section-heading">Income</div>

  <!-- Current period -->
  <div class="sub-section">
    <div class="sub-heading" style="background:#e0f2fe;color:#0369a1">
      New Invoices — Current Period
    </div>
    ${currentRows.length === 0
        ? "<p style='color:#9ca3af;font-size:11px;padding:8px 0'>No income invoices in this period.</p>"
        : invoiceDetailTable(currentRows, "#0369a1")}
    ${currentRows.length > 0 ? `
    <table class="grand">
      <thead><tr>
        <th colspan="4">Current Period Grand Total</th>
        <th class="r">${CURRENCY}${cur(currentTotals.totalAmount)}</th>
        <th class="r">${CURRENCY}${cur(currentTotals.discount)}</th>
        <th class="r">${CURRENCY}${cur(currentTotals.finalPrice)}</th>
        <th class="r green">${CURRENCY}${cur(currentTotals.totalPaid)}</th>
        <th class="r red">${CURRENCY}${cur(currentTotals.due)}</th>
      </tr></thead>
    </table>` : ""}
  </div>

  <!-- Previous due collections -->
  <div class="sub-section" style="margin-top:20px">
    <div class="sub-heading" style="background:#fef9c3;color:#854d0e">
      Previous Period Due — Collected This Period
    </div>
    ${prevDueRows.length === 0
        ? "<p style='color:#9ca3af;font-size:11px;padding:8px 0'>No previous-due collections in this period.</p>"
        : prevDueDetailTable(prevDueRows, "#ca8a04")}
    ${prevDueRows.length > 0 ? `
    <table class="grand">
      <thead><tr>
        <th colspan="4">Previous Due Collections Total</th>
        <th class="r green">${CURRENCY}${cur(prevDueTotals.paidAmount)}</th>
      </tr></thead>
    </table>` : ""}
  </div>
</div>

<!-- EXPENSE SECTION -->
<div class="section" style="color:#dc2626">
  <div class="section-heading">Expense</div>
  ${expenseRows.length === 0
      ? "<p style='color:#9ca3af;font-size:11px;padding:8px 0'>No expense invoices in this period.</p>"
      : invoiceDetailTable(expenseRows, "#dc2626")}
  ${expenseRows.length > 0 ? `
  <table class="grand">
    <thead><tr>
      <th colspan="4">Expense Grand Total</th>
      <th class="r">${CURRENCY}${cur(expenseTotals.totalAmount)}</th>
      <th class="r">${CURRENCY}${cur(expenseTotals.discount)}</th>
      <th class="r">${CURRENCY}${cur(expenseTotals.finalPrice)}</th>
      <th class="r red">${CURRENCY}${cur(expenseTotals.totalPaid)}</th>
      <th class="r red">${CURRENCY}${cur(expenseTotals.due)}</th>
    </tr></thead>
  </table>` : ""}
</div>

<!-- SUMMARY -->
<div class="summary-grid">
  <div class="si" style="border-color:#0369a1">
    <div class="sl">Current Income (Final Price)</div>
    <div class="sv" style="color:#0369a1">${CURRENCY}${cur(currentTotals.finalPrice)}</div>
  </div>
  <div class="si" style="border-color:#16a34a">
    <div class="sl">Current Income Collected</div>
    <div class="sv" style="color:#16a34a">${CURRENCY}${cur(currentTotals.totalPaid)}</div>
  </div>
  <div class="si" style="border-color:#ca8a04">
    <div class="sl">Previous Due Collected</div>
    <div class="sv" style="color:#ca8a04">${CURRENCY}${cur(prevDueTotals.paidAmount)}</div>
  </div>
  <div class="si" style="border-color:#6366f1">
    <div class="sl">Total Cash Collected (Income)</div>
    <div class="sv" style="color:#6366f1">${CURRENCY}${cur(totalIncomePaid)}</div>
  </div>
  <div class="si" style="border-color:#dc2626">
    <div class="sl">Total Expense Paid</div>
    <div class="sv" style="color:#dc2626">${CURRENCY}${cur(expenseTotals.totalPaid)}</div>
  </div>
  <div class="si" style="border-color:${grossFinal >= 0 ? "#16a34a" : "#dc2626"}">
    <div class="sl">Net Revenue (Accrual)</div>
    <div class="sv" style="color:${grossFinal >= 0 ? "#16a34a" : "#dc2626"}">
      ${grossFinal >= 0 ? "+" : ""}${CURRENCY}${cur(grossFinal)}
    </div>
  </div>
</div>

${(() => {
    const grossRevenue   = grossPaid - expenseTotals.due;
    const isRevPos       = grossRevenue >= 0;
    return `
<div class="gross-box ${isPos ? "gp" : "gn"}">
  <div>
    <div class="g-label" style="color:${isPos ? "#166534" : "#991b1b"}">Gross Income (Cash Collected)</div>
    <div class="g-sub">
      Total Income Collected &minus; Expense Paid &nbsp;=&nbsp;
      <strong>${CURRENCY}${cur(totalIncomePaid)}</strong>
      (${CURRENCY}${cur(currentTotals.totalPaid)} current + ${CURRENCY}${cur(prevDueTotals.paidAmount)} prev-due)
      &minus; <strong>${CURRENCY}${cur(expenseTotals.totalPaid)}</strong>
    </div>
  </div>
  <div class="g-val" style="color:${isPos ? "#16a34a" : "#dc2626"}">
    ${isPos ? "+" : ""}${CURRENCY}${cur(grossPaid)}
  </div>
</div>

<div class="gross-box ${isRevPos ? "gp" : "gn"}" style="margin-top:10px">
  <div>
    <div class="g-label" style="color:${isRevPos ? "#166534" : "#991b1b"}">Gross Revenue</div>
    <div class="g-sub">
      Total Income Collected &minus; Total Expense Due &nbsp;=&nbsp;
      <strong>${CURRENCY}${cur(grossPaid)}</strong>
      &minus; <strong>${CURRENCY}${cur(expenseTotals.due)}</strong>
    </div>
  </div>
  <div class="g-val" style="color:${isRevPos ? "#16a34a" : "#dc2626"}">
    ${isRevPos ? "+" : ""}${CURRENCY}${cur(grossRevenue)}
  </div>
</div>`;
})()}

<script>window.onload=()=>window.print();</script>
</body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, "_blank");
    win?.addEventListener("unload", () => URL.revokeObjectURL(url));
};

// ── Main component ────────────────────────────────────────────────────────────

const InvoiceReport = () => {
    const defaultFrom = dayjs().startOf("month");
    const defaultTo   = dayjs();

    const [range,        setRange]        = useState([defaultFrom, defaultTo]);
    const [currentRows,  setCurrentRows]  = useState([]);   // current-period income
    const [prevDueRows,  setPrevDueRows]  = useState([]);   // previous-due collections
    const [expenseRows,  setExpenseRows]  = useState([]);
    const [loading,      setLoading]      = useState(false);
    const [fetched,      setFetched]      = useState(false);

    const fetchData = useCallback(async (from, to) => {
        setLoading(true);
        try {
            const data = await apiFetch(GET_INVOICE_INCOME_REPORT, {
                from: fmt(from),
                to:   fmt(to),
            });
            setCurrentRows(groupInvoices(data?.currentInvoices        || []));
            setPrevDueRows(groupPayments(data?.previousDueCollections  || []));
            setExpenseRows(groupInvoices(data?.expenseInvoices         || []));
            setFetched(true);
        } catch (e) {
            console.error("InvoiceReport fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(defaultFrom, defaultTo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRangeChange = (dates) => {
        if (!dates) return;
        setRange(dates);
        fetchData(dates[0], dates[1]);
    };

    const currentTotals  = sectionTotals(currentRows);
    const prevDueTotals  = paymentSectionTotals(prevDueRows);
    const expenseTotals  = sectionTotals(expenseRows);

    const totalIncomePaid = currentTotals.totalPaid + prevDueTotals.paidAmount;
    const grossPaid       = totalIncomePaid - expenseTotals.totalPaid;
    const grossFinal      = currentTotals.finalPrice - expenseTotals.finalPrice;
    const isPositive      = grossPaid >= 0;

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
                        Current invoices · Previous due collections · Gross income
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
                            onClick={() => buildPdf({ currentRows, prevDueRows, expenseRows,
                                                      currentTotals, prevDueTotals, expenseTotals,
                                                      dateLabel })}
                            style={{ display: "flex", alignItems: "center", gap: 6,
                                     border: "none", borderRadius: 8, padding: "6px 16px",
                                     background: "#1a1a2e", cursor: "pointer",
                                     color: "#fff", fontSize: 13, fontWeight: 600 }}
                        >
                            <FilePdfOutlined /> Export PDF
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
                    {/* ══ INCOME ══ */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <span style={S.pill("#0369a1")}>INCOME</span>
                    </div>

                    {/* Current-period invoices */}
                    <div style={S.subSection("#0369a1")}>
                        <div style={S.subSectionHead("#0369a1")}>
                            <span style={S.subPill("#0369a1")}>New Invoices — Current Period</span>
                            <span style={{ fontSize: 11, color: "#6b7280" }}>
                                {currentTotals.count} invoice{currentTotals.count !== 1 ? "s" : ""}
                            </span>
                        </div>
                        {currentRows.length === 0 ? (
                            <p style={{ padding: "12px 14px", color: "#9ca3af", fontSize: 13 }}>
                                No income invoices in this period.
                            </p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <InvoiceTypeTable rows={currentRows} accent="#0369a1" totals={currentTotals} />
                            </div>
                        )}
                    </div>

                    {/* Previous-due collections */}
                    <div style={S.subSection("#ca8a04")}>
                        <div style={S.subSectionHead("#ca8a04")}>
                            <span style={S.subPill("#ca8a04")}>Previous Period Due — Collected This Period</span>
                            <span style={{ fontSize: 11, color: "#6b7280" }}>
                                {prevDueTotals.count} payment{prevDueTotals.count !== 1 ? "s" : ""}
                            </span>
                        </div>
                        {prevDueRows.length === 0 ? (
                            <p style={{ padding: "12px 14px", color: "#9ca3af", fontSize: 13 }}>
                                No previous-due collections in this period.
                            </p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <DueCollectionTable rows={prevDueRows} accent="#ca8a04" totals={prevDueTotals} />
                            </div>
                        )}
                    </div>

                    {/* ══ EXPENSE ══ */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8,
                                  marginTop: 20, marginBottom: 14 }}>
                        <span style={S.pill("#dc2626")}>EXPENSE</span>
                        <span style={{ fontSize: 11, color: "#6b7280" }}>
                            {expenseTotals.count} invoice{expenseTotals.count !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {expenseRows.length === 0 ? (
                        <p style={{ color: "#9ca3af", fontSize: 13, padding: "4px 0", marginBottom: 8 }}>
                            No expense invoices in this period.
                        </p>
                    ) : (
                        <div style={{ overflowX: "auto", borderRadius: 10,
                                      border: "1px solid #fecaca", marginBottom: 4 }}>
                            <InvoiceTypeTable rows={expenseRows} accent="#dc2626" totals={expenseTotals} />
                        </div>
                    )}

                    {/* ══ Summary strip ══ */}
                    <div style={S.summaryStrip}>
                        {[
                            { label: "Current Income (Final Price)",  value: currentTotals.finalPrice,  color: "#0369a1" },
                            { label: "Current Income Collected",      value: currentTotals.totalPaid,   color: "#16a34a" },
                            { label: "Previous Due Collected",        value: prevDueTotals.paidAmount,  color: "#ca8a04" },
                            { label: "Total Cash Collected (Income)", value: totalIncomePaid,            color: "#6366f1" },
                            { label: "Total Expense Paid",            value: expenseTotals.totalPaid,   color: "#dc2626" },
                            { label: `Net Revenue (Accrual)`,
                              value: grossFinal,
                              color: grossFinal >= 0 ? "#16a34a" : "#dc2626" },
                        ].map((item) => (
                            <div key={item.label} style={S.summaryItem(item.color)}>
                                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>
                                    {item.label}
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: item.color,
                                              fontVariantNumeric: "tabular-nums" }}>
                                    {typeof item.value === "number" && item.value > 0 && item.label.startsWith("Net") ? "+" : ""}
                                    {CURRENCY}{cur(item.value)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ══ Gross income banner ══ */}
                    <div style={S.grossBanner(isPositive)}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700,
                                          color: isPositive ? "#166534" : "#991b1b" }}>
                                Gross Income (Cash Collected)
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                                Total Income Collected &nbsp;−&nbsp; Expense Paid
                                &nbsp;=&nbsp;
                                <strong>{CURRENCY}{cur(totalIncomePaid)}</strong>
                                &nbsp;
                                <span style={{ fontSize: 11, color: "#9ca3af" }}>
                                    ({CURRENCY}{cur(currentTotals.totalPaid)} current
                                    &nbsp;+&nbsp;
                                    {CURRENCY}{cur(prevDueTotals.paidAmount)} prev-due)
                                </span>
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

                    {/* ══ Gross revenue banner ══ */}
                    {(() => {
                        const grossRevenue = grossPaid - expenseTotals.due;
                        const isRevPos     = grossRevenue >= 0;
                        return (
                            <div style={{ ...S.grossBanner(isRevPos), marginTop: 10 }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700,
                                                  color: isRevPos ? "#166534" : "#991b1b" }}>
                                        Gross Revenue
                                    </div>
                                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                                        Total Income Collected &nbsp;−&nbsp; Total Expense Due
                                        &nbsp;=&nbsp;
                                        <strong>{CURRENCY}{cur(grossPaid)}</strong>
                                        &nbsp;−&nbsp;
                                        <strong>{CURRENCY}{cur(expenseTotals.due)}</strong>
                                    </div>
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums",
                                              color: isRevPos ? "#16a34a" : "#dc2626" }}>
                                    {isRevPos ? "+" : ""}
                                    {CURRENCY}{cur(grossRevenue)}
                                </div>
                            </div>
                        );
                    })()}
                </>
            )}
        </div>
    );
};

export default InvoiceReport;
