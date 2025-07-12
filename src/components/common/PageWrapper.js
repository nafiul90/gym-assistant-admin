import { ArrowLeftOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSuspense from "./LoadingSuspense";

const PageWrapper = ({ pageHeader, children, loading }) => {
    return (
        <Fragment>
            <div className="page_header">{pageHeader}</div>
            <div className="page_content">
                {loading ? <LoadingSuspense /> : children}
            </div>
        </Fragment>
    );
};

export const CustomPageHeader = ({
    goBack = true,
    title,
    subTitle,
    extra,
    extraClassName
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between p-4">
            <div className="text-2xl font-semi-bold flex items-center gap-5">
                {goBack && (
                    <ArrowLeftOutlined
                        className="back-button mr-4"
                        onClick={() => navigate(-1)}
                    />
                )}
                {title}
                <p className="text-sm text-gray">{subTitle}</p>
            </div>
            <div className={`flex gap-2 mr-4 ${extraClassName}`}>
                {extra && extra.map((e) => e)}
            </div>
        </div>
    );
};

PageWrapper.propTypes = {
    children: PropTypes.element.isRequired
};

export default PageWrapper;
