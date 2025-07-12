import { useEffect, useState } from "react";
import { getAllQueryParams, useQuery } from "../../helpers/Utils";
import api from "../../services/Api";
import { Toast } from "./Toast";

export const useGetAllData = (url) => {
    const query = useQuery();

    const [dataList, setDataList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loadingList, setLoadingList] = useState(false);
    const [summary, setSummary] = useState(null);

    const getAllData = async (params) => {
        api.getAllData(
            { url, params, setLoading: setLoadingList },
            (response) => {
                if (response.data?.content === false) {
                    Toast(
                        "error",
                        "Connection failed",
                        "Can not connect the device."
                    );
                    return;
                }
                setDataList(response.data.content);
                setTotalElements(response.data.totalElements);
                setSummary(response.data.summary);
            }
        );
    };

    useEffect(() => {
        getAllData(getAllQueryParams(query));
    }, [query.get("page")]);

    return { dataList, totalElements, loadingList, summary, getAllData };
};
