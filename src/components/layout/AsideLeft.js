import { Menu } from "antd";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import SidebarMenus from "../../helpers/Navs";
import "./aside_left.scss";
import Brand from "./brand/Brand";

const AsideLeft = ({ collapsed, logo }) => {
    const headerLogoClassName = collapsed ? "brand collapsed" : "brand";

    const menuItems = SidebarMenus();

    return (
        <Fragment>
            <Link to="/">
                <Brand
                    brandText={"Gym Assistant"}
                    // icon={<img src="/logo.png" />}
                    className={headerLogoClassName}
                />
            </Link>
            <Menu
                mode="inline"
                className="aside-left-content"
                items={[...menuItems]}
                defaultOpenKeys={[...menuItems.map((e) => e.key)]}
            />
        </Fragment>
    );
};

export default AsideLeft;
