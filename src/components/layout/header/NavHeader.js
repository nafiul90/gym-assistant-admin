import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

/* SCSS */
import { AuthContext } from "../../../contexts/AuthContextProvider";
import { ACCESS_TOKEN } from "../../../helpers/Constant";
import { useQuery } from "../../../helpers/Utils";
import { USER_PROFILE_PATH } from "../../../routes/Slugs";
import "./nav_header.scss";

const { Header } = Layout;

const NavHeader = ({ collapsed }) => {
    const query = useQuery();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (query.token) {
            localStorage.setItem(ACCESS_TOKEN, query.token);
        }
        authContext.getUserProfile();
    }, []);

    const logout = () => {
        authContext.logout();
    };

    const menu = (
        <Menu style={{ minWidth: "120px" }}>
            <Menu.Item key="0">
                <Link to={USER_PROFILE_PATH}>Profile</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            style={{
                position: "fixed",
                width: `calc(100% - ${collapsed ? "80px" : "250px"}`,
                zIndex: 1
                // background: '#f54b42'
            }}
            className="nav_header"
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Dropdown
                    className="drop_down"
                    overlay={menu}
                    trigger={["click"]}
                >
                    <div
                        style={{
                            marginLeft: "30px",
                            color: "#fff"
                        }}
                    >
                        {authContext.profile && (
                            <span>{authContext.profile.fullName}</span>
                        )}{" "}
                        &nbsp;
                        <Avatar icon={<UserOutlined />} />
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
};

export default NavHeader;
