import React from "react";
import AuthContextProvider from "../contexts/AuthContextProvider";
import RoleContextProvider from "../contexts/RoleContextProvider";
import StaticPageContextProvider from "../contexts/StaticPageContextProvider";

const contextProviders = [
    AuthContextProvider,
    RoleContextProvider,
    StaticPageContextProvider
];

export const ProviderInjection = ({ app }) => {
    contextProviders.forEach((Provider) => (app = <Provider>{app}</Provider>));
    return app;
};

export default ProviderInjection;
