/* eslint-disable */

import BoxArea from '@/components/box-area'
import DetailPersonnelVotingItem from '@/components/detail-personnel-voting'
import { ElectionEnum } from '@/constants/election'
import { MeetingType, titleTooltip } from '@/constants/meeting'
import { RoleMtgEnum } from '@/constants/role-mtg'
import { IPersonnelVoting } from '@/services/response.type'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { useAuthLogin } from '@/stores/auth/hooks'
import { useMeetingDetail } from '@/stores/meeting/hooks'
import { IMeetingDetail } from '@/stores/meeting/types'
import { Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

const PersonnelVoting = () => {
    const t = useTranslations()
    const params = useParams()
    const shareholderMeetingId = Number(params.id)

    const [{ meeting }] = useMeetingDetail()
    const { authState } = useAuthLogin()

    const [quantityShare, setQuantityShare] = useState<number>(0)

    const [
        personnelVotingShareholderMeetingData,
        setPersonnelVotingShareholderMeetingData,
    ] = useState<IPersonnelVoting[]>()
    const [socketVoting, setSocketVoting] = useState<any>(undefined)

    useEffect(() => {
        setPersonnelVotingShareholderMeetingData(meeting?.personnelVoting)
    }, [meeting?.personnelVoting])

    useEffect(() => {
        const socketIO = io(String(process.env.NEXT_PUBLIC_API_SOCKET))

        socketIO.on(
            `voting-candidate-shareholder-meeting/${shareholderMeetingId}`,
            (response) => {
                if (response.voterId !== authState.userData?.id) {
                    setPersonnelVotingShareholderMeetingData((prev) => {
                        const personnelVotingData = prev?.map((personnel) => {
                            if (personnel.id == response.personnelVoting.id) {
                                return {
                                    ...personnel,
                                    candidate: personnel.candidate.map(
                                        (candidate) => {
                                            if (candidate.id == response.id) {
                                                return {
                                                    ...candidate,
                                                    votedQuantity:
                                                        response.votedQuantity,
                                                    unVotedQuantity:
                                                        response.unVotedQuantity,
                                                    notVoteYetQuantity:
                                                        response.notVoteYetQuantity,
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
    }, [shareholderMeetingId])

    useEffect(() => {
        // calculate quantityShare in Meeting of User
        const listShareholderParticipant = meeting?.participants
            .filter(
                (participant) =>
                    participant.roleMtgName.toUpperCase() ==
                    RoleMtgEnum.SHAREHOLDER.toUpperCase(),
            )
            .flatMap((shareholder) => shareholder.userParticipants)
        if (
            listShareholderParticipant &&
            listShareholderParticipant.length > 0
        ) {
            const quantityShareOfUser = listShareholderParticipant.find(
                (shareholder) => shareholder.userId == authState.userData?.id,
            )
            setQuantityShare(quantityShareOfUser?.userShareQuantity ?? 0)
        } else {
            setQuantityShare(0)
        }
    }, [meeting?.participants, authState])

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

    const appointPersonnelVote = useMemo(() => {
        return personnelVotingShareholderMeetingData
            ?.filter((personnelVote) => {
                return (
                    personnelVote.typeElection.status ===
                    ElectionEnum.VOTE_OF_CONFIDENCE
                )
            })
            .sort((a, b) => a.id - b.id)
    }, [personnelVotingShareholderMeetingData])

    const dismissPersonnelVote = useMemo(() => {
        return personnelVotingShareholderMeetingData
            ?.filter((personnelVote) => {
                return (
                    personnelVote.typeElection.status ===
                    ElectionEnum.VOTE_OF_NOT_CONFIDENCE
                )
            })
            .sort((a, b) => a.id - b.id)
    }, [personnelVotingShareholderMeetingData])

    const bodyAppointPersonnelVoting = useMemo(() => {
        if (appointPersonnelVote?.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }
        return appointPersonnelVote?.map((personnelVote, index) => {
            return (
                <DetailPersonnelVotingItem
                    key={personnelVote.id}
                    index={index}
                    title={personnelVote.title}
                    candidate={personnelVote.candidate}
                    voteErrorMessage={notifiEnableVote}
                    meetingType={
                        meeting?.type ?? MeetingType.SHAREHOLDER_MEETING
                    }
                    isVoter={isShareholder}
                />
            )
        })
    }, [appointPersonnelVote, quantityShare, notifiEnableVote, meeting])

    const bodyDismissPersonnelVoting = useMemo(() => {
        if (dismissPersonnelVote?.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        marginBlock: 0,
                    }}
                />
            )
        }
        return dismissPersonnelVote?.map((personnelVote, index) => {
            return (
                <DetailPersonnelVotingItem
                    key={personnelVote.id}
                    index={index}
                    title={personnelVote.title}
                    candidate={personnelVote.candidate}
                    voteErrorMessage={notifiEnableVote}
                    meetingType={
                        meeting?.type ?? MeetingType.SHAREHOLDER_MEETING
                    }
                    isVoter={isShareholder}
                />
            )
        })
    }, [dismissPersonnelVote, quantityShare, notifiEnableVote])

    return (
        <BoxArea title={t('EXECUTIVE_OFFICER_ELECTION')}>
            <BoxArea title={t('APPOINTMENT')}>
                <div className="mb-6 flex flex-col gap-6 max-md:mr-[-24px]">
                    {bodyAppointPersonnelVoting}
                </div>
            </BoxArea>

            <BoxArea title={t('DISMISSAL')}>
                <div className="mb-6 flex flex-col gap-6 max-md:mr-[-24px]">
                    {bodyDismissPersonnelVoting}
                </div>
            </BoxArea>
        </BoxArea>
    )
}
export default PersonnelVoting
