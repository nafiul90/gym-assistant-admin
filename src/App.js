import React, { lazy, Suspense, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSuspense from "./components/common/LoadingSuspense";
import PrivateRoute from "./components/common/PrivateRoute";
import { AuthContext } from "./contexts/AuthContextProvider";
import {
    LOGIN_PATH,
    PAGE_403_PATH,
    PAGE_404_PATH,
    PAGE_500_PATH
} from "./routes/Slugs";
// import Interceptors from "./Interceptors";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";

const DefaultLayout = lazy(() => import("./components/layout/DefaultLayout"));
const WrappedLogin = lazy(() => import("./components/pages/login/Login"));
const Page403 = lazy(() => import("./components/pages/error_pages/Page403"));
const Page404 = lazy(() => import("./components/pages/error_pages/Page404"));
const Page500 = lazy(() => import("./components/pages/error_pages/Page500"));

const App = () => {
    const { isLogin } = useContext(AuthContext);

    // const themes = {
    //   dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
    //   light: `${process.env.PUBLIC_URL}/light-theme.css`,
    // };

    return (
        // <ThemeSwitcherProvider
        //     themeMap={themes}
        //     defaultTheme={userContext.theme}
        //     insertionPoint="styles-insertion-point"
        // >
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#2758d1"
                }
            }}
        >
            <StyleProvider hashPriority="high">
                <Suspense fallback={<LoadingSuspense />}>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path={LOGIN_PATH}
                                element={<WrappedLogin />}
                            />
                            <Route element={<PrivateRoute isLogin={isLogin} />}>
                                <Route
                                    path={PAGE_404_PATH}
                                    element={<Page404 />}
                                />
                                <Route
                                    path={PAGE_403_PATH}
                                    element={<Page403 />}
                                />
                                <Route
                                    path={PAGE_500_PATH}
                                    element={<Page500 />}
                                />
                                <Route path="*" element={<DefaultLayout />} />
                            </Route>
                        </Routes>
                        {/* <Interceptors /> */}
                    </BrowserRouter>
                </Suspense>
            </StyleProvider>
        </ConfigProvider>
        // </ThemeSwitcherProvider>
    );
};

export default App;
