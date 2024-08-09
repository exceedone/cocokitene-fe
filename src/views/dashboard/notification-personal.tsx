import {
    MeetingStatus,
    MeetingStatusColor,
    MeetingStatusName,
} from '@/constants/meeting'
import { IMeeting } from '@/stores/meeting/types'
import { enumToArray } from '@/utils'
import { calculateTimeDifference, formatTimeMeeting } from '@/utils/date'
import Table, { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import EmptyData from '../service-plan/service-plan-list/empty-plan'
import serviceDashBoard from '@/services/dash-board'
import { IStatisticMeetingInMonthResponse } from '@/services/response.type'

import { Pie } from '@ant-design/plots'
import { Spin } from 'antd'

interface NotificationMeetingUser {
    key: React.Key
    meetingName: string
    duration: string
    takesPlaceAfter: string
    status: MeetingStatus
}

const NotificationUser = ({ date }: { date: Date }) => {
    const t = useTranslations()
    const [dataMeeting, setDataMeeting] = useState<IMeeting[]>([])
    const [loadingFetchData, setLoadingFetchData] = useState<boolean>(true)

    let locale = {
        emptyText: <EmptyData />,
    }

    useEffect(() => {
        const fetchDataMeeting = async () => {
            setLoadingFetchData(true)
            const meetingInDay = await serviceDashBoard.getAllMeetingInDay({
                page: 1,
                limit: 100,
                date: date,
            })
            if (meetingInDay) {
                setDataMeeting(meetingInDay.items)
            }
            setLoadingFetchData(false)
        }
        fetchDataMeeting()
    }, [date])

    const dataColumn: NotificationMeetingUser[] = useMemo(() => {
        console.log('dataMeeting: ', dataMeeting)

        return dataMeeting.map((meeting, i) => {
            const differenceDate = calculateTimeDifference(
                meeting.meetings_start_time,
            )

            const statusMeeting =
                enumToArray(MeetingStatus).find(
                    (status) => status == meeting.meetings_status,
                ) ?? MeetingStatus.HAPPENING
            return {
                key: i + 1,
                meetingName: meeting.meetings_title,
                duration: formatTimeMeeting(
                    meeting.meetings_start_time.toString(),
                    meeting.meetings_end_time.toString(),
                ),
                takesPlaceAfter: differenceDate
                    ? t('MEETING_START_MESSAGE', {
                          days: differenceDate[0].toString(),
                          hours: differenceDate[1].toString(),
                          minutes: differenceDate[2].toString(),
                      })
                    : t(MeetingStatusName[statusMeeting]),
                status: meeting.meetings_status as MeetingStatus,
            }
        })
    }, [t, dataMeeting])

    const columns: ColumnsType<NotificationMeetingUser> = [
        {
            title: t('NO'),
            dataIndex: 'key',
            width: '5%',
            className: 'text-center',
        },
        {
            title: t('MEETING_NAME'),
            dataIndex: 'meetingName',
            render: (_, record) => {
                return (
                    <div className="flex w-full items-center gap-2 break-words">
                        {record.meetingName}
                    </div>
                )
            },
            width: '45%',
        },
        {
            title: t('MEETING_DURATION'),
            dataIndex: 'title',
            render: (_, record) => {
                return <div className="break-words">{record.duration}</div>
            },
            width: '25%',
        },
        {
            title: t('MEETING_TAKE_PLACE'),
            dataIndex: 'title',
            render: (_, record) => {
                return (
                    <div
                        className="break-words"
                        style={{ color: MeetingStatusColor[record.status] }}
                    >
                        {record.takesPlaceAfter}
                    </div>
                )
            },
            width: '25%',
        },
    ]

    return (
        <div className="flex min-h-[350px] flex-col gap-3 border p-2 shadow-lg">
            <span className="text-lg">
                {t('MEETING_SCHEDULE', {
                    date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
                })}
            </span>
            <div className="min-h-[300px]">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={dataColumn}
                    pagination={{
                        pageSize: 7,
                    }}
                    size="middle"
                    bordered
                    locale={locale}
                    loading={loadingFetchData}
                />
            </div>
        </div>
    )
}

const NotificationSuperAdmin = ({ date }: { date: Date }) => {
    const t = useTranslations()
    const [dataStatistic, setDataStatistic] =
        useState<IStatisticMeetingInMonthResponse>()
    const [loadingFetchData, setLoadingFetchData] = useState<boolean>(true)

    useEffect(() => {
        const fetchDataMeeting = async () => {
            setLoadingFetchData(true)
            const meetingStatisticInMonth =
                await serviceDashBoard.getStatisticMeetingInMonth({
                    date: date,
                })
            if (meetingStatisticInMonth) {
                setDataStatistic(meetingStatisticInMonth)
            }
            setLoadingFetchData(false)
        }
        fetchDataMeeting()
    }, [date])

    const configPie = useCallback(
        (data: { type: string; value: number }[]) => {
            const shareholderMeeting = data[0].value ?? 0
            const boardMeeting = data[1].value ?? 0
            const totalMeeting = shareholderMeeting + boardMeeting

            return {
                data: data,
                tooltip: false,
                angleField: 'value',
                colorField: 'type',
                marginRight: 180,
                innerRadius: 0.65,
                width: 450,
                height: 350,
                label: {
                    text: ({ value }: { value: any }) =>
                        value > 0 ? value : '',
                    style: {
                        fontWeight: '400',
                        fontSize: 19,
                    },
                    pointerEvents: 'none',
                },
                legend: {
                    color: {
                        title: false,
                        position: 'right-',
                        rowPadding: 10,
                        width: 250,
                        cols: 1,
                        maxRows: 1,
                        rowMargin: 10,
                    },
                    click: () => {
                        console.log('Click!!!!!')
                    },
                },
                annotations: [
                    {
                        type: 'text',
                        style: {
                            text: t('TOTAL') + ': ' + totalMeeting,
                            x: '50%',
                            y: '50%',
                            textAlign: 'center',
                            fontSize: 22,
                            fontStyle: 'bold',
                            pointerEvents: 'none', // Loại bỏ hover
                        },
                    },
                ],
            }
        },
        // eslint-disable-next-line
        [dataStatistic],
    )


    if (loadingFetchData) {
        return (
            <div className="flex h-[178px] items-center justify-center">
                <Spin tip="Loading..." />
            </div>
        )
    }

    return (
        <div className="flex min-h-[350px] flex-col gap-3 p-2">
            <span className="text-xl">
                {t('MEETING_INFORMATION_STATISTICS')} ({date.getMonth() + 1}/
                {date.getFullYear()})
            </span>
            <div className="flex gap-5">
                <div className="flex-1 border pb-10 shadow-xl">
                    <div className="mt-3 pl-5 text-lg">
                        {t('NUMBER_MEETINGS')}
                    </div>
                    <div className="mb-3 h-[24px] pl-5"></div>
                    <Pie
                        {...configPie([
                            {
                                type:
                                    t('SHAREHOLDER_MEETING') +
                                    ': ' +
                                    dataStatistic?.shareholderMeetingInMonth
                                        .totalMeeting,
                                value:
                                    dataStatistic?.shareholderMeetingInMonth
                                        .totalMeeting ?? 0,
                            },
                            {
                                type:
                                    t('BOARD_MEETING') +
                                    ': ' +
                                    dataStatistic?.boardMeetingInMonth
                                        .totalMeeting,
                                value:
                                    dataStatistic?.boardMeetingInMonth
                                        .totalMeeting ?? 0,
                            },
                        ])}
                    />
                </div>
                <div className="flex-1  border pb-10 shadow-xl">
                    <div className="mt-3 pl-5 text-lg">
                        {t('SHAREHOLDER_MEETING')}
                    </div>
                    <div className="mb-3 pl-5 text-base">
                        {t('TOTAL_PARTICIPANT_JOINED')}/
                        {t('TOTAL_PARTICIPANTS')}
                    </div>
                    <Pie
                        {...configPie([
                            {
                                type:
                                    t('TOTAL_PARTICIPANT_JOINED') +
                                    ': ' +
                                    dataStatistic?.shareholderMeetingInMonth
                                        .totalParticipantJoined,
                                value:
                                    dataStatistic?.shareholderMeetingInMonth
                                        .totalParticipantJoined ?? 0,
                            },
                            {
                                type:
                                    t('TOTAL_PARTICIPANTS') +
                                    ': ' +
                                    dataStatistic?.shareholderMeetingInMonth
                                        .totalParticipant,
                                value:
                                    dataStatistic?.shareholderMeetingInMonth
                                        .totalParticipant ?? 0,
                            },
                        ])}
                    />
                </div>
                <div className="flex-1 border pb-10 shadow-xl">
                    <div className="mt-3 pl-5 text-lg">
                        {t('BOARD_MEETING')}
                    </div>
                    <div className="mb-3 pl-5 text-base">
                        {t('TOTAL_PARTICIPANT_JOINED')}/
                        {t('TOTAL_PARTICIPANTS')}
                    </div>
                    <Pie
                        {...configPie([
                            {
                                type:
                                    t('TOTAL_PARTICIPANT_JOINED') +
                                    ': ' +
                                    dataStatistic?.boardMeetingInMonth
                                        .totalParticipantJoined,
                                value:
                                    dataStatistic?.boardMeetingInMonth
                                        .totalParticipantJoined ?? 0,
                            },
                            {
                                type:
                                    t('TOTAL_PARTICIPANTS') +
                                    ': ' +
                                    dataStatistic?.boardMeetingInMonth
                                        .totalParticipant,
                                value:
                                    dataStatistic?.boardMeetingInMonth
                                        .totalParticipant ?? 0,
                            },
                        ])}
                    />
                </div>
            </div>
        </div>
    )
}

interface INotificationPersonal {
    date: Date
    isSupperAdmin: boolean
}

const NotificationPersonal = ({
    date,
    isSupperAdmin,
}: INotificationPersonal) => {
    console.log('date: ', date)

    console.log('isSupperAdmin: ', isSupperAdmin)

    const bodyNotificationOfPersonal = useMemo(() => {
        if (isSupperAdmin) {
            return (
                <div>
                    <NotificationSuperAdmin date={date} />
                </div>
            )
        } else {
            return (
                <div>
                    <NotificationUser date={date} />
                </div>
            )
        }
    }, [isSupperAdmin, date])

    return <div className="w-[100%]">{bodyNotificationOfPersonal}</div>
}

export default NotificationPersonal
