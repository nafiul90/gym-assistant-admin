import {
    ArrowLeftOutlined,
    CloseOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSuspense from "./LoadingSuspense";
import { Button, Dropdown, Mentions } from "antd";

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
    extraClassName,
}) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex justify-between items-start p-4">
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
            <div className="hidden md:block ">
                <div className={`flex gap-2 mr-4 ${extraClassName}`}>
                    {extra && extra.map((e) => e)}
                </div>
            </div>

            <div
                className={`flex flex-col items-end justify-end gap-3 mr-4 block md:hidden ${extraClassName}`}
            >
                {extra && (
                    <Button>
                        {menuOpen ? (
                            <CloseOutlined
                                onClick={() => setMenuOpen(!menuOpen)}
                            />
                        ) : (
                            <MenuFoldOutlined
                                onClick={() => setMenuOpen(!menuOpen)}
                            />
                        )}
                    </Button>
                )}
                {menuOpen && (
                    <div className="flex flex-col items-end justify-end gap-2">
                        {extra && extra.map((e) => e)}
                    </div>
                )}
            </div>
        </div>
    );
};

PageWrapper.propTypes = {
    children: PropTypes.element.isRequired,
};

export default PageWrapper;
