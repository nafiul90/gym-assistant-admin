import { useState } from "react";
import PageWrapper from "../../common/PageWrapper";
import FinancialSummary from "./FinancialSummary";
import LiveUsersCard from "./LiveUsersCard";
import ActivityChart from "./ActivityChart";
import RegistrationChart from "./RegistrationChart";
import ActiveUsersSection from "./ActiveUsersSection";
import LiveAttendance from "./LiveAttendance";
import GymGrid from "./GymGrid";

const Dashboard = () => {
    const [socketStatus, setSocketStatus] = useState("connecting");

    return (
        <PageWrapper title="Dashboard">
            <style>{`
                @keyframes attSlideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
            `}</style>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Financial overview */}
                <FinancialSummary />

                {/* Live users + Charts row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "340px 1fr",
                        gap: 20,
                        alignItems: "start",
                    }}
                >
                    <LiveUsersCard socketStatus={socketStatus} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <RegistrationChart />
                        <ActivityChart />
                    </div>
                </div>

                {/* Active users */}
                <ActiveUsersSection />

                {/* Live attendance feed */}
                <LiveAttendance onSocketStatus={setSocketStatus} />

                {/* Gym grid (unpaid / paid) */}
                <GymGrid />
            </div>
        </PageWrapper>
    );
};

export default Dashboard;
