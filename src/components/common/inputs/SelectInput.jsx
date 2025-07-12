import { Select } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../services/Api";
import useDebounce from "../useDebounce";
const { Option } = Select;

const SelectInput = ({
    placeholder = "Select",
    value,
    onChange,
    options,
    optionFieldName,
    getOptionsUrl,
    searchFieldName,
    optionValueName,
    getFullItem = false,
    optionComponent,
    ref,
    refresh = null,
    ...props
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(options ?? []);
    useEffect(() => {
        !options && getOptions();
        if (refresh !== null) {
            onChange("");
        }
    }, [refresh]);

    const getOptions = async (params) => {
        api.getAllData(
            {
                url: getOptionsUrl,
                params: { ...params, size: 100 },
                setLoading,
            },
            (res) => {
                setData(res.data.content);
            }
        );
    };

    const onSearchOptions = (value) => {
        if (getOptionsUrl) {
            getOptions({ [searchFieldName ?? optionFieldName]: value });
        }
    };

    const debounceAction = useDebounce(onSearchOptions, 500);

    const onClear = () => {
        if (getOptionsUrl) {
            getOptions();
        }
        onChange("");
    };

    const onSelect = (_value) => {
        onChange(
            _value,
            getFullItem && data.find((e) => e[optionValueName] === _value)
        );
    };

    return (
        <Select
            value={
                value
                    ? typeof value === "string"
                        ? value
                        : value && value?.length
                          ? value?.map((e) => e[optionFieldName] ?? e)
                          : value[optionFieldName]
                    : null
            }
            style={{ width: "100%" }}
            placeholder={placeholder}
            allowClear
            onClear={onClear}
            showSearch
            loading={loading}
            onSearch={debounceAction}
            optionFilterProp="label"
            optionLabelProp="label"
            // filterOption={(input, option) =>
            //     option.children.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
            // }
            ref={ref}
            onChange={onSelect}
            {...props}
        >
            {data
                // ?.filter((e) => (!options ? e[optionFieldName] : true))
                .map((e, i) => (
                    <Option
                        key={i}
                        value={
                            options
                                ? typeof e === "string"
                                    ? e
                                    : e[optionValueName]
                                : e[optionValueName ?? optionFieldName]
                        }
                        label={
                            options
                                ? typeof e === "string"
                                    ? e
                                    : e[optionFieldName]
                                : e[optionFieldName]
                        }
                    >
                        {getOptionChildren({
                            value: e,
                            options,
                            optionComponent,
                            optionFieldName,
                        })}
                    </Option>
                ))}
        </Select>
    );
};

const getOptionChildren = ({
    value,
    options,
    optionComponent,
    optionFieldName,
}) => {
    if (options) {
        return optionComponent ? optionComponent(value.label) : value.label;
    }
    return optionComponent ? optionComponent(value) : value[optionFieldName];
};

export default SelectInput;
