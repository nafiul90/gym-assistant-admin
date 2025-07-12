import React from "react";
import { useAuth } from "../../../contexts/AuthContextProvider";
import { SocketProvider } from "../../../contexts/SocketContext";
import ChatScreen from "./ChatScreen";

const ChatPage = () => {
    const { profile } = useAuth();
    return (
        <SocketProvider currentUser={profile}>
            <ChatScreen />
        </SocketProvider>
    );
};

export default ChatPage;
