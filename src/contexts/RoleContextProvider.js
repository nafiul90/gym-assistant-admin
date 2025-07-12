import React, { createContext, useState } from "react";
import api from "../services/Api";

export const RoleContext = createContext("RoleContext");

const RoleContextProvider = ({ children }) => {
    const [roleList, setRoleList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loadingRoleList, setLoadingRoleList] = useState(false);

    const getRoleList = async (params) => {
        api.role.getAll(
            { params, setLoading: setLoadingRoleList },
            (response) => {
                setRoleList(response.data.content);
                setTotalElements(response.data.totalElements);
            }
        );
    };

    return (
        <RoleContext.Provider
            value={{
                getRoleList,
                roleList,
                totalElements,
                loadingRoleList
            }}
        >
            {children}
        </RoleContext.Provider>
    );
};

export default RoleContextProvider;
