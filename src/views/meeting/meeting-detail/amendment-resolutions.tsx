import BoxArea from '@/components/box-area'
import DetailResolutionItem from '@/components/detail-resolution-item'
import { titleTooltip } from '@/constants/meeting'
import { ResolutionType } from '@/constants/resolution'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { useAuthLogin } from '@/stores/auth/hooks'
import { useResolutions, useMeetingDetail } from '@/stores/meeting/hooks'
import { Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { IMeetingDetail, IResolution } from '@/stores/meeting/types'
import { RoleMtgEnum } from '@/constants/role-mtg'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

const AmendmentResolutions = () => {
    const amendmentResolutions = useResolutions(
        ResolutionType.AMENDMENT_RESOLUTION,
    )
    const t = useTranslations()
    const [{ meeting }] = useMeetingDetail()
    const { authState } = useAuthLogin()
    const params = useParams()
    const meetingId = Number(params.id)

    const [amendmentResolutionData, setAmendmentResolutionData] =
        useState<IResolution[]>(amendmentResolutions)

    const [socketAmendmentResolution, setSocketAmendmentResolution] =
        useState<any>(undefined)

    useEffect(() => {
        const socketIO = io(String(process.env.NEXT_PUBLIC_API_SOCKET))

        socketIO.on(
            `voting-resolution-shareholder-meeting/${meetingId}`,
            (response) => {
                console.log('response--------: ', response)
                if (response.type == ResolutionType.AMENDMENT_RESOLUTION) {
                    if (response.voterId !== authState.userData?.id) {
                        setAmendmentResolutionData((prev) => {
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

        setSocketAmendmentResolution(socketIO)

        return () => {
            if (socketAmendmentResolution) {
                socketAmendmentResolution.disconnect()
                console.log('Disconnect socketVoting AmendmentResolutions!!!')
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
        if (amendmentResolutionData.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }

        return amendmentResolutionData.map((amendmentResolution, index) => (
            <DetailResolutionItem
                id={amendmentResolution.id}
                key={index}
                index={index + 1}
                title={amendmentResolution.title}
                content={amendmentResolution.content}
                oldContent={amendmentResolution.oldContent}
                percentVoted={amendmentResolution.percentVoted}
                voteResult={amendmentResolution.voteResult}
                creator={amendmentResolution.creator}
                percentUnVoted={amendmentResolution.percentUnVoted}
                percentNotVoteYet={amendmentResolution.percentNotVoteYet}
                proposalFiles={amendmentResolution.proposalFiles}
                voteErrorMessage={notifiEnableVote}
                isVoter={isShareholder}
            />
        ))
    }, [amendmentResolutionData, notifiEnableVote, isShareholder])

    return (
        <BoxArea title={t('AMENDMENT_RESOLUTIONS')}>
            <div className="mb-6 flex flex-col gap-6">{body}</div>
        </BoxArea>
    )
}

export default AmendmentResolutions
