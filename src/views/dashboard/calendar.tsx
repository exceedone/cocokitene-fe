import { MeetingType } from '@/constants/meeting'
import serviceDashBoard from '@/services/dash-board'
import { Calendar, CalendarProps, Col, Row, Select } from 'antd'
import type { Dayjs } from 'dayjs'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

interface IMeetingInMonth {
    id: number
    meetings_start_time: number
    meetings_end_time: number
    type: MeetingType
}

interface ICalendarCustom {
    isSupperAdmin: boolean
    // eslint-disable-next-line
    onSelectDate: (newValue: Dayjs) => void
    isSystemAdmin?: boolean
}

const CalendarCustom = ({
    isSupperAdmin,
    onSelectDate,
    isSystemAdmin = false,
}: ICalendarCustom) => {
    const t = useTranslations()
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [dataMeeting, setDataMeeting] = useState<IMeetingInMonth[]>([])

    useEffect(() => {
        const getAllMeetingInMonth = async () => {
            const response = await serviceDashBoard.getAllMeetingInMonth(
                month,
                year,
            )
            if (response) {
                setDataMeeting(
                    response.map((meeting) => ({
                        id: meeting.meetings_id,
                        type: meeting.meetings_type,
                        meetings_start_time: new Date(
                            meeting.meetings_start_time,
                        ).setHours(0, 0, 0, 0),
                        meetings_end_time: new Date(
                            meeting.meetings_end_time,
                        ).setHours(23, 59, 59),
                    })),
                )
            }
        }
        if (!isSystemAdmin) {
            getAllMeetingInMonth()
        }
        // eslint-disable-next-line
    }, [month, year])

    const handleSelectDate = (newValue: Dayjs) => {
        setMonth(newValue.month() + 1)
        setYear(newValue.year())
        onSelectDate(newValue)
    }

    const dateCellRender = (value: Dayjs) => {
        const checkMeetingInDay: { shareholder: boolean; board: boolean } = {
            shareholder: false,
            board: false,
        }

        const currentDate = new Date(
            value.year(),
            value.month(),
            value.date(),
        ).setHours(12, 0, 0)

        checkMeetingInDay.shareholder = dataMeeting.some(
            (meeting) =>
                meeting.meetings_start_time <= currentDate &&
                currentDate <= meeting.meetings_end_time &&
                meeting.type == MeetingType.SHAREHOLDER_MEETING,
        )

        checkMeetingInDay.board = dataMeeting.some(
            (meeting) =>
                meeting.meetings_start_time <= currentDate &&
                currentDate <= meeting.meetings_end_time &&
                meeting.type == MeetingType.BOARD_MEETING,
        )

        return (
            <div className="events flex h-2 justify-center gap-[2px]">
                {checkMeetingInDay.shareholder ? (
                    <div className="h-full w-2 rounded border bg-[#135af2]"></div>
                ) : (
                    <div className="invisible h-2 w-2"></div>
                )}
                {checkMeetingInDay.board ? (
                    <div className="h-full w-2 rounded border bg-[#ed7b34]"></div>
                ) : (
                    <div className="invisible h-2 w-2"></div>
                )}
            </div>
        )
    }

    const cellRender: CalendarProps<Dayjs>['cellRender'] = useCallback(
        (current: any, info: any) => {
            if (info.type === 'date') return dateCellRender(current)
            return info.originNode
        },
        // eslint-disable-next-line
        [dataMeeting],
    )

    return (
        <>
            <Calendar
                mode={isSupperAdmin || isSystemAdmin ? 'year' : 'month'}
                fullscreen={false}
                headerRender={({ value, onChange }) => {
                    const start = 0
                    const end = 12
                    const monthOptions = []

                    let current = value.clone()
                    // @ts-ignore
                    const localeData = value.localeData()
                    const months = []
                    for (let i = 0; i < 12; i++) {
                        current = current.month(i)
                        months.push(localeData.monthsShort(current))
                    }

                    for (let i = start; i < end; i++) {
                        monthOptions.push(
                            <Select.Option
                                key={i}
                                value={i}
                                className="month-item"
                            >
                                {months[i]}
                            </Select.Option>,
                        )
                    }

                    const year = new Date().getFullYear()
                    const month = value.month()
                    const options = []
                    for (let i = year - 5; i < year + 5; i += 1) {
                        options.push(
                            <Select.Option
                                key={i}
                                value={i}
                                className="year-item"
                            >
                                {i}
                            </Select.Option>,
                        )
                    }
                    return (
                        <div className="flex w-full items-center justify-between">
                            <div style={{ padding: 8 }}>
                                <Row gutter={8}>
                                    <Col>
                                        <Select
                                            size="small"
                                            dropdownMatchSelectWidth={false}
                                            className="my-year-select"
                                            value={value.year()}
                                            onChange={(newYear) => {
                                                const now = value
                                                    .clone()
                                                    .year(newYear)
                                                onChange(now)
                                            }}
                                        >
                                            {options}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Select
                                            size="small"
                                            dropdownMatchSelectWidth={false}
                                            value={month}
                                            className={`${
                                                isSupperAdmin || isSystemAdmin
                                                    ? 'hidden'
                                                    : ''
                                            }`}
                                            onChange={(newMonth) => {
                                                const now = value
                                                    .clone()
                                                    .month(newMonth)
                                                onChange(now)
                                            }}
                                        >
                                            {monthOptions}
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                            {isSupperAdmin || isSystemAdmin || (
                                <div className="flex flex-col px-2">
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded border bg-[#135af2]"></div>
                                        <span className="text-xs">
                                            {t('SHAREHOLDER_MEETING')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded border bg-[#ed7b34]"></div>
                                        <span className="text-xs">
                                            {t('BOARD_MEETING')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }}
                onSelect={handleSelectDate}
                cellRender={
                    !isSupperAdmin && !isSystemAdmin ? cellRender : undefined
                }
            />
        </>
    )
}

export default CalendarCustom
