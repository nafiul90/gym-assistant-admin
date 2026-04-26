import { Button, Form, Input, Modal, Space } from "antd";
import React, { useContext, useRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContextProvider";
import "./login.scss";

const Login = () => {
    const authContext = useContext(AuthContext);
    const [otpValue, setOtpValue] = useState("");
    const [sessionEndedMsg] = useState(() => {
        const flag = sessionStorage.getItem("session_ended");
        if (flag) {
            sessionStorage.removeItem("session_ended");
            return "You have been logged out from this device. Please log in again.";
        }
        return null;
    });
    const [resendCooldown, setResendCooldown] = useState(0);
    const timerRef = useRef(null);

    // Start 60-second resend cooldown when OTP screen appears
    useEffect(() => {
        if (authContext.otpState) {
            startCooldown();
        } else {
            clearInterval(timerRef.current);
            setResendCooldown(0);
            setOtpValue("");
        }
        return () => clearInterval(timerRef.current);
    }, [!!authContext.otpState]);

    const startCooldown = () => {
        setResendCooldown(60);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const onFinish = (values) => {
        values.phone = `${values.phone}`;
        authContext.login(values);
    };

    const onVerifyOtp = async () => {
        if (otpValue.length !== 6) return;
        await authContext.verifyOtp(otpValue);
    };

    const onResend = async () => {
        if (resendCooldown > 0) return;
        await authContext.resendOtp();
        startCooldown();
    };

    if (authContext.isLogin) return <Navigate to="/" />;

    return (
        <div className="h-screen grid">
            <div className="w-full bg-white p-10 rounded-lg shadow-xl flex flex-col justify-center">
                <div className="space-y-20">
                    <div className="mx-auto">
                        <p className="text-xl text-center mb-5">
                            Gym Assistant Admin
                        </p>
                        {sessionEndedMsg && (
                            <div style={{
                                background: "#fff2f0",
                                border: "1px solid #ffccc7",
                                borderRadius: 6,
                                padding: "10px 14px",
                                marginBottom: 16,
                                color: "#a8071a",
                                fontSize: 13,
                            }}>
                                {sessionEndedMsg}
                            </div>
                        )}
                        <Form
                            layout="vertical"
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="phone"
                                style={{ width: "100%" }}
                                className="w-full"
                                rules={[{ required: true, message: "Please input your phone!" }]}
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
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>

                            <Form.Item className="flex justify-center" style={{ width: "100%" }}>
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

            {/* OTP verification modal for new device */}
            <Modal
                title="Verify New Device"
                open={!!authContext.otpState}
                onCancel={authContext.cancelOtp}
                footer={null}
                centered
            >
                <p style={{ marginBottom: 8, color: "#555" }}>
                    An OTP has been sent to{" "}
                    <strong>{authContext.otpState?.maskedPhone}</strong>.
                    Enter it below to verify this device.
                </p>
                <Input
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    style={{ fontSize: 20, letterSpacing: 8, textAlign: "center", marginBottom: 16 }}
                    onPressEnter={onVerifyOtp}
                />
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                        type="primary"
                        block
                        disabled={otpValue.length !== 6}
                        loading={authContext.otpLoading}
                        onClick={onVerifyOtp}
                    >
                        Verify
                    </Button>
                    {resendCooldown > 0 ? (
                        <p style={{ textAlign: "center", color: "#999" }}>
                            Resend OTP in {resendCooldown}s
                        </p>
                    ) : (
                        <Button type="link" block onClick={onResend}>
                            Resend OTP
                        </Button>
                    )}
                </Space>
            </Modal>
        </div>
    );
};

export default Login;
