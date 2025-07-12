import React from "react";
import { Navigate } from "react-router-dom";
import {
    PAGE_403_PATH,
    PAGE_404_PATH,
    PAGE_500_PATH
} from "../../../routes/Slugs";

const RedirectToErrorPage = (status, context) => {
    return (
        <div>
            {status === 404 ? (
                <Navigate to={PAGE_404_PATH} />
            ) : status === 500 ? (
                <Navigate to={PAGE_500_PATH} />
            ) : status === 403 ? (
                <Navigate to={PAGE_403_PATH} />
            ) : (
                context.errorMsg
            )}
        </div>
    );
};

export default RedirectToErrorPage;
