import React, { Fragment, useContext, useState } from "react";
import redirectToErrorPage from "./components/pages/error_pages/RedirectToErrorPage";
import { AuthContext } from "./contexts/AuthContextProvider";

import axios from "axios";

const Interceptors = () => {
    const [statusCode, setStatusCode] = useState(200);
    const authContext = useContext(AuthContext);

    // Add a request interceptor
    axios.interceptors.request.use(
        function (config) {
            // Do something before request is sent
            // console.log("axios request called====>", config);
            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
        function (response) {
            // Do something with response data
            // console.log("axios response called====>", response);

            return response;
        },
        function (error) {
            // Do something with response error
            if (error.response && error.response.status === 401)
                authContext.logout();

            // if (error.response && error.response.status === 403)
            //     setStatusCode(403)

            if (error.response && error.response.status === 404)
                setStatusCode(404);

            if (error.response && error.response.status === 500)
                setStatusCode(500);

            return Promise.reject(error);
        }
    );

    return <Fragment>{redirectToErrorPage(statusCode, authContext)}</Fragment>;
};

export default Interceptors;
