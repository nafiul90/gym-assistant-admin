import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContextProvider";
import { useSocket } from "../../../contexts/SocketContext";
import {
    fetchChatConversationsOnClient,
    getConversationMessages,
    getFullFilePath
} from "../../../services/chatApi";
import ChatInput from "./ChatInput";
import { useOnScreen } from "./hooks/useOnScreen";

const getOtherChatParticipent = (conversation, companyId) => {
    if (!conversation) {
        return {};
    }
    return conversation.participents?.find((participent) => {
        return participent?.company !== companyId;
    });
};

// const populateSender = (currentUser) => {
//     const { _id, email, phone, company, fullName } = currentUser;
//     const { _id: companyId, companyName, companyLogo } = company || {};
//     return {
//         _id: _id,
//         email: email,
//         phone: phone,
//         company: {
//             _id: companyId,
//             companyName: companyName,
//             companyLogo: companyLogo
//         },
//         fullName: fullName
//     };
// };

const formateMessageTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;
    return formattedDate;
};

const ChatScreen = () => {
    const { profile } = useAuth();
    const socket = useSocket();
    const [conversationList, setConversationList] = useState();
    const [currentConversation, setCurrentConversation] = useState(null);
    const currentUserId = profile?._id;
    const [getMessageLoading, setGetMessageLoading] = useState(false);
    const [messageContainer, setMessageContainer] = useState(new Map());
    const [totalMessageCountMap, setTotalMessageCountMap] = useState(new Map());
    const lastMessageRef = useRef(null);
    const messageListContainerRef = useRef(null);
    const [lastMessageToView, setLastMessageToView] = useState("");
    const [refreshInfinityLoader, setRefreshInfinityLoader] = useState("");
    const [getConversationLoading, setGetConversationLoading] = useState(true);
    const { container: messageLoaderContainer, isVisible } = useOnScreen(
        undefined,
        refreshInfinityLoader
    );

    const fetchConversationMessages = async (conversationId, before = "") => {
        setGetMessageLoading(true);
        try {
            const response = await getConversationMessages(
                conversationId,
                before
            );
            const newMessages = response?.data?.messages;
            const totalMessage = response?.data?.totalMessage;
            const lastMessage = newMessages[newMessages.length - 1];
            setMessageContainer((prevConversations) => {
                const updatedConversations = new Map(prevConversations);
                let existingMessages =
                    updatedConversations.get(conversationId) || [];

                if (existingMessages.length > 0) {
                    existingMessages = [...newMessages, ...existingMessages];
                } else {
                    existingMessages = newMessages;
                }
                updatedConversations.set(conversationId, existingMessages);

                return updatedConversations;
            });
            setTotalMessageCountMap((prev) => {
                const updatedMap = new Map(prev);
                updatedMap.set(conversationId, totalMessage);
                return updatedMap;
            });
            setTimeout(() => {
                setLastMessageToView(lastMessage?._id);
            }, 500);
            setTimeout(() => {
                setRefreshInfinityLoader(new Date().getTime().toString());
            }, 1000);
        } catch (err) {
            console.log("Err", err);
        } finally {
            setGetMessageLoading(false);
        }
    };

    const setScrollerAndInfinity = (lastMessageId) => {
        setTimeout(() => {
            setLastMessageToView(lastMessageId);
        }, 500);
        setTimeout(() => {
            setRefreshInfinityLoader(new Date().getTime().toString());
        }, 1000);
    };
    const handleChangeConversation = (conversationItem) => {
        setCurrentConversation(conversationItem);
        if (!messageContainer.get(conversationItem?._id)) {
            fetchConversationMessages(conversationItem?._id);
        } else {
            const messages = messageContainer.get(conversationItem?._id);
            if (messages.length) {
                const lastMesasgeId = messages[0]._id;
                setScrollerAndInfinity(lastMesasgeId);
            }
        }
    };
    useEffect(() => {
        const messagesMap = messageContainer.get(currentConversation?._id);
        const totalMessageCount =
            (currentConversation &&
                totalMessageCountMap.get(currentConversation?._id)) ||
            0 ||
            0;

        const currentTotalFetchedMessage = messagesMap?.length || 0;
        const hasMoreMessages = totalMessageCount > currentTotalFetchedMessage;
        const lastMessageId = currentTotalFetchedMessage
            ? messagesMap[0]?.messageId
            : "";
        if (
            isVisible &&
            hasMoreMessages &&
            !getMessageLoading &&
            lastMessageId
        ) {
            fetchConversationMessages(currentConversation?._id, lastMessageId);
            // console.log("Call Fetch Api", {
            //     lastMessageId,
            //     isVisible,
            //     hasMoreMessages,
            //     currentTotalFetchedMessage,
            //     totalMessageCount,
            // });
        }
    }, [
        isVisible,
        messageContainer,
        currentConversation,
        totalMessageCountMap,
        getMessageLoading
    ]);
    useEffect(() => {
        if (conversationList && conversationList?.length) {
            const selectedConversation = conversationList[0];
            handleChangeConversation(selectedConversation);
        }
    }, [conversationList]);
    const onNewMessageReceived = (newMessage) => {
        const conversationId = newMessage?.conversationId;
        const messageId = newMessage?.messageId;
        let isConversationExists = false;
        const updatedConversation = conversationList?.map((conv) => {
            if (conv?._id === conversationId) {
                isConversationExists = true;
                return {
                    ...conv,
                    lastMessage: newMessage,
                    isNewMessage: true
                };
            }
            return conv;
        });

        if (isConversationExists) {
            setConversationList(updatedConversation);
        }

        setMessageContainer((prevConversations) => {
            const updatedConversations = new Map(prevConversations);
            let existingMessages =
                updatedConversations.get(conversationId) || [];

            if (
                existingMessages?.find((item) => item?._id === newMessage?._id)
            ) {
                console.log("Message doesn't exists");
            } else {
                existingMessages = [...existingMessages, newMessage];
                updatedConversations.set(conversationId, existingMessages);
            }
            return updatedConversations;
        });
        // if (currentConversation?._id === conversationId) {
        //     setLastMessageToView(newMessage?._id);
        // }
        handleScrollIntoLastMessage();
    };
    useEffect(() => {
        socket?.on("new_message", onNewMessageReceived);
        return () => {
            socket?.off("new_message", onNewMessageReceived);
        };
    }, [socket, currentConversation]);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const result = await fetchChatConversationsOnClient();
                setConversationList(result?.data || []);
            } catch (err) {
            } finally {
                setGetConversationLoading(false);
            }
        };
        fetchConversation();
    }, []);

    // useEffect(() => {
    //     handleScrollIntoLastMessage();
    // }, [messageContainer]);
    useEffect(() => {
        if (lastMessageToView) {
            handleScrollIntoLastMessageToView();
        }
    }, [lastMessageToView]);

    const onNewMessageSent = (message) => {
        // const conversationId = currentConversation?._id;
        // const newUpdatedMessage = { ...message };
        // newUpdatedMessage.sender = populateSender(currentUser);
        // setMessageContainer((prevConversations) => {
        //     const updatedConversations = new Map(prevConversations);
        //     let existingMessages =
        //         updatedConversations.get(conversationId) || [];
        //     existingMessages = [...existingMessages, newUpdatedMessage];
        //     updatedConversations.set(conversationId, existingMessages);
        //     return updatedConversations;
        // });
        // setLastMessageToView(message?._id);
    };

    const handleScrollIntoLastMessage = () => {
        if (lastMessageRef.current && messageListContainerRef.current) {
            messageListContainerRef.current.scrollTo({
                top: lastMessageRef.current.offsetTop,
                behavior: "auto"
            });
        }
    };
    const handleScrollIntoLastMessageToView = () => {
        if (messageListContainerRef.current && lastMessageToView) {
            const element = document.getElementById(
                `message_item_${lastMessageToView}`
            );
            if (element) {
                messageListContainerRef.current.scrollTo({
                    top: element.offsetTop,
                    behavior: "auto"
                });
            }
        }
    };

    const currentConversationParticipent = getOtherChatParticipent(
        currentConversation,
        profile?.company?._id
    );

    const currentConversationCompanyName =
        currentConversationParticipent?.participent?.company?.companyName;
    const currentConversationCompanyId =
        currentConversationParticipent?.participent?.company?._id;
    const currentConversationId = currentConversation?._id;

    const currentConversationMessages =
        messageContainer.get(currentConversation?._id) || [];

    const totalMessageCount =
        (currentConversation &&
            totalMessageCountMap.get(currentConversation?._id)) ||
        0 ||
        0;
    const currentTotalFetchedMessage = currentConversationMessages?.length || 0;
    const hasMoreMessages = totalMessageCount > currentTotalFetchedMessage;
    const currentUserCompanyId = profile?.company?._id;
    return (
        <div className="flex h-[90vh] p-5">
            <div
                className={`min-w-[170px] flex flex-col gap-3 h-full overflow-scroll`}
                id="conversation_container"
            >
                {conversationList?.map((item, index) => {
                    const currentParticipent = getOtherChatParticipent(
                        item,
                        currentUserCompanyId
                    );
                    const companyName =
                        currentParticipent?.participent?.company?.companyName;
                    const companyId =
                        currentParticipent?.participent?.company?._id;
                    const isCurrentConversation =
                        currentConversation?._id === item?._id;
                    return (
                        <div
                            onClick={() => handleChangeConversation(item)}
                            key={companyId}
                            className={`py-2 border border-secondary text-center cursor-pointer text-secondary font-medium ${
                                isCurrentConversation
                                    ? " bg-[#000] text-white"
                                    : ""
                            }`}
                        >
                            {companyName}
                        </div>
                    );
                })}
            </div>
            <div className="grow flex flex-col border border-secondary h-full">
                {currentConversation ? (
                    <>
                        <div className="min-h-[50px] bg-[#000] flex items-center justify-between px-3">
                            <h3 className="text-white text-sm font-bold">
                                {currentConversationCompanyName}
                            </h3>
                        </div>

                        <div
                            className="grow flex flex-col gap-3 overflow-scroll px-2 py-4"
                            id="message_list_container"
                            ref={messageListContainerRef}
                        >
                            {currentConversationMessages.length &&
                            hasMoreMessages &&
                            !getMessageLoading ? (
                                <div
                                    ref={messageLoaderContainer}
                                    className="mb-4"
                                ></div>
                            ) : null}
                            {getMessageLoading && (
                                <div className=" my-2 flex items-center justify-center text-secondary font-bold text-xl">
                                    <span className="loading loading-spinner loading-md mr-3"></span>{" "}
                                    Loading....
                                </div>
                            )}

                            {currentConversationMessages.map(
                                (message, index) => {
                                    // const senderId = message?.sender?._id;
                                    // const isMyMessage =
                                    //     senderId === currentUserId;

                                    const senderId = message?.company;
                                    const isMyMessage =
                                        senderId === currentUserCompanyId;

                                    const messageText = message?.text;
                                    const messageTime = formateMessageTime(
                                        message?.createdAt
                                    );
                                    const logoUrl =
                                        message?.sender?.company?.companyLogo
                                            ?.path;
                                    const companyLogo = logoUrl
                                        ? getFullFilePath(logoUrl)
                                        : "/avatar.png";

                                    return (
                                        <div
                                            id={`message_item_${message?._id}`}
                                            key={message?._id}
                                            className={`${
                                                isMyMessage
                                                    ? "self-end "
                                                    : "self-start "
                                            }`}
                                        >
                                            <div
                                                className={` flex items-start gap-2 ${
                                                    isMyMessage
                                                        ? " flex-row-reverse "
                                                        : ""
                                                }`}
                                            >
                                                <div className="min-h-[50px] min-w-[50px]">
                                                    <img
                                                        src={companyLogo}
                                                        className="w-[50px] h-[50px] rounded-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <p
                                                        className={`${
                                                            isMyMessage
                                                                ? "text-blue-500"
                                                                : "text-black"
                                                        }  font-bold`}
                                                    >
                                                        {messageText}
                                                    </p>
                                                    <p
                                                        className={`text-sm font-extralight ${
                                                            isMyMessage
                                                                ? " text-right"
                                                                : ""
                                                        }`}
                                                    >
                                                        {messageTime}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                            <div
                                ref={lastMessageRef}
                                id="last_message_portion"
                                className="mb-10"
                            ></div>
                        </div>
                        <div className="h-[80px] mx-4 mb-1">
                            <ChatInput
                                onMessageSent={onNewMessageSent}
                                conversationId={currentConversationId}
                                companyId={profile?.company?._id}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-secondary font-bold text-lg">
                        Please select a conversation to continue
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatScreen;
