/* eslint-disable */
import serviceReactionIcon from '@/services/reaction-icon'
import { IReactionIconResponse } from '@/services/response.type'
import { useAuthLogin } from '@/stores/auth/hooks'
import { truncateString } from '@/utils/format-string'
import { CommentOutlined, SmileOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { FaAngry, FaHeart, FaSadCry, FaSmile, FaThumbsUp } from 'react-icons/fa'

const reactionIconMap: Record<string, ReactElement> = {
    ':thumbsup:': <FaThumbsUp />,
    ':ionnocent:': <FaSmile />,
    ':heart:': <FaHeart />,
    ':sob:': <FaSadCry />,
    ':rage:': <FaAngry />,
}

const reactionColorMap: Record<string, string> = {
    ':thumbsup:': 'text-[#1E76FF]',
    ':ionnocent:': 'text-[#f2c239]',
    ':heart:': 'text-[#E3373F]',
    ':sob:': 'text-[#f2c239]',
    ':rage:': 'text-[#E24439]',
}

export interface IReactionGroup {
    key: string
    messageId: number
    userEmail: string[]
}

export interface IMessageChatItem {
    id: number
    from: string
    to: string
    message: string
    scrollTo: boolean
    date: {
        year: number
        month: number
        day: number
        hour: number
        minute: number
    }
    messageInfoPrev: {
        from: string
        to: string
        datePrev: {
            year: number
            month: number
            day: number
        }
    }
    replyMessage?: {
        id: number
        from: string
        to: string
        content: string
    }
    // eslint-disable-next-line
    setSentUserTo: (e: string) => void
    // eslint-disable-next-line no-unused-vars
    setReplyMessage: (e: number) => void
    // eslint-disable-next-line
    scrollToMessageReply: (id: number) => void

    // eslint-disable-next-line no-undef
    setReactionMessageId: (
        reactionIconId: number,
        messageId: number,
        to: string,
        from?: string,
    ) => void
    // eslint-disable-next-line no-undef
    reactions?: {
        id: number
        messageId: number
        userId: number
        emoji: {
            id: number
            key: string
        }
    }[]
    // eslint-disable-next-line no-undef

    participantToSendMessage: {
        userId: number
        userEmail: string
    }[]
}

export const MessageChatItemToYou = ({
    id,
    from,
    to,
    message,
    reactions,
    date,
    messageInfoPrev,
    setSentUserTo,
    replyMessage,
    setReplyMessage,
    scrollToMessageReply,
    scrollTo,
    setReactionMessageId,
    participantToSendMessage,
}: IMessageChatItem) => {
    const { authState } = useAuthLogin()
    const [isHover, setIsHover] = useState(false)
    const [isHoverLike, setIsHoverLike] = useState(false)
    const [reactionIconList, setReactionIconList] =
        useState<IReactionIconResponse[]>()

    const messageRef = useRef<HTMLDivElement>(null)
    const [messageWidth, setMessageWidth] = useState<number>(0)
    useEffect(() => {
        if (messageRef.current) {
            setMessageWidth(messageRef.current.offsetWidth)
        }
    }, [])

    useEffect(() => {
        try {
            const fetDataReactionIcons = async () => {
                const reactionIconList =
                    await serviceReactionIcon.getAllReactionIcon()
                if (reactionIconList) {
                    setReactionIconList(reactionIconList)
                }
            }
            fetDataReactionIcons()
        } catch (error) {
            console.log(error)
        }
    }, [])

    let groupedReactionsL: { [id: number]: IReactionGroup } = {}
    reactions?.forEach((item, index) => {
        const userEmail =
            participantToSendMessage.find((e) => e.userId === item.userId)
                ?.userEmail || authState?.userData?.email
        if (groupedReactionsL[item.emoji.id]) {
            groupedReactionsL[item.emoji.id].userEmail.push(userEmail || '')
        } else {
            groupedReactionsL[item.emoji.id] = {
                key: item.emoji.key,
                messageId: item.messageId,
                userEmail: [userEmail || ''],
            }
        }
    })

    return (
        <div
            className="flex w-full flex-col "
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {(messageInfoPrev.datePrev.year === date.year &&
                messageInfoPrev.datePrev.month === date.month &&
                messageInfoPrev.datePrev.day === date.day) || (
                <span className="border-blue mx-auto my-2 rounded-xl border bg-gray-400 px-2 text-white">
                    {date.day}/{date.month}/{date.year}
                </span>
            )}
            {(messageInfoPrev?.from == from &&
                messageInfoPrev?.to == to &&
                messageInfoPrev.datePrev.year === date.year &&
                messageInfoPrev.datePrev.month === date.month &&
                messageInfoPrev.datePrev.day === date.day) || (
                <div className="mt-2 flex">
                    <span className="pl-1 text-xs font-thin">
                        <span className="font-normal text-black">from </span>
                        <span
                            className="cursor-pointer text-[#0547e3]"
                            onClick={() => {
                                setSentUserTo(from)
                            }}
                        >
                            {from}
                        </span>
                        <span className="font-normal text-black"> to </span>
                        <span
                            className="cursor-pointer text-[#e305b3]"
                            onClick={() => {
                                setSentUserTo(to)
                            }}
                        >
                            {to}
                        </span>
                    </span>
                </div>
            )}
            <div
                className={`relative  flex items-center ${
                    groupedReactionsL &&
                    Object.keys(groupedReactionsL).length > 0
                        ? 'mb-2'
                        : ''
                }`}
            >
                <span
                    className={`relative h-auto min-w-[70px] max-w-[300px]  break-words rounded-lg border border-gray-300 p-1 pl-1 text-[14px] ${
                        groupedReactionsL ? 'mb-[5px]' : ''
                    } ${
                        scrollTo ? 'animate-scale-up-message bg-blue-200' : ''
                    }  `}
                >
                    {replyMessage !== undefined && (
                        <div
                            className="mb-1 border-l-[3px] border-black-45 bg-gray-200 p-1 font-semibold text-white"
                            onClick={() => {
                                scrollToMessageReply(replyMessage.id)
                            }}
                        >
                            <div className="text-gray-500">
                                {replyMessage.from}
                            </div>
                            <span className="text-[12px] text-gray-500">
                                {' '}
                                {truncateString({
                                    text: replyMessage?.content,
                                    start: 20,
                                    end: 0,
                                })}{' '}
                            </span>
                        </div>
                    )}

                    {message.split('\n').map((mess, index) => {
                        return (
                            <div
                                ref={messageRef}
                                key={index}
                                style={{
                                    maxWidth: '150px',
                                    whiteSpace: 'normal',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {mess}
                            </div>
                        )
                    })}

                    <span className="text-[10px]">
                        {date.hour}:
                        {date.minute < 10 ? '0' + date.minute : date.minute}
                    </span>
                    {Object.keys(groupedReactionsL).length > 0 && (
                        <div
                            style={{ marginLeft: messageWidth }}
                            className=" absolute bottom-[-15px] right-0  mb-[9px] mr-2 mt-0 flex gap-[3px] rounded-md border border-solid bg-gray-200"
                        >
                            {Object.entries(groupedReactionsL).map(
                                ([emojiId, reactionGroup], index) => (
                                    <Tooltip
                                        key={index}
                                        color="gray"
                                        placement="topLeft"
                                        title={reactionGroup.userEmail
                                            .map((email) =>
                                                truncateString({
                                                    text: email,
                                                    start: 10,
                                                    end: 0,
                                                }),
                                            )
                                            .join(', ')}
                                        overlayStyle={{ maxWidth: '120px' }}
                                    >
                                        <div
                                            className={`cursor-pointer rounded-md hover:scale-125 ${
                                                reactionGroup.key in
                                                reactionColorMap
                                                    ? reactionColorMap[
                                                          reactionGroup.key
                                                      ]
                                                    : ''
                                            }`}
                                            style={{ display: 'inline-block' }}
                                        >
                                            {reactionGroup.key in
                                            reactionIconMap
                                                ? reactionIconMap[
                                                      reactionGroup.key
                                                  ]
                                                : null}
                                        </div>
                                    </Tooltip>
                                ),
                            )}
                        </div>
                    )}
                </span>

                {isHover && (
                    <div className="ml-1 flex h-[25px] items-center justify-between gap-1 rounded-3xl border border-gray-500 bg-white p-1">
                        <CommentOutlined
                            style={{
                                fontSize: '20px',
                                color: '#5151e5',
                            }}
                            onClick={() => {
                                setReplyMessage(id)
                            }}
                        />
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setIsHoverLike(true)}
                            onMouseLeave={() => setIsHoverLike(false)}
                        >
                            <SmileOutlined
                                style={{
                                    fontSize: '20px',
                                    color: '#5151e5',
                                    cursor: 'pointer',
                                }}
                            />
                            {isHoverLike && (
                                <div className="absolute bottom-5 left-[-1px] flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                                    {reactionIconList &&
                                        reactionIconList.map((icon, index) => {
                                            let ischecked: boolean = false
                                            const findReactionChoiced =
                                                groupedReactionsL[icon.id]
                                            // @ts-ignore
                                            if (
                                                findReactionChoiced &&
                                                findReactionChoiced.userEmail.includes(
                                                    authState.userData?.email ||
                                                        '',
                                                ) === true
                                            ) {
                                                ischecked = true
                                            }
                                            return (
                                                <div
                                                    key={index}
                                                    className={`cursor-pointer rounded-md px-1 py-1 text-lg hover:scale-125 ${
                                                        icon.key in
                                                        reactionColorMap
                                                            ? reactionColorMap[
                                                                  icon.key
                                                              ]
                                                            : ''
                                                    }   ${
                                                        ischecked
                                                            ? 'bg-gray-300'
                                                            : ''
                                                    }    `}
                                                    onClick={() =>
                                                        setReactionMessageId(
                                                            icon.id,
                                                            id,
                                                            to,
                                                            from,
                                                        )
                                                    }
                                                >
                                                    {icon.key in reactionIconMap
                                                        ? reactionIconMap[
                                                              icon.key
                                                          ]
                                                        : null}
                                                </div>
                                            )
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export const MessageChatItemFromYou = ({
    id,
    from,
    to,
    message,
    date,
    messageInfoPrev,
    setSentUserTo,
    replyMessage,
    reactions,
    setReplyMessage,
    scrollToMessageReply,
    scrollTo,
    setReactionMessageId,
    participantToSendMessage,
}: IMessageChatItem) => {
    const { authState } = useAuthLogin()
    const [isHover, setIsHover] = useState(false)
    const [isHoverLike, setIsHoverLike] = useState(false)
    const [reactionIconList, setReactionIconList] =
        useState<IReactionIconResponse[]>()

    useEffect(() => {
        try {
            const fetDataReactionIcons = async () => {
                const reactionIconList =
                    await serviceReactionIcon.getAllReactionIcon()
                if (reactionIconList) {
                    setReactionIconList(reactionIconList)
                }
            }
            fetDataReactionIcons()
        } catch (error) {
            console.log(error)
        }
    }, [])

    let groupedReactionsL: { [id: number]: IReactionGroup } = {}
    reactions?.forEach((item, index) => {
        const userEmail =
            participantToSendMessage.find((e) => e.userId === item.userId)
                ?.userEmail || authState?.userData?.email
        if (groupedReactionsL[item.emoji.id]) {
            groupedReactionsL[item.emoji.id].userEmail.push(userEmail || '')
        } else {
            groupedReactionsL[item.emoji.id] = {
                key: item.emoji.key,
                messageId: item.messageId,
                userEmail: [userEmail || ''],
            }
        }
    })

    return (
        <div
            className="flex w-full flex-col "
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {(messageInfoPrev.datePrev.year === date.year &&
                messageInfoPrev.datePrev.month === date.month &&
                messageInfoPrev.datePrev.day === date.day) || (
                <span className="border-blue mx-auto my-2 rounded-xl border bg-gray-400 px-2 text-white">
                    {date.day}/{date.month}/{date.year}
                </span>
            )}
            {(messageInfoPrev?.from == from &&
                messageInfoPrev?.to == to &&
                messageInfoPrev.datePrev.year === date.year &&
                messageInfoPrev.datePrev.month === date.month &&
                messageInfoPrev.datePrev.day === date.day) || (
                <div className="mt-2 flex justify-end">
                    <span className="pl-1 text-xs font-thin">
                        <span className="font-normal text-black">from </span>
                        <span
                            className="cursor-pointer text-[#0547e3]"
                            onClick={() => {
                                setSentUserTo(from)
                            }}
                        >
                            You
                        </span>
                        <span className="font-normal text-black"> to </span>
                        <span
                            className="cursor-pointer text-[#e305b3]"
                            onClick={() => {
                                setSentUserTo(to)
                            }}
                        >
                            {to}
                        </span>
                    </span>
                </div>
            )}
            <div className="flex items-center justify-end">
                {isHover && (
                    <div className="ml-1 flex h-[25px] items-center justify-between gap-1 rounded-3xl border border-gray-500 bg-white p-1">
                        <CommentOutlined
                            style={{
                                fontSize: '20px',
                                color: '#5151e5',
                            }}
                            onClick={() => {
                                setReplyMessage(id)
                            }}
                        />
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setIsHoverLike(true)}
                            onMouseLeave={() => setIsHoverLike(false)}
                        >
                            <SmileOutlined
                                style={{
                                    fontSize: '20px',
                                    color: '#5151e5',
                                    cursor: 'pointer',
                                }}
                            />
                            {isHoverLike && (
                                <div className="absolute bottom-5 right-2 flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                                    {reactionIconList &&
                                        reactionIconList.map((icon, index) => {
                                            let ischecked: boolean = false
                                            const findReactionChoiced =
                                                groupedReactionsL[icon.id]
                                            // @ts-ignore
                                            if (
                                                findReactionChoiced &&
                                                findReactionChoiced.userEmail.includes(
                                                    authState.userData?.email ||
                                                        '',
                                                ) === true
                                            ) {
                                                ischecked = true
                                            }
                                            return (
                                                <div
                                                    key={index}
                                                    className={`cursor-pointer rounded-md px-1  py-1 text-lg hover:scale-125 ${
                                                        icon.key in
                                                        reactionColorMap
                                                            ? reactionColorMap[
                                                                  icon.key
                                                              ]
                                                            : ''
                                                    }   ${
                                                        ischecked
                                                            ? 'bg-gray-200'
                                                            : ''
                                                    }    `}
                                                    onClick={() =>
                                                        setReactionMessageId(
                                                            icon.id,
                                                            id,
                                                            to,
                                                            from,
                                                        )
                                                    }
                                                >
                                                    {icon.key in reactionIconMap
                                                        ? reactionIconMap[
                                                              icon.key
                                                          ]
                                                        : null}
                                                </div>
                                            )
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div
                    className={`relative flex flex-col  ${
                        groupedReactionsL &&
                        Object.keys(groupedReactionsL).length > 0
                            ? 'mb-2'
                            : ''
                    }`}
                >
                    <span
                        className={`h-auto min-w-[70px] max-w-[300px]  break-words rounded-lg border border-gray-300 p-1 pl-1 text-[14px] ${
                            groupedReactionsL ? 'mb-[5px]' : ''
                        } ${
                            scrollTo
                                ? 'animate-scale-up-message bg-blue-200'
                                : ''
                        }  `}
                    >
                        {replyMessage !== undefined && (
                            <div
                                className="mb-1 border-l-[3px] border-black-45 bg-gray-200 p-1 font-semibold text-white"
                                onClick={() => {
                                    scrollToMessageReply(replyMessage.id)
                                }}
                            >
                                <div className="text-gray-500">
                                    {replyMessage.from}
                                </div>
                                <span className="text-[12px] text-gray-500">
                                    {' '}
                                    {truncateString({
                                        text: replyMessage?.content,
                                        start: 20,
                                        end: 0,
                                    })}{' '}
                                </span>
                            </div>
                        )}

                        {message.split('\n').map((mess, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        maxWidth: '150px',
                                        whiteSpace: 'normal',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {mess}
                                </div>
                            )
                        })}
                        <span className="float-right text-[10px]">
                            {date.hour}:
                            {date.minute < 10 ? '0' + date.minute : date.minute}
                        </span>
                    </span>
                    {Object.keys(groupedReactionsL).length > 0 && (
                        <div className="absolute bottom-[-10px] left-2 mb-[9px] mr-2 mt-0 flex justify-end gap-[3px] rounded-md border border-solid bg-gray-200">
                            {Object.entries(groupedReactionsL).map(
                                ([emojiId, reactionGroup], index) => (
                                    <Tooltip
                                        key={index}
                                        color="gray"
                                        placement="topRight"
                                        title={reactionGroup.userEmail
                                            .map((email) =>
                                                truncateString({
                                                    text: email,
                                                    start: 10,
                                                    end: 0,
                                                }),
                                            )
                                            .join(', ')}
                                        overlayStyle={{ maxWidth: '120px' }}
                                    >
                                        <div
                                            className={`cursor-pointer rounded-md hover:scale-125 ${
                                                reactionGroup.key in
                                                reactionColorMap
                                                    ? reactionColorMap[
                                                          reactionGroup.key
                                                      ]
                                                    : ''
                                            }`}
                                            style={{ display: 'inline-block' }}
                                        >
                                            {reactionGroup.key in
                                            reactionIconMap
                                                ? reactionIconMap[
                                                      reactionGroup.key
                                                  ]
                                                : null}
                                        </div>
                                    </Tooltip>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
