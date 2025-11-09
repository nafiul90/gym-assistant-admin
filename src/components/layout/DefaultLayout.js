import { Layout } from "antd";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContextProvider";
import { GET_ALL_SITE_CONFIGS, IMAGE_URL } from "../../helpers/Constant";
import AppRoutes from "../../routes/AppRoutes";
import LoadingSuspense from "../common/LoadingSuspense";
import { useCheckScreenType } from "../common/useCheckScreenType";
import { useGetAllData } from "../common/useGetAllData";
import Dashboard from "../pages/dashboard/dashboard";

const AsideLeft = lazy(() => import("./AsideLeft"));
const Page404 = lazy(
    () => import("../../components/pages/error_pages/Page404"),
);

const { Sider, Content } = Layout;

const DefaultLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const screenType = useCheckScreenType();

    const { getUserProfile, profile } = useContext(AuthContext);
    const { dataList } = useGetAllData(GET_ALL_SITE_CONFIGS);
    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    useEffect(() => {
        if (!profile) getUserProfile();
    }, []);

    return (
        <Layout>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                width={250}
                mode="inline"
                breakpoint="md"
                collapsedWidth="0"
                style={{
                    position: "fixed",
                    left: 0,
                    zIndex: 10,
                }}
            >
                <Suspense fallback={<LoadingSuspense height="100vh" />}>
                    <AsideLeft
                        collapsed={collapsed}
                        logo={`${IMAGE_URL}/${dataList[0]?.logo}`}
                    />
                </Suspense>
            </Sider>
            <Layout
                style={{
                    marginLeft: collapsed || screenType.isMobile ? 0 : 250,
                }}
            >
                <Content
                    className="app_page"
                    style={{
                        padding: "30px 16px 5px 16px",
                        overflow: "auto",
                        filter:
                            !collapsed && screenType.isMobile
                                ? "blur(5px)"
                                : "blur(0px)",
                    }}
                >
                    <Suspense fallback={<LoadingSuspense />}>
                        <Routes>
                            {AppRoutes.map((route) => {
                                return (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        // exact={route.exact}
                                        // component={route.component}
                                        element={<route.component />}
                                    />
                                );
                            })}
                            <Route path="/" element={<Dashboard />} />
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                    </Suspense>
                </Content>
                {/* <CustomFooter /> */}
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
