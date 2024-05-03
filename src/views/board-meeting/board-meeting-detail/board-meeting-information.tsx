import { useBoardMeetingDetail } from '@/stores/board-meeting/hook'
import { useTranslations } from 'next-intl'
import Loader from '@/components/loader'
import { Col, Row, Typography } from 'antd'
import { ReactNode } from 'react'
import { LikeIcon } from '@/components/svgs'
import BoxArea from '@/components/box-area'
import moment from 'moment'
import { MeetingStatusColor, MeetingStatusName } from '@/constants/meeting'

const { Text, Title } = Typography

interface IBoxGeneralInformation {
    icon: ReactNode
    title: string
    realNumber: number
    totalNumber: number
}

export const BoxGeneralInformation = ({
    icon,
    title,
    realNumber,
    totalNumber,
}: IBoxGeneralInformation) => {
    return (
        <div className="h-full bg-white p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-end justify-center gap-2">
                    {icon}
                    <Text className="leading-none">{title}</Text>
                </div>
                <div>
                    <div className="flex items-baseline gap-2">
                        <Title
                            level={2}
                            className="mb-0 font-medium leading-none"
                        >
                            {realNumber}
                        </Title>
                        <Title
                            level={4}
                            className="mb-0 mt-0 font-medium leading-none"
                        >
                            /
                        </Title>
                        <Title
                            level={4}
                            className="mb-0 mt-0 font-medium leading-none"
                        >
                            {totalNumber}
                        </Title>
                    </div>
                </div>
            </div>
            <div className="mt-2 text-right">
                <Text className="font-bold text-polar-green">
                    {totalNumber === 0
                        ? 0
                        : Math.round((realNumber / totalNumber) * 10000) / 100}
                    %
                </Text>
            </div>
        </div>
    )
}

const BoardMeetingInformation = () => {
    const [{ boardMeeting }] = useBoardMeetingDetail()
    const t = useTranslations()

    if (!boardMeeting) return <Loader />
    return (
        <>
            <Row gutter={[16, 24]}>
                <Col xs={24} lg={12}>
                    <BoxGeneralInformation
                        icon={<LikeIcon fill1="#EFEFFF" fill2="#5151E5" />}
                        title={t('TOTAL_PARTICIPANT_JOINED')}
                        realNumber={boardMeeting.boardsJoined}
                        totalNumber={boardMeeting.boardsTotal}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <BoxArea title={t('BOARD_MEETING_INFORMATION')}>
                        <div className="flex gap-3">
                            <div className="flex gap-1">
                                <Text className="text-black-45">
                                    {t('START_TIME')}
                                </Text>
                                <div className="flex gap-1">
                                    {moment(boardMeeting.startTime).format(
                                        'YYYY/MM/DD HH:mm:ss',
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Text className="text-black-45">
                                    {t('END_TIME')}
                                </Text>
                                <div className="flex gap-1">
                                    {moment(boardMeeting.endTime).format(
                                        'YYYY/MM/DD HH:mm:ss',
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Text className="text-black-45">
                                    {t('END_VOTING_TIME')}
                                </Text>
                                <div className="flex gap-1">
                                    {moment(boardMeeting.endVotingTime).format(
                                        'YYYY/MM/DD HH:mm:ss',
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <Text className="text-black-45">
                                    {t('STATUS')}:
                                </Text>
                                <div className="flex flex-col gap-1">
                                    <span
                                        style={{
                                            color: MeetingStatusColor[
                                                boardMeeting.status
                                            ],
                                        }}
                                    >
                                        {t(
                                            MeetingStatusName[
                                                boardMeeting.status
                                            ],
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </BoxArea>
                </Col>
            </Row>
        </>
    )
}
export default BoardMeetingInformation
