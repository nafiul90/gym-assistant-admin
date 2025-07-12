import { SendOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { sendMessage } from "../../../services/chatApi";

const ChatInput = ({ conversationId, onMessageSent, companyId }) => {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message?.trim()) {
            // toast.error("Please enter some message to send!");
            return;
        }

        try {
            setIsSending(true);
            const messageBody = {
                text: message,
                companyId
            };
            const res = await sendMessage(conversationId, messageBody);
            onMessageSent(res?.data);
            setMessage("");
            setIsSending(false);
        } catch (err) {}
    };
    return (
        <form onSubmit={handleSendMessage}>
            <label
                className={`input text-secondary flex items-center  !outline-none input-bordered w-full  border-1 focus:border-2  focus:outline-none  border-slate-300 focus:border-slate-300`}
            >
                <input
                    type={"text"}
                    placeholder={"Write Message Here"}
                    className={`grow focus:outline-none`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    disabled={isSending}
                    type="submit"
                    className=" text-white border border-secondary bg-[#000] h-[30px] px-2 flex items-center gap-2"
                >
                    {isSending && (
                        <span className="loading loading-spinner loading-md mr-3"></span>
                    )}
                    Send
                    <SendOutlined
                        size={18}
                        style={{
                            color: "white"
                        }}
                    />
                </button>
            </label>
        </form>
    );
};

export default ChatInput;
