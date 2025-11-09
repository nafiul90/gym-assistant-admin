import { Button, Form, Input } from "antd";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

/* SCSS */
import { AuthContext } from "../../../contexts/AuthContextProvider";
import { GET_ALL_SITE_CONFIGS, IMAGE_URL } from "../../../helpers/Constant";
import { useGetAllData } from "../../common/useGetAllData";
import "./login.scss";

const Login = () => {
    const authContext = useContext(AuthContext);
    // const { dataList } = useGetAllData(GET_ALL_SITE_CONFIGS);

    const onFinish = (values) => {
        values.phone = `${values.phone}`;
        authContext.login(values);
    };

    const onFinishFailed = (errorInfo) => {};

    // const tailLayout = {
    //     wrapperCol: { offset: 8, span: 16 }
    // };

    if (authContext.isLogin) return <Navigate to="/" />;

    return (
        <div className="h-screen grid">
            <div className="w-full bg-white p-10 rounded-lg shadow-xl flex flex-col justify-center">
                <div className="space-y-20">
                    <div className="mx-auto">
                        <p className="text-xl text-center mb-5">
                            Gym Assistant Admin
                        </p>
                        <Form
                            layout="vertical"
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="phone"
                                style={{ width: "100%" }}
                                className="w-full "
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Phone"
                                    className="phone-number-input w-full"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item
                                style={{ marginTop: "20px" }}
                                name="password"
                                size="large"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>

                            <Form.Item
                                // {...tailLayout}
                                className="flex justify-center"
                                style={{ width: "100%" }}
                            >
                                <Button
                                    style={{ width: "100%" }}
                                    type="primary"
                                    htmlType="submit"
                                    loading={authContext.loading}
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
