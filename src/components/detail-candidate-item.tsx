import {
    Modal,
    notification,
    Radio,
    RadioChangeEvent,
    Tooltip,
    Typography,
} from 'antd'
import { Resolution, VoteProposalOption } from '@/constants/resolution'
import { useState } from 'react'
import { FETCH_STATUS } from '@/constants/common'
import { useTranslations } from 'next-intl'
import { formatNumber } from '@/utils/format-number'
import serviceCandidate from '@/services/candidate'
import { MeetingType } from '@/constants/meeting'

const { Text } = Typography
interface IDetailCandidateItem extends Resolution {
    index: number
    percentVoted?: number
    percentUnVoted?: number
    percentNotVoteYet?: number
    voteResult?: VoteProposalOption
    id: number
    voteErrorMessage?: string
    meetingType: MeetingType
}

const DetailCandidateItem = ({
    index,
    title,
    content,
    percentVoted,
    percentUnVoted,
    percentNotVoteYet,
    voteResult,
    id,
    voteErrorMessage = '',
    meetingType,
}: IDetailCandidateItem) => {
    const [value, setValue] = useState(voteResult)
    const [votePercent, setVotePercent] = useState({
        percentUnVoted,
        percentVoted,
        percentNotVoteYet,
    })
    const [voteStatus, setVoteStatus] = useState(FETCH_STATUS.IDLE)
    const t = useTranslations()

    const onVoteConfirm = (e: RadioChangeEvent) => {
        const config = {
            title,
            content: t('DO_YOU_WANT_TO_CHANGE_YOUR_VOTE_RESULT?'),
            okText: t('OK'),
            cancelText: t('CANCEL'),
            onOk() {
                onChange(e)
            },
        }
        Modal.confirm(config)
    }
    const onChange = async (e: RadioChangeEvent) => {
        try {
            setVoteStatus(FETCH_STATUS.LOADING)
            let candidate

            if (meetingType === MeetingType.SHAREHOLDER_MEETING) {
                candidate = await serviceCandidate.voteCandidateShareholderMtg(
                    id,
                    e.target.value,
                )
            } else {
                candidate = await serviceCandidate.voteCandidateBoardMtg(
                    id,
                    e.target.value,
                )
            }

            setValue(e.target.value)
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
            setVotePercent({
                percentVoted,
                percentNotVoteYet,
                percentUnVoted,
            })
            setVoteStatus(FETCH_STATUS.SUCCESS)
            notification.success({
                message: t('VOTED_CANDIDATE'),
                description: t('CHANGE_VOTE_RESULT_CANDIDATE_SUCCESSFULLY'),
                duration: 2,
            })
        } catch (error) {
            setVoteStatus(FETCH_STATUS.ERROR)
        }
    }

    return (
        <div className="flex items-center justify-between gap-4 border-b border-b-neutral/4 py-3 ">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-neutral/5 bg-neutral/2">
                <Text className="text-bold">{index}</Text>
            </div>
            <div className="flex flex-grow  items-center justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <Text
                        title={title}
                        className="text-bold text-black decoration-1"
                    >
                        {title}
                    </Text>
                    <Text
                        title={title}
                        className="text-bold text-black decoration-1"
                    >
                        {content}
                    </Text>
                </div>
                <div className="flex items-center gap-8">
                    {percentVoted !== undefined &&
                        percentNotVoteYet !== undefined &&
                        percentUnVoted !== undefined && (
                            <Tooltip
                                placement="top"
                                title={t(voteErrorMessage)}
                            >
                                <Radio.Group
                                    onChange={onVoteConfirm}
                                    value={value}
                                    disabled={
                                        voteStatus === FETCH_STATUS.LOADING ||
                                        !!voteErrorMessage
                                    }
                                >
                                    <Radio value={VoteProposalOption.VOTE}>
                                        <div className="flex flex-col">
                                            <div>{t('VOTED')}</div>
                                            <Text className="text-polar-green">
                                                {formatNumber(
                                                    votePercent.percentVoted,
                                                    {
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                                %
                                            </Text>
                                        </div>
                                    </Radio>
                                    <Radio value={VoteProposalOption.UN_VOTE}>
                                        <div className="flex flex-col">
                                            <div>{t('UNVOTED')}</div>
                                            <Text className="text-polar-green">
                                                {formatNumber(
                                                    votePercent.percentUnVoted,
                                                    {
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                                %
                                            </Text>
                                        </div>
                                    </Radio>
                                    <Radio value={VoteProposalOption.NO_IDEA}>
                                        <div className="flex flex-col">
                                            <div>{t('NO_IDEA')}</div>
                                            <Text className="text-polar-green">
                                                {formatNumber(
                                                    votePercent.percentNotVoteYet,
                                                    {
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                                %
                                            </Text>
                                        </div>
                                    </Radio>
                                </Radio.Group>
                            </Tooltip>
                        )}
                </div>
            </div>
        </div>
    )
}

export default DetailCandidateItem
