import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Api";

const useGetSingleData = (url) => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        api.getSingleData({ url: `${url}/${id}`, setLoading }, (response) => {
            setData(response.data);
        });
    };

    return { data, loading, id };
};

export default useGetSingleData;
