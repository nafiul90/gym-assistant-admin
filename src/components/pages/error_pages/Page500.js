import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ErrorLayout from "../../layout/error_layout/ErrorLayout";

const Page403 = () => {
    return (
        <ErrorLayout
            status={500}
            subTitle="Sorry, something went wrong. Please try again later."
        >
            <Link to="/">
                <Button>Go To Dashboard</Button>
            </Link>
        </ErrorLayout>
    );
};

export default Page403;
