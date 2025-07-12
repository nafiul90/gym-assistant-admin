import React, { createContext, useState } from "react";
import api from "../services/Api";

export const StaticPageContext = createContext("StaticPageContext");

const StaticPageContextProvider = ({ children }) => {
    const [staticPageList, setStaticPageList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loadingList, setLoadingList] = useState(false);
    const [summary, setSummary] = useState(null);

    const getStaticPageList = async (params) => {
        api.staticPage.getAll(
            { params, setLoading: setLoadingList },
            (response) => {
                setStaticPageList(response.data.content);
                setTotalElements(response.data.totalElements);
                setSummary(response.data.summary);
            }
        );
    };

    return (
        <StaticPageContext.Provider
            value={{
                getStaticPageList,
                staticPageList,
                summary,
                loadingList,
                totalElements
            }}
        >
            {children}
        </StaticPageContext.Provider>
    );
};

export default StaticPageContextProvider;
