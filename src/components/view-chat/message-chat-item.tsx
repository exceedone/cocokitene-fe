export interface IMessageChatItem {
    from: string
    to: string
    message: string
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
    // eslint-disable-next-line
    setSentUserTo: (e: string) => void
}

export const MessageChatItemToYou = ({
    from,
    to,
    message,
    date,
    messageInfoPrev,
    setSentUserTo,
}: IMessageChatItem) => {
    return (
        <div className="flex w-full flex-col gap-[2px]">
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
            <div className="mb-[1px] flex">
                <span className="h-auto min-w-[70px] max-w-[300px] break-words rounded-lg border border-black-45 p-1 text-[14px]">
                    {message.split('\n').map((mess, index) => {
                        return <div key={index}>{mess}</div>
                    })}
                    <span className="text-[10px]">
                        {date.hour}:
                        {date.minute < 10 ? '0' + date.minute : date.minute}
                    </span>
                </span>
            </div>
        </div>
    )
}

export const MessageChatItemFromYou = ({
    from,
    to,
    message,
    date,
    messageInfoPrev,
    setSentUserTo,
}: IMessageChatItem) => {
    return (
        <div className="flex w-full flex-col gap-[2px]">
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
            <div className="mb-[1px] flex justify-end">
                <span className="h-auto min-w-[70px] max-w-[300px] break-words rounded-lg border border-black-45 p-1 pl-1 text-[14px]">
                    {message.split('\n').map((mess, index) => {
                        return <div key={index}>{mess}</div>
                    })}
                    <span className="text-[10px]">
                        {date.hour}:
                        {date.minute < 10 ? '0' + date.minute : date.minute}
                    </span>
                </span>
            </div>
        </div>
    )
}
