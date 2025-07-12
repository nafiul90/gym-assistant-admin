import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/Api";
import InputField from "./inputs/BaseInputField";
import LoadingSuspense from "./LoadingSuspense";

const BaseFormComponent = ({
    formItems,
    beforeSubmit,
    loading,
    actionLayoutClassName,
    submitUrl,
    initialDataUrl,
    modifyInitialData,
    data,
    navigateBack = true,
    afterSubmit,
    title,
    footer,
    hasDynamicValues = false,
    dynamicValueName = "others",
    onChange,
    ...props
}) => {
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(data ?? {});

    const [initialLoading, setInitialLoading] = useState(false);
    const { id } = useParams();
    const [dynamicValues, setDynamicValues] = useState([]);
    const [dynamicValue, setDynamicValue] = useState({ name: "", value: "" });

    useEffect(() => {
        if (initialDataUrl) {
            api.getSingleData(
                {
                    url: `${initialDataUrl}/${id}`,
                    setLoading: setInitialLoading,
                },
                (response) => {
                    setInitialValues(
                        modifyInitialData
                            ? modifyInitialData(response.data)
                            : response.data
                    );
                    if (response.data[dynamicValueName]) {
                        setDynamicValues(
                            Object.entries(response.data[dynamicValueName]).map(
                                ([name, value]) => ({ name, value })
                            )
                        );
                    }
                }
            );
        }
    }, []);

    const onFinish = (values) => {
        if (hasDynamicValues && dynamicValues.length > 0) {
            values = {
                ...values,
                [dynamicValueName]: dynamicValues.reduce(
                    (acc, { name, value }) => {
                        acc[name] = value;
                        return acc;
                    },
                    {}
                ),
            };
        }
        values = beforeSubmit ? beforeSubmit(values) : values;
        if (submitUrl) {
            api[id ? "updateData" : "createData"](
                {
                    url: `${submitUrl}${id ? `/${id}` : ""}`,
                    setLoading: setLoadingSubmit,
                    body: values,
                },
                (res) => {
                    afterSubmit && afterSubmit(values, res);
                    if (navigateBack) navigate(-1);
                },
                (error) => {
                    const response = error.response?.data;
                    const errorMessage = response.errorMessages;
                    if (errorMessage && Object.keys(errorMessage).length) {
                        parseError(errorMessage);
                    }
                }
            );
        }
    };

    const parseError = (errorMessage) => {
        const errorMessages = Object.keys(errorMessage).map((key) => {
            return {
                name: key,
                errors: [errorMessage[key]],
            };
        });
        form.setFields(errorMessages);
    };

    const onReset = () => {
        form.resetFields();
    };

    const _Form = (
        <Form
            onFinish={onFinish}
            className="form"
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onChange={onChange}
            {...props}
        >
            <div className={`grid grid-flow-row-dense grid-cols-12 gap-x-3`}>
                {formItems.map(
                    (item) =>
                        item && (
                            <InputField
                                key={item.name}
                                formItem={true}
                                form={form}
                                formData={initialValues}
                                {...item}
                            />
                        )
                )}
            </div>
            {dynamicValues.map((e, i) => (
                <div key={i} className="flex gap-10 max-w-[800] my-5">
                    <Input
                        value={e.name}
                        onChange={(event) => {
                            setDynamicValues([
                                ...dynamicValues.map((item) => {
                                    if (item.name === e.name) {
                                        item.name = event.target.value;
                                    }
                                    return item;
                                }),
                            ]);
                        }}
                    />{" "}
                    :{" "}
                    <TextArea
                        value={e.value}
                        onChange={(event) => {
                            setDynamicValues([
                                ...dynamicValues.map((item) => {
                                    if (item.value === e.value) {
                                        item.value = event.target.value;
                                    }
                                    return item;
                                }),
                            ]);
                        }}
                    />
                    <DeleteOutlined
                        onClick={() =>
                            setDynamicValues([
                                ...dynamicValues.filter(
                                    (items) => items.name !== e.name
                                ),
                            ])
                        }
                    />
                </div>
            ))}
            {hasDynamicValues && (
                <div className="max-w-[800px] flex gap-4 my-10">
                    <Input
                        value={dynamicValue.name}
                        onChange={(e) =>
                            setDynamicValue({
                                ...dynamicValue,
                                name: e.target.value,
                            })
                        }
                    />
                    <TextArea
                        value={dynamicValue.value}
                        onChange={(e) =>
                            setDynamicValue({
                                ...dynamicValue,
                                value: e.target.value,
                            })
                        }
                    />
                    <Button
                        onClick={() => {
                            setDynamicValues([...dynamicValues, dynamicValue]);
                            setDynamicValue({ name: "", value: "" });
                        }}
                    >
                        Add
                    </Button>
                </div>
            )}
            {footer ? (
                footer(form)
            ) : (
                <div
                    className={
                        actionLayoutClassName ??
                        "grid grid-flow-row-dense grid-cols-12 gap-3 mt-4"
                    }
                >
                    <Button
                        className="col-span-4 md:col-span-2"
                        type="primary"
                        htmlType="submit"
                        loading={loading || loadingSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        className="col-span-4 md:col-span-2"
                        htmlType="button"
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </div>
            )}
        </Form>
    );

    return initialLoading ? (
        <LoadingSuspense />
    ) : (
        <Card className="m-auto" title={title}>
            {_Form}
        </Card>
    );
};

export default BaseFormComponent;
