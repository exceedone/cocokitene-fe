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
import Sliders from 'react-slick'

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
            className: 'text-center',
            responsive: ['lg'],
            width: 40,
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
            width: '30%',
        },
        {
            title: t('STATUS'),
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
                    date: `${date.getFullYear()}-${
                        date.getMonth() + 1
                    }-${date.getDate()}`,
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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        className: 'center',
        customPaging: function () {
            return <div className="dot mt-3"></div>
        },
        dotsClass: 'slick-dots slick-thumb',
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    }

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
            const totalMeeting = (data[0].value ?? 0) + (data[1].value ?? 0)

            return {
                data: data,
                tooltip: false,
                angleField: 'value',
                colorField: 'type',
                marginRight: 16,
                innerRadius: 0.55,
                radius: 0.85,
                width: 276,
                height: 350,
                label: {
                    text: ({ value }: { value: any }) =>
                        value > 0 ? value : '',
                    style: {
                        fontWeight: '400',
                        fontSize: 19,
                        margin: 10,
                    },
                    pointerEvents: 'none',
                },
                legend: {
                    color: {
                        itemMarker: 'circle',
                        title: false,
                        // position: 'right-',
                        position: 'bottom',
                        rowPadding: 10,
                        width: 350,
                        cols: 1,
                        maxRows: 1,
                        rowMargin: 10,
                        itemLabelFontSize: 15,
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
                interaction: {
                    legendFilter: false,
                },
                autoFit: true, // Để biểu đồ tự động fit kích thước container
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
        <div className="mb-7 flex min-h-[350px] w-full flex-col gap-3 border p-2 pb-7">
            <span className="text-xl">
                {t('MEETING_INFORMATION_STATISTICS')} ({date.getFullYear()}-
                {date.getMonth() + 1})
            </span>
            <div className="mx-auto w-[90%]">
                <div className="mx-auto max-w-[1200px] px-0">
                    <Sliders
                        {...settings}
                        className="slider_dash_board mx-auto pb-3"
                    >
                        <div className=" mx-auto flex h-[470px] max-w-[320px] flex-col justify-between border">
                            <div>
                                <div className="mt-3 pl-5 text-lg">
                                    {t('NUMBER_MEETINGS')}
                                </div>
                                <div className="mb-3 h-[24px] pl-5"></div>
                            </div>
                            <div className="flex justify-center pb-5">
                                <div>
                                    <Pie
                                        {...configPie([
                                            {
                                                type:
                                                    t('SHAREHOLDER_MEETING') +
                                                    ': ' +
                                                    dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalMeeting,
                                                value:
                                                    dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalMeeting ?? 0,
                                            },
                                            {
                                                type:
                                                    t('BOARD_MEETING') +
                                                    ': ' +
                                                    dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalMeeting,
                                                value:
                                                    dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalMeeting ?? 0,
                                            },
                                        ])}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto flex h-[470px] max-w-[320px] flex-col justify-between border pb-5">
                            <div>
                                <div className="mt-3 pl-5 text-lg">
                                    {t('SHAREHOLDER_MEETING')}
                                </div>
                                <div className="mb-3 pl-5 text-base">
                                    {t('TOTAL_PARTICIPANT_JOINED')}/
                                    {t('ABSENT_PARTICIPANTS')}
                                </div>
                            </div>
                            <div className="flex justify-center pb-5">
                                <div>
                                    <Pie
                                        {...configPie([
                                            {
                                                type:
                                                    t(
                                                        'TOTAL_PARTICIPANT_JOINED',
                                                    ) +
                                                    ': ' +
                                                    dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalParticipantJoined,
                                                value:
                                                    dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalParticipantJoined ??
                                                    0,
                                            },
                                            {
                                                type:
                                                    t('ABSENT_PARTICIPANTS') +
                                                    ': ' +
                                                    ((dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalParticipant ??
                                                        0) -
                                                        (dataStatistic
                                                            ?.shareholderMeetingInMonth
                                                            .totalParticipantJoined ??
                                                            0)),
                                                value:
                                                    (dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalParticipant ??
                                                        0) -
                                                    (dataStatistic
                                                        ?.shareholderMeetingInMonth
                                                        .totalParticipantJoined ??
                                                        0),
                                            },
                                        ])}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto flex h-[470px] max-w-[320px] flex-col justify-between border pb-5">
                            <div>
                                <div className="mt-3 pl-5 text-lg">
                                    {t('BOARD_MEETING')}
                                </div>
                                <div className="mb-3 pl-5 text-base">
                                    {t('TOTAL_PARTICIPANT_JOINED')}/
                                    {t('ABSENT_PARTICIPANTS')}
                                </div>
                            </div>
                            <div className="flex justify-center pb-5">
                                <div>
                                    <Pie
                                        {...configPie([
                                            {
                                                type:
                                                    t(
                                                        'TOTAL_PARTICIPANT_JOINED',
                                                    ) +
                                                    ': ' +
                                                    dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalParticipantJoined,
                                                value:
                                                    dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalParticipantJoined ??
                                                    0,
                                            },
                                            {
                                                type:
                                                    t('ABSENT_PARTICIPANTS') +
                                                    ': ' +
                                                    ((dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalParticipant ??
                                                        0) -
                                                        (dataStatistic
                                                            ?.boardMeetingInMonth
                                                            .totalParticipantJoined ??
                                                            0)),
                                                value:
                                                    (dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalParticipant ??
                                                        0) -
                                                    (dataStatistic
                                                        ?.boardMeetingInMonth
                                                        .totalParticipantJoined ??
                                                        0),
                                            },
                                        ])}
                                    />
                                </div>
                            </div>
                        </div>
                    </Sliders>
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

    return (
        <div className="w-[100%] shadow-lg">{bodyNotificationOfPersonal}</div>
    )
}

export default NotificationPersonal
