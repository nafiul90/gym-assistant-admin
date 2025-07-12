import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import { ROOT_URL } from "../helpers/Constant";
const SOCKET_CONTEXT = createContext(null);
const url = `${ROOT_URL}`;

const connectToSocket = (userId, companyId) => {
    const socket = io(url, {
        query: `userId=${userId}&companyId=${companyId}`,
        reconnectionDelay: 1000,
        reconnection: true,
        transports: ["websocket"],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false,
        reconnectionAttempts: 10
    });

    return socket;
};

export const useSocket = () => {
    const socket = useContext(SOCKET_CONTEXT);
    return socket;
};

export const SocketProvider = ({ currentUser, children }) => {
    // const socketRef = useRef();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (currentUser?._id) {
            const socketCon = connectToSocket(
                currentUser?._id,
                currentUser?.company?._id
            );
            setSocket(socketCon);
        }
        return () => {
            if (socket) {
                socket?.disconnect();
            }
        };
    }, [currentUser]);
    // const socket = useMemo(() => {
    //     console.log("Callig Connect ToSocket ");
    //     return connectToSocket(currentUser?._id);
    // }, []);
    return (
        <SOCKET_CONTEXT.Provider value={socket}>
            {children}
        </SOCKET_CONTEXT.Provider>
    );
};
