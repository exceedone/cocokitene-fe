/* eslint-disable */

import BoxArea from '@/components/box-area'
import DetailCandidateItem from '@/components/detail-candidate-item'
import DetailPersonnelVotingItem from '@/components/detail-personnel-voting'
import { ElectionEnum } from '@/constants/election'
import { MeetingType, titleTooltip } from '@/constants/meeting'
import { RoleMtgEnum } from '@/constants/role-mtg'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { useAuthLogin } from '@/stores/auth/hooks'
import { useMeetingDetail } from '@/stores/meeting/hooks'
import { IMeetingDetail } from '@/stores/meeting/types'
import { Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

const PersonnelVoting = () => {
    const t = useTranslations()

    const [{ meeting }] = useMeetingDetail()
    const { authState } = useAuthLogin()

    const [quantityShare, setQuantityShare] = useState<number>(0)

    console.log('meeting data: ', meeting)

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
    ): boolean => {
        return meeting.participants.some((item) => {
            if (item.roleMtgName === RoleMtgEnum.SHAREHOLDER) {
                return item.userParticipants.some(
                    (option) =>
                        option.userId === authState.userData?.id &&
                        option.status === UserMeetingStatusEnum.PARTICIPATE,
                )
            }
            return false
        })
    }

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
        return meeting?.personnelVoting
            .filter((personnelVote) => {
                return (
                    personnelVote.typeElection.status ===
                    ElectionEnum.VOTE_OF_CONFIDENCE
                )
            })
            .sort((a, b) => a.id - b.id)
    }, [meeting?.personnelVoting])

    const dismissPersonnelVote = useMemo(() => {
        return meeting?.personnelVoting
            .filter((personnelVote) => {
                return (
                    personnelVote.typeElection.status ===
                    ElectionEnum.VOTE_OF_NOT_CONFIDENCE
                )
            })
            .sort((a, b) => a.id - b.id)
    }, [meeting?.personnelVoting])

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
            return personnelVote.candidate.map((candidate, i) => {
                const notVoteYetQuantity = Number(candidate.notVoteYetQuantity)
                const votedQuantity = Number(candidate.votedQuantity)
                const unVotedQuantity = Number(candidate.unVotedQuantity)
                const totalParticipantSeparate =
                    notVoteYetQuantity + votedQuantity + unVotedQuantity
                const percentVoted =
                    totalParticipantSeparate === 0
                        ? 0
                        : (votedQuantity * 100) / totalParticipantSeparate
                const percentUnVoted =
                    totalParticipantSeparate === 0
                        ? 0
                        : (unVotedQuantity * 100) / totalParticipantSeparate
                const percentNotVoteYet =
                    totalParticipantSeparate === 0
                        ? 0
                        : (notVoteYetQuantity * 100) / totalParticipantSeparate

                return (
                    <DetailCandidateItem
                        index={index + 1}
                        key={candidate.id}
                        content={candidate.candidateName}
                        percentVoted={percentVoted}
                        percentUnVoted={percentUnVoted}
                        percentNotVoteYet={percentNotVoteYet}
                        voteResult={candidate.voteResult}
                        id={candidate.id}
                        title={personnelVote.title}
                        voteErrorMessage={notifiEnableVote}
                        meetingType={meeting?.type ?? MeetingType.SHAREHOLDER_MEETING}
                    />
                )
            })
        })
    }, [dismissPersonnelVote, quantityShare, notifiEnableVote])

    return (
        <BoxArea title={t('EXECUTIVE_OFFICER_ELECTION')}>
            <BoxArea title={t('APPOINTMENT')}>
                <div className="mb-6 flex flex-col gap-6">
                    {bodyAppointPersonnelVoting}
                </div>
            </BoxArea>

            <BoxArea title={t('DISMISSAL')}>
                <div className="mb-6 flex flex-col gap-6">
                    {bodyDismissPersonnelVoting}
                </div>
            </BoxArea>
        </BoxArea>
    )
}
export default PersonnelVoting
