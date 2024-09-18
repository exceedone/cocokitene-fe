/* eslint-disable */

import BoxArea from '@/components/box-area'
import { useTranslations } from 'next-intl'
import { useBoardMeetingDetail } from '@/stores/board-meeting/hook'
import { useAuthLogin } from '@/stores/auth/hooks'
import { IBoardMeetingDetail } from '@/stores/board-meeting/types'
import { RoleMtgEnum } from '@/constants/role-mtg'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { useEffect, useMemo, useState } from 'react'
import { titleTooltipShow } from '@/constants/board-meeting'
import { Empty } from 'antd'
import { ElectionEnum } from '@/constants/election'
import { MeetingType } from '@/constants/meeting'
import DetailPersonnelVotingItem from '@/components/detail-personnel-voting'
import { IPersonnelVoting } from '@/services/response.type'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

const PersonnelVoting = () => {
    const t = useTranslations()
    const params = useParams()
    const boardMeetingId = Number(params.id)
    const [{ boardMeeting }] = useBoardMeetingDetail()
    const [boardMeetingData, setBoardMeetingData] =
        useState<IPersonnelVoting[]>()

    const { authState } = useAuthLogin()
    const [socketVoting, setSocketVoting] = useState<any>(undefined)

    useEffect(() => {
        setBoardMeetingData(boardMeeting?.candidates)
    }, [boardMeeting?.candidates])

    useEffect(() => {
        const socketIO = io(String(process.env.NEXT_PUBLIC_API_SOCKET))

        socketIO.on(
            `voting-candidate-board-meeting/${boardMeetingId}`,
            (responseCandidateInfo) => {
                if (responseCandidateInfo.voterId !== authState.userData?.id) {
                    setBoardMeetingData((prev) => {
                        const personnelVotingData = prev?.map((personnel) => {
                            if (
                                personnel.id ==
                                responseCandidateInfo.personnelVoting.id
                            ) {
                                return {
                                    ...personnel,
                                    candidate: personnel.candidate.map(
                                        (candidate) => {
                                            if (
                                                candidate.id ==
                                                responseCandidateInfo.id
                                            ) {
                                                return {
                                                    ...candidate,
                                                    votedQuantity:
                                                        responseCandidateInfo.votedQuantity,
                                                    unVotedQuantity:
                                                        responseCandidateInfo.unVotedQuantity,
                                                    notVoteYetQuantity:
                                                        responseCandidateInfo.notVoteYetQuantity,
                                                }
                                            }
                                            return candidate
                                        },
                                    ),
                                }
                            }
                            return personnel
                        })
                        return personnelVotingData
                    })
                }
            },
        )

        setSocketVoting(socketIO)

        return () => {
            if (socketVoting) {
                socketVoting.disconnect()
                console.log('Disconnect socketVoting!!!')
            }
        }
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
    }, [[boardMeeting, authState]])

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

    const appointMents = useMemo(() => {
        return boardMeetingData
            ?.filter(
                (item) =>
                    item.typeElection.status ===
                    ElectionEnum.VOTE_OF_CONFIDENCE,
            )
            .sort((a, b) => a.id - b.id)
    }, [boardMeetingData])

    const dismissals = useMemo(() => {
        return boardMeetingData
            ?.filter(
                (item) =>
                    item.typeElection.status ===
                    ElectionEnum.VOTE_OF_NOT_CONFIDENCE,
            )
            .sort((a, b) => a.id - b.id)
    }, [boardMeetingData])

    const bodyDismissals = useMemo(() => {
        if (dismissals?.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }
        // return dismissals?.map((candidate, index) => {
        return dismissals?.map((personnelVoting, index) => {
            return (
                <DetailPersonnelVotingItem
                    key={personnelVoting.id}
                    index={index}
                    title={personnelVoting.title}
                    candidate={personnelVoting.candidate}
                    voteErrorMessage={notifiEnableVote}
                    meetingType={
                        boardMeeting?.type ?? MeetingType.BOARD_MEETING
                    }
                    isVoter={isBoard}
                />
            )
        })
    }, [notifiEnableVote, appointMents])

    const bodyAppontMents = useMemo(() => {
        if (appointMents?.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }
        return appointMents?.map((personnelVoting, index) => {
            return (
                <DetailPersonnelVotingItem
                    key={personnelVoting.id}
                    index={index}
                    title={personnelVoting.title}
                    candidate={personnelVoting.candidate}
                    voteErrorMessage={notifiEnableVote}
                    meetingType={
                        boardMeeting?.type ?? MeetingType.BOARD_MEETING
                    }
                    isVoter={isBoard}
                />
            )
        })
    }, [notifiEnableVote, appointMents])

    return (
        <BoxArea title={t('EXECUTIVE_OFFICER_ELECTION')}>
            <BoxArea title={t('APPOINTMENT')}>
                <div className="mb-6 flex flex-col gap-6 max-md:mr-[-24px]">
                    {bodyAppontMents}
                </div>
            </BoxArea>

            <BoxArea title={t('DISMISSAL')}>
                <div className="mb-6 flex flex-col gap-6 max-md:mr-[-24px]">
                    {bodyDismissals}
                </div>
            </BoxArea>
        </BoxArea>
    )
}

export default PersonnelVoting
