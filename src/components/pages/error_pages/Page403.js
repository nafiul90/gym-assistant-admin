import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ErrorLayout from "../../layout/error_layout/ErrorLayout";

const Page403 = () => {
    return (
        <ErrorLayout
            status={403}
            subTitle="Sorry, you are not authorized to access this page."
        >
            <Link to="/">
                <Button>Go To Dashboard</Button>
            </Link>
        </ErrorLayout>
    );
};

export default Page403;
