import { useBoardMeetingDetail, useReports } from '@/stores/board-meeting/hook'
import { ResolutionType } from '@/constants/resolution'
import { useTranslations } from 'next-intl'
import { useAuthLogin } from '@/stores/auth/hooks'
import { IBoardMeetingDetail, IReports } from '@/stores/board-meeting/types'
import { RoleMtgEnum } from '@/constants/role-mtg'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { useEffect, useMemo, useState } from 'react'
import { titleTooltipShow } from '@/constants/board-meeting'
import BoxArea from '@/components/box-area'
import { Empty } from 'antd'
import DetailReportItem from '@/components/detail-report-item'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

const Elections = () => {
    const elections = useReports(ResolutionType.ELECTION)
    const [{ boardMeeting }] = useBoardMeetingDetail()
    const t = useTranslations()
    const { authState } = useAuthLogin()
    const params = useParams()
    const boardMeetingId = Number(params.id)

    const [electionData, setElectionData] = useState<IReports[]>(elections)
    const [socketVotingReport, setSocketVotingReport] = useState<any>(undefined)

    useEffect(() => {
        const socketIO = io(String(process.env.NEXT_PUBLIC_API_SOCKET))

        socketIO.on(
            `voting-report-board-meeting/${boardMeetingId}`,
            (response) => {
                if (response.type === ResolutionType.ELECTION) {
                    if (response.voterId !== authState.userData?.id) {
                        setElectionData((prev) => {
                            const electionInformation = prev.map((election) => {
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
                                if (election.id == response.id) {
                                    return {
                                        ...election,
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
                                                : (notVoteYetQuantity * 100) /
                                                  totalShareholders,
                                    }
                                }
                                return election
                            })

                            return electionInformation
                        })
                    }
                }
            },
        )

        setSocketVotingReport(socketIO)

        return () => {
            if (socketVotingReport) {
                socketVotingReport.disconnect()
                console.log('Disconnect socketVotingReport!!!')
            }
        }
        // eslint-disable-next-line
    }, [boardMeetingId])

    const checkParticipantIsBoardAndStatusParticipant = (
        boardMeeting: IBoardMeetingDetail,
        checkJoined: boolean = true,
    ): boolean => {
        return boardMeeting.participants.some((item) => {
            if (item.roleMtgName !== RoleMtgEnum.HOST) {
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

    const isBoard = useMemo(() => {
        if (boardMeeting) {
            return checkParticipantIsBoardAndStatusParticipant(
                boardMeeting,
                false,
            )
        }
        return false
        // eslint-disable-next-line
    }, [boardMeeting, authState])

    const notifiEnableVote = useMemo(() => {
        let message: string = ''
        if (boardMeeting) {
            const time = new Date().getTime()
            const startTime = new Date(boardMeeting.startTime).getTime()
            const endVotingTime = new Date(boardMeeting.endVotingTime).getTime()
            if (time < startTime || time > endVotingTime) {
                message += titleTooltipShow.votingTime
            }
            const isParticipantBoardJoined =
                checkParticipantIsBoardAndStatusParticipant(boardMeeting)
            if (isParticipantBoardJoined == false) {
                message += message
                    ? `_,_${titleTooltipShow.participant}`
                    : titleTooltipShow.participant
            }
        }
        return message
        // eslint-disable-next-line
    }, [boardMeeting, authState])

    const body = useMemo(() => {
        if (electionData.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }
        return electionData.map((election, index) => (
            <DetailReportItem
                id={election.id}
                key={index}
                index={index + 1}
                title={election.title}
                content={election.description}
                oldContent={election.oldDescription}
                creator={election.creator}
                proposalFiles={election.proposalFiles}
                percentNotVoteYet={election.percentNotVoteYet}
                percentUnVoted={election.percentUnVoted}
                percentVoted={election.percentVoted}
                voteErrorMessage={notifiEnableVote}
                voteResult={election.voteResult}
                isBoard={isBoard}
            />
        ))
    }, [electionData, notifiEnableVote, isBoard])
    return (
        <BoxArea title={t('ELECTIONS')}>
            <div className="mb-6 flex flex-col gap-6">{body}</div>
        </BoxArea>
    )
}

export default Elections
