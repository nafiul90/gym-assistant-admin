import React from "react";

import { Card } from "antd";
import ProfileDetailItems from "./components/ProfileDetailItems";
import ProfileHeader from "./components/ProfileHeader";

const ProfileDetails = () => {
    return (
        <div className="grid gap-3 max-w-[1000px]" style={{ margin: "0 auto" }}>
            <Card>
                <ProfileHeader />
            </Card>
            <Card title="Profile Details">
                <ProfileDetailItems />
            </Card>
        </div>
    );
};

export default ProfileDetails;
