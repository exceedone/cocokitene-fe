import BoxArea from '@/components/box-area'
import DetailResolutionItem from '@/components/detail-resolution-item'
import { ResolutionType } from '@/constants/resolution'
import { Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { useMeetingDetail, useResolutions } from '@/stores/meeting/hooks'
import { useAuthLogin } from '@/stores/auth/hooks'
import { titleTooltip } from '@/constants/meeting'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { RoleMtgEnum } from '@/constants/role-mtg'
import { IMeetingDetail, IResolution } from '@/stores/meeting/types'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

const Resolutions = () => {
    const resolutions = useResolutions(ResolutionType.RESOLUTION)
    const t = useTranslations()
    const params = useParams()
    const meetingId = Number(params.id)
    const [{ meeting }] = useMeetingDetail()
    const { authState } = useAuthLogin()

    const [resolutionsData, setResolutionsData] =
        useState<IResolution[]>(resolutions)

    const [socketResolution, setSocketResolution] = useState<any>(undefined)

    useEffect(() => {
        const socketIO = io(String(process.env.NEXT_PUBLIC_API_SOCKET))

        socketIO.on(
            `voting-resolution-shareholder-meeting/${meetingId}`,
            (response) => {
                // console.log('response--------: ', response)
                if (response.type == ResolutionType.RESOLUTION) {
                    if (response.voterId !== authState.userData?.id) {
                        setResolutionsData((prev) => {
                            const amendmentResolutionInfo = prev.map(
                                (resolution) => {
                                    const votedQuantity = Number(
                                        response.votedQuantity,
                                    )
                                    const unVotedQuantity = Number(
                                        response.unVotedQuantity,
                                    )
                                    const notVoteYetQuantity = Number(
                                        response.notVoteYetQuantity,
                                    )
                                    const totalShareholders =
                                        notVoteYetQuantity +
                                        votedQuantity +
                                        unVotedQuantity

                                    if (resolution.id == response.id) {
                                        return {
                                            ...resolution,
                                            percentVoted:
                                                totalShareholders === 0
                                                    ? 0
                                                    : (votedQuantity * 100) /
                                                      totalShareholders,
                                            percentUnVoted:
                                                totalShareholders === 0
                                                    ? 0
                                                    : (unVotedQuantity * 100) /
                                                      totalShareholders,
                                            percentNotVoteYet:
                                                totalShareholders === 0
                                                    ? 0
                                                    : (notVoteYetQuantity *
                                                          100) /
                                                      totalShareholders,
                                        }
                                    }
                                    return resolution
                                },
                            )
                            return amendmentResolutionInfo
                        })
                    }
                }
            },
        )

        setSocketResolution(socketIO)

        return () => {
            if (socketResolution) {
                socketResolution.disconnect()
                console.log('Disconnect socketVoting Resolutions!!!')
            }
        }
        // eslint-disable-next-line
    }, [meetingId])

    const checkShareholderAuthAndStatusParticipant = (
        meeting: IMeetingDetail,
        checkJoined: boolean = true,
    ): boolean => {
        return meeting.participants.some((item) => {
            if (item.roleMtgName === RoleMtgEnum.SHAREHOLDER) {
                return item.userParticipants.some((option) => {
                    if (checkJoined) {
                        return (
                            option.userId === authState.userData?.id &&
                            option.status === UserMeetingStatusEnum.PARTICIPATE
                        )
                    }
                    return option.userId === authState.userData?.id
                })
            }
            return false
        })
    }

    const isShareholder = useMemo(() => {
        if (meeting) {
            return checkShareholderAuthAndStatusParticipant(meeting, false)
        }
        return false
        // eslint-disable-next-line
    }, [meeting, authState])

    const notifiEnableVote = useMemo(() => {
        let message: string = ''
        if (meeting) {
            const time = new Date().getTime()
            const startTime = new Date(meeting.startTime).getTime()
            const endVotingTime = new Date(meeting.endVotingTime).getTime()
            if (time < startTime || time > endVotingTime) {
                message += titleTooltip.votingTime
            }
            const isShareholderJoined =
                checkShareholderAuthAndStatusParticipant(meeting)
            if (isShareholderJoined === false) {
                message += message
                    ? `_,_${titleTooltip.shareHolder}`
                    : titleTooltip.shareHolder
            }
        }
        return message
        // eslint-disable-next-line
    }, [meeting, authState])

    const body = useMemo(() => {
        if (resolutionsData.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }

        return resolutionsData.map((resolution, index) => (
            <DetailResolutionItem
                id={resolution.id}
                key={index}
                index={index + 1}
                title={resolution.title}
                content={resolution.content}
                percentVoted={resolution.percentVoted}
                voteResult={resolution.voteResult}
                creator={resolution.creator}
                percentUnVoted={resolution.percentUnVoted}
                percentNotVoteYet={resolution.percentNotVoteYet}
                proposalFiles={resolution.proposalFiles}
                voteErrorMessage={notifiEnableVote}
                isVoter={isShareholder}
            />
        ))
    }, [resolutionsData, notifiEnableVote, isShareholder])

    return (
        <BoxArea title={t('RESOLUTIONS')}>
            <div className="mb-6 flex flex-col gap-6">{body}</div>
        </BoxArea>
    )
}

export default Resolutions
