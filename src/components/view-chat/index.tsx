'use client'
/* eslint-disable */

import { MessageTwoTone, MinusOutlined, SendOutlined } from '@ant-design/icons'
import { Row, Select, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ChangeEvent, useEffect, useMemo, useState, useRef } from 'react'
import {
    MessageChatItemFromYou,
    MessageChatItemToYou,
} from './message-chat-item'
import { useAuthLogin } from '@/stores/auth/hooks'
import { DataMessageChat } from '@/services/response.type'
import { FETCH_STATUS } from '@/constants/common'
import serviceChatMeeting from '@/services/chat-meeting'
// Socket
import { io } from 'socket.io-client'

enum ScrollType {
    SMOOTH = 1,
    FAST = 2,
}
interface IParticipantDetail {
    roleMtgId: number
    roleMtgName: string
    userParticipants: {
        userId: number
        avatar?: string
        userEmail: string
    }[]
}

interface IMeetingInfo {
    id: number
    title: string
    participants: IParticipantDetail[]
}

interface IMeetingChat {
    meetingInfo: IMeetingInfo
}

const MeetingChat = ({ meetingInfo }: IMeetingChat) => {
    const bottomOfMessageChat = useRef<null | HTMLElement>(null)

    const { authState } = useAuthLogin()

    const [scrollToBottom, setScrollToBottom] = useState<{
        type: ScrollType
        scroll: boolean
    }>({
        type: ScrollType.SMOOTH,
        scroll: false,
    })
    const [dataChat, setDataChat] = useState<{
        roomChat: number
        messageChat: DataMessageChat[]
    }>({
        roomChat: meetingInfo.id,
        messageChat: [],
    })
    const [chatModalOpen, setChatModalOpen] = useState<boolean>(false)
    const [valueMessage, setValueMessage] = useState<string>('')
    const [sendToUser, setSendToUser] = useState<number>(0)
    const [initStatus, setInitStatus] = useState<FETCH_STATUS>(
        FETCH_STATUS.IDLE,
    )

    //Socket
    const [socket, setSocket] = useState<any>(undefined)

    //Scroll to bottom of chat

    useEffect(() => {
        const socket = io(String(process.env.NEXT_PUBLIC_API_SOCKET))

        socket.on(`receive_chat_public/${dataChat.roomChat}`, (message) => {
            console.log('message public Chat: ', message)

            setDataChat((prev) => {
                return {
                    roomChat: prev.roomChat,
                    messageChat: [...prev.messageChat, message],
                }
            })
        })

        socket.on(
            `receive_chat_private/${dataChat.roomChat}/${authState.userData?.id}`,
            (message) => {
                console.log('message private chat: ', message)

                setDataChat((prev) => {
                    return {
                        roomChat: prev.roomChat,
                        messageChat: [
                            ...prev.messageChat,
                            {
                                ...message,
                                receiverId: message.receiverId
                                    ? message.receiverId
                                    : 0,
                            },
                        ],
                    }
                })
            },
        )
        setSocket(socket)
    }, [])

    useEffect(() => {
        const fetchDataChat = async (meetingId: number) => {
            setInitStatus(FETCH_STATUS.LOADING)
            try {
                const res =
                    await serviceChatMeeting.getAllMessageChatByMeetingId(
                        meetingId,
                    )
                if (res) {
                    setDataChat(res)
                    setInitStatus(FETCH_STATUS.SUCCESS)
                }
            } catch (error) {}
        }

        if (meetingInfo.id) {
            fetchDataChat(meetingInfo.id)
        }
    }, [meetingInfo.id])

    useEffect(() => {
        if (scrollToBottom.scroll) {
            if (scrollToBottom.type == ScrollType.SMOOTH) {
                bottomOfMessageChat.current?.scrollIntoView({
                    behavior: 'smooth',
                    // block: 'end',
                    // inline: 'nearest',
                })
            } else {
                bottomOfMessageChat.current?.scrollIntoView({})
            }
            // console.log('scrollToBottom :', scrollToBottom)
            setScrollToBottom({
                type: ScrollType.FAST,
                scroll: false,
            })
        }
    }, [scrollToBottom])

    const participantToSendMessage = useMemo(() => {
        const participant = meetingInfo.participants
            .map((participant) => participant.userParticipants)
            .flatMap((user) => user)

        const cachedObject: {
            [key in string]: boolean
        } = {}
        const uniqueParticipant = participant
            .filter((obj) => {
                if (
                    !cachedObject[obj.userId] &&
                    obj.userId !== authState.userData?.id
                ) {
                    cachedObject[obj.userId] = true
                    return true
                }
                return false
            })
            .map((user) => {
                return {
                    userId: user.userId,
                    userEmail: user.userEmail,
                }
            })

        return [
            {
                userId: 0,
                userEmail: 'EveryOne',
            },
            ...uniqueParticipant,
        ]
    }, [...meetingInfo.participants])

    // console.log('participantToSendMessage', participantToSendMessage)

    const objParticipant = useMemo((): { [key in number]: string } => {
        const participant = meetingInfo.participants
            .map((participant) => participant.userParticipants)
            .flatMap((user) => user)

        const cachedObject: {
            [key in string]: string
        } = {}
        participant.forEach((obj) => {
            if (!cachedObject[obj.userId]) {
                cachedObject[obj.userId] = obj.userEmail
            }
        })

        return {
            0: 'EveryOne',
            ...cachedObject,
        }
    }, [...meetingInfo.participants])

    // console.log('objParticipant', objParticipant)

    const toggleModelDetailResolution = () => {
        if (!chatModalOpen) {
            setScrollToBottom({
                type: ScrollType.SMOOTH,
                scroll: true,
            })
        }
        setChatModalOpen(!chatModalOpen)
    }

    const onChange = (value: string) => {
        setSendToUser(+value)
    }

    //
    const choiceSendMessageTo = (e: string) => {
        const idOfUserToSendMessage = participantToSendMessage.find(
            (user) => user.userEmail.toLowerCase() == e.toLowerCase(),
        )
        if (idOfUserToSendMessage) {
            setSendToUser(+idOfUserToSendMessage.userId)
        }
    }

    const filterOption = (
        input: string,
        option?: { label: string; value: string },
    ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    const pressMessageChat = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValueMessage(e.target.value)
    }

    const sendMessage = () => {
        const idSender = authState.userData?.id
        const receiverId = sendToUser == 0 ? null : sendToUser

        // console.log('receiverId: ', receiverId)

        if (idSender) {
            // console.log(
            //     `Send Message to ${sendToUser} message : ${valueMessage}`,
            // )
            const now = new Date()
            const year = now.getFullYear()
            const month = (now.getMonth() + 1).toString().padStart(2, '0')
            const day = now.getDate().toString().padStart(2, '0')
            const hours = now.getHours().toString().padStart(2, '0')
            const minutes = now.getMinutes().toString().padStart(2, '0')
            const seconds = now.getSeconds().toString().padStart(2, '0')
            const milliseconds = now
                .getMilliseconds()
                .toString()
                .padStart(3, '0')

            const isoStringWithZ = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`

            // Send Chat Private
            if (receiverId) {
                socket.emit('send_chat_private', {
                    meetingId: meetingInfo.id,
                    receiver: {
                        id: receiverId,
                        email: objParticipant[sendToUser],
                    },
                    sender: {
                        id: idSender,
                        email: objParticipant[idSender],
                    },
                    content: valueMessage,
                })
            } else {
                //Send chat Publish
                socket.emit('send_chat_public', {
                    meetingId: meetingInfo.id,
                    receiver: {
                        id: receiverId,
                        email: objParticipant[sendToUser],
                    },
                    sender: {
                        id: idSender,
                        email: objParticipant[idSender],
                    },
                    content: valueMessage,
                })
                console.log(
                    meetingInfo.id,
                    sendToUser,
                    objParticipant[sendToUser],
                    idSender,
                    objParticipant[idSender],
                    valueMessage,
                )
            }

            setDataChat((prev) => {
                return {
                    roomChat: prev.roomChat,
                    messageChat: [
                        ...prev.messageChat,
                        {
                            receiver: {
                                id: sendToUser,
                                email: objParticipant[sendToUser],
                            },
                            sender: {
                                id: idSender,
                                email: objParticipant[idSender],
                            },
                            content: valueMessage,
                            createdAt: isoStringWithZ,
                        },
                    ],
                }
            })

            setScrollToBottom({
                type: ScrollType.FAST,
                scroll: true,
            })
        } else {
            console.log('Send message chat failed!!! UnAuthor')
        }
        setValueMessage('')
    }

    return (
        <>
            <div className="fixed bottom-7 right-5 h-auto">
                {/* <Modal
                    open={chatModalOpen}
                    onCancel={toggleModelDetailResolution}
                    footer={[]}
                > */}

                {/* {chatModalOpen && ( */}
                <div
                    className={`mb-14 mr-3 border bg-white ${
                        chatModalOpen
                            ? 'animate-message-chat-move-left'
                            : 'hidden animate-message-chat-move-right'
                    }`}
                >
                    <div className="flex h-[600px] w-[400px] flex-col">
                        {initStatus === FETCH_STATUS.LOADING ? (
                            <Row
                                align={'middle'}
                                justify={'center'}
                                style={{ height: '40vh' }}
                            >
                                <Spin tip="Loading..." />
                            </Row>
                        ) : (
                            <>
                                <div className="relative flex h-[7%] w-full items-center bg-[#5151e5] px-2">
                                    <span className="text-xl font-medium text-[#ffffff]">
                                        Chat {meetingInfo.title}
                                    </span>
                                    <MinusOutlined
                                        className="absolute right-1 top-[5px]"
                                        onClick={toggleModelDetailResolution}
                                        style={{
                                            fontSize: '22px',
                                            color: '#ffffff',
                                        }}
                                    />
                                </div>
                                <div className="h-[77%] p-2">
                                    <div className="border-black-500 h-full overflow-hidden border px-2 hover:overflow-y-auto">
                                        {dataChat?.messageChat.map(
                                            (message, index) => {
                                                //Get Date of Message
                                                const dateMessage = new Date(
                                                    message.createdAt,
                                                )
                                                const dateInfo = {
                                                    year: dateMessage.getUTCFullYear(),
                                                    month:
                                                        dateMessage.getUTCMonth() +
                                                        1,
                                                    day: dateMessage.getUTCDate(),
                                                    hour: dateMessage.getUTCHours(),
                                                    minute: dateMessage.getUTCMinutes(),
                                                }
                                                //Get Date of Message Prev
                                                let dateInfoPrev: {
                                                    year: number
                                                    month: number
                                                    day: number
                                                }
                                                if (index == 0) {
                                                    dateInfoPrev = {
                                                        year: 0,
                                                        month: 0,
                                                        day: 0,
                                                    }
                                                } else {
                                                    const dateMessagePrev =
                                                        new Date(
                                                            dataChat.messageChat[
                                                                index - 1
                                                            ].createdAt,
                                                        )
                                                    dateInfoPrev = {
                                                        year: dateMessagePrev.getUTCFullYear(),
                                                        month:
                                                            dateMessagePrev.getUTCMonth() +
                                                            1,
                                                        day: dateMessagePrev.getUTCDate(),
                                                    }
                                                }

                                                if (
                                                    message.sender?.id ==
                                                    authState.userData?.id
                                                ) {
                                                    return (
                                                        <MessageChatItemFromYou
                                                            key={index}
                                                            from={
                                                                message.sender
                                                                    .email
                                                            }
                                                            to={
                                                                message.receiver
                                                                    .email
                                                            }
                                                            date={dateInfo}
                                                            message={
                                                                message.content
                                                            }
                                                            messageInfoPrev={{
                                                                from: dataChat
                                                                    .messageChat[
                                                                    index - 1
                                                                ]?.sender.email,
                                                                to: dataChat
                                                                    .messageChat[
                                                                    index - 1
                                                                ]?.receiver
                                                                    .email,
                                                                datePrev: {
                                                                    ...dateInfoPrev,
                                                                },
                                                            }}
                                                            setSentUserTo={
                                                                choiceSendMessageTo
                                                            }
                                                        />
                                                    )
                                                }

                                                return (
                                                    <MessageChatItemToYou
                                                        key={index}
                                                        from={
                                                            message.sender.email
                                                        }
                                                        to={
                                                            message.receiver.email.toLowerCase() ==
                                                            authState.userData?.email.toLowerCase()
                                                                ? 'You'
                                                                : message
                                                                      .receiver
                                                                      .email
                                                        }
                                                        date={dateInfo}
                                                        message={
                                                            message.content
                                                        }
                                                        messageInfoPrev={{
                                                            from: dataChat
                                                                .messageChat[
                                                                index - 1
                                                            ]?.sender.email,
                                                            to:
                                                                dataChat
                                                                    .messageChat[
                                                                    index - 1
                                                                ]?.receiver
                                                                    .email ==
                                                                authState
                                                                    .userData
                                                                    ?.email
                                                                    ? 'You'
                                                                    : dataChat
                                                                          .messageChat[
                                                                          index -
                                                                              1
                                                                      ]
                                                                          ?.receiver
                                                                          .email,
                                                            datePrev: {
                                                                ...dateInfoPrev,
                                                            },
                                                        }}
                                                        setSentUserTo={
                                                            choiceSendMessageTo
                                                        }
                                                    />
                                                )
                                            },
                                        )}
                                        <span ref={bottomOfMessageChat}></span>
                                    </div>
                                </div>
                                <div className="flex h-[15%] gap-5 px-2">
                                    <div className="flex w-[95%] flex-col gap-2">
                                        <div>
                                            <span>To : </span>
                                            <Select
                                                defaultValue={'0'}
                                                value={String(sendToUser)}
                                                showSearch
                                                placeholder="Select a person"
                                                optionFilterProp="children"
                                                onChange={onChange}
                                                // onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={participantToSendMessage.map(
                                                    (user) => ({
                                                        value: user.userId + '',
                                                        label: user.userEmail,
                                                    }),
                                                )}
                                                size={'small'}
                                                className="w-[50%] rounded-[7px]"
                                            />
                                        </div>

                                        <div className="flex w-full items-center gap-5">
                                            <TextArea
                                                value={valueMessage}
                                                onChange={(e) =>
                                                    pressMessageChat(e)
                                                }
                                                placeholder="Please input message"
                                                autoSize={{
                                                    minRows: 2,
                                                    maxRows: 2,
                                                }}
                                                onKeyUp={(e) => {
                                                    if (
                                                        e.keyCode == 13 &&
                                                        !e.shiftKey &&
                                                        valueMessage.trim()
                                                    ) {
                                                        // console.log(
                                                        //     'SendMessage by Enter key',
                                                        // )
                                                        sendMessage()
                                                    }
                                                    if (
                                                        e.keyCode == 13 &&
                                                        e.shiftKey
                                                    ) {
                                                        // console.log(
                                                        //     'Shift + Enter Key!!!!',
                                                        // )
                                                    }
                                                }}
                                            />
                                            <SendOutlined
                                                style={{
                                                    fontSize: '22px',
                                                    color: '#5151e5',
                                                }}
                                                onClick={() => {
                                                    if (valueMessage.trim()) {
                                                        sendMessage()
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* )} */}
                {/* </Modal> */}

                <MessageTwoTone
                    twoToneColor="#5151e5"
                    style={{ fontSize: '48px' }}
                    onClick={toggleModelDetailResolution}
                    className="absolute bottom-0 right-0"
                />
            </div>
        </>
    )
}

export default MeetingChat
