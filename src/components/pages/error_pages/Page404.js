import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ErrorLayout from "../../layout/error_layout/ErrorLayout";

const Page404 = () => {
    return (
        <ErrorLayout
            status={404}
            subTitle="Sorry, the page you visited does not exist."
        >
            <Link to="/">
                <Button>Go To Dashboard</Button>
            </Link>
        </ErrorLayout>
    );
};

export default Page404;
