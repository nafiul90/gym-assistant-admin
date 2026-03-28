import moment from "moment";
import dayjs from "dayjs";
import { Tag } from "antd";
import { useGetAllData } from "../../common/useGetAllData";
import { GET_ALL_GYM, IMAGE_URL } from "../../../helpers/Constant";

const dueMonths = (clearTo) => {
    if (!clearTo) return 1;
    const diff =
        new Date().getMonth() - new Date(clearTo).getMonth();
    return diff;
};

const GymCard = ({ gym, paid }) => (
    <div
        style={{
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            border: `1.5px solid ${paid ? "#bbf7d0" : "#fecaca"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
    >
        <div
            style={{
                width: "100%",
                aspectRatio: "1",
                background: "#f9fafb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <img
                src={gym.logo ? `${IMAGE_URL}/${gym.logo}` : "/gym_logo_b.png"}
                alt={gym.gymName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        </div>
        <div style={{ padding: "8px 6px", width: "100%", textAlign: "center" }}>
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#374151",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {gym.gymName}
            </div>
        </div>
    </div>
);

const SectionHeader = ({ title, count, color }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
        }}
    >
        <div
            style={{
                width: 4,
                height: 20,
                background: color,
                borderRadius: 4,
            }}
        />
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>
            {title}
        </span>
        <Tag color={color === "#ef4444" ? "red" : "green"} style={{ fontWeight: 600 }}>
            {count}
        </Tag>
    </div>
);

const GymGrid = () => {
    const { dataList } = useGetAllData(`${GET_ALL_GYM}?active=true&size=1000`);

    const unpaid = dataList.filter((g) => dueMonths(g.paymentClearTo) !== 0);
    const paid = dataList.filter((g) => dueMonths(g.paymentClearTo) === 0);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(90px, 1fr))",
        gap: 10,
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Unpaid */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "20px 22px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #fff1f2",
                }}
            >
                <SectionHeader
                    title="Unpaid Gyms"
                    count={unpaid.length}
                    color="#ef4444"
                />
                {unpaid.length === 0 ? (
                    <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
                        All gyms are paid up
                    </p>
                ) : (
                    <div style={gridStyle}>
                        {unpaid.map((g) => (
                            <GymCard key={g._id} gym={g} paid={false} />
                        ))}
                    </div>
                )}
            </div>

            {/* Paid */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "20px 22px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #f0fdf4",
                }}
            >
                <SectionHeader
                    title="Paid Gyms"
                    count={paid.length}
                    color="#16a34a"
                />
                {paid.length === 0 ? (
                    <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
                        No paid gyms this month
                    </p>
                ) : (
                    <div style={gridStyle}>
                        {paid.map((g) => (
                            <GymCard key={g._id} gym={g} paid />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymGrid;
