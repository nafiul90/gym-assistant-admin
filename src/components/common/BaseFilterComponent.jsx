import { Button, Collapse, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bindUrlWithParams, getParams, useQuery } from "../../helpers/Utils";
import InputField from "./inputs/BaseInputField";
import { useCheckScreenType } from "./useCheckScreenType";
import useDebounce from "./useDebounce";

const BaseFilterComponent = ({
    title,
    itemCount,
    cols = "12",
    searchAction,
    filterItems,
    hideUrl = false,
    size = 10,
    ...props
}) => {
    const { isMobile } = useCheckScreenType();
    const [data, setData] = useState({});
    const query = useQuery();
    const navigate = useNavigate();
    const currentPath = useLocation()?.pathname;

    useEffect(() => {
        let _data = {};
        for (const i in filterItems) {
            const element = filterItems[i];
            _data[element.name] = element.value ?? "";
        }
        _data = getParams(query, _data);
        setData(_data);
    }, []);

    const debounceAction = useDebounce(searchAction, 500);

    const onChangeHandle = (name, value) => {
        const _data = { ...data, [name]: value };
        setData(_data);

        bindUrl(_data);
        debounceAction(_data);
    };

    const bindUrl = (_data) => {
        !hideUrl &&
            navigate(
                bindUrlWithParams(currentPath, {
                    page: 1,
                    size,
                    ..._data,
                })
            );
    };

    const resetSearch = () => {
        setData({});
        bindUrl({});
        searchAction({});
    };

    const collapseItems = [
        {
            key: "1",
            label: title,
            extra: (
                <p className="text-lg">
                    Total item:{" "}
                    <span className="text-lg font-bold">{itemCount}</span>
                </p>
            ),
            children: (
                <Form layout="vertical" initialValues={data}>
                    <div
                        className={`grid grid-flow-row-dense grid-cols-${cols} gap-3 mb-4`}
                    >
                        {filterItems.map((item) => (
                            <InputField
                                key={item.name}
                                onChange={onChangeHandle}
                                value={data[item.name]}
                                {...item}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            onClick={() => searchAction(data)}
                        >
                            Search
                        </Button>
                        <Button danger onClick={resetSearch}>
                            Reset
                        </Button>
                    </div>
                </Form>
            ),
        },
    ];
    return (
        <div className="mb-4">
            <Collapse
                defaultActiveKey={!isMobile ? ["1"] : ""}
                items={collapseItems}
            />
        </div>
    );
};

export default BaseFilterComponent;
