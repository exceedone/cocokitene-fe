'use client'

import { FETCH_STATUS } from '@/constants/common'
import { VoteProposalOption } from '@/constants/resolution'
import servicePersonnelVoting from '@/services/personnel-voting'
import { ICandidateResponse } from '@/services/response.type'
import { formatNumber } from '@/utils/format-number'
import {
    Button,
    Checkbox,
    Input,
    Modal,
    notification,
    Tooltip,
    Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useMemo, useState } from 'react'

import type { CheckboxProps } from 'antd'
import { ElectionEnum } from '@/constants/election'

const { Text } = Typography

interface IDetailPersonnelVoting {
    index: number
    title: string
    id: number
    candidate: ICandidateResponse[]
    totalQuantityShare: number
    voteErrorMessage?: string
    quantityShareOfUser: number
    electionStatus: ElectionEnum
}

const DetailPersonnelVotingItem = ({
    index,
    title,
    id,
    candidate,
    totalQuantityShare,
    voteErrorMessage,
    quantityShareOfUser,
    electionStatus,
}: IDetailPersonnelVoting) => {
    const t = useTranslations()
    const [candidateOrigin, setCandidateOrigin] =
        useState<ICandidateResponse[]>(candidate)

    const [candidateInfo, setCandidateInfo] =
        useState<ICandidateResponse[]>(candidate)

    const [voteStatus, setVoteStatus] = useState(FETCH_STATUS.IDLE)

    const [openModal, setOpenModal] = useState<boolean>(false)

    //CheckBox
    const [checked, setChecked] = useState<boolean>(false)

    const handleChangeCheckBox: CheckboxProps['onChange'] = (e) => {
        setChecked(e.target.checked)
        if (e.target.checked) {
            const candidateInfoChange = [...candidateInfo].map((candidate) => ({
                ...candidate,
                votedQuantityShare: Math.floor(
                    quantityShareOfUser / candidateInfo.length,
                ),
                voteResult: VoteProposalOption.VOTE,
            }))
            setCandidateInfo(candidateInfoChange)
        }
    }
    //Modal Voting Personnel
    const handleOk = () => {
        const config = {
            title,
            content: t('DO_YOU_WANT_TO_CHANGE_YOUR_VOTE_RESULT?'),
            okText: t('OK'),
            cancelText: t('CANCEL'),
            onOk() {
                handleVotingPersonnel()
            },
        }
        Modal.confirm(config)
    }

    const handleCancel = () => {
        setOpenModal(false)
        setCandidateInfo(candidateOrigin)
        setChecked(false)
    }

    // Handle Voting Candidate
    const handleVotingPersonnel = async () => {
        try {
            setOpenModal(false)
            setVoteStatus(FETCH_STATUS.LOADING)
            //Call Api Voting personnel
            const personnelVoteResponse =
                await servicePersonnelVoting.voteCandidateInPersonnelVote(id, {
                    candidate: candidateInfo.map((candidate) => ({
                        id: candidate.id,
                        result: candidate.voteResult,
                        quantityShare: candidate.votedQuantityShare ?? 0,
                    })),
                })
            //
            if (personnelVoteResponse) {
                setCandidateOrigin(personnelVoteResponse.candidate)
                setCandidateInfo(personnelVoteResponse.candidate)
                setChecked(false)
                setVoteStatus(FETCH_STATUS.SUCCESS)
                notification.success({
                    message: t('VOTED_CANDIDATE'),
                    description: t('CHANGE_VOTE_RESULT_CANDIDATE_SUCCESSFULLY'),
                    duration: 2,
                })
            }
        } catch (error) {
            notification.error({
                message: t('VOTED_CANDIDATE'),
                duration: 2,
            })
            console.log('Vote for candidate failed!!!')
            setCandidateInfo(candidateOrigin)
            setVoteStatus(FETCH_STATUS.ERROR)
        }
    }

    // const handleOnChangeInput = (index: number) => (value: number | null) => {
    const handleOnChangeInput =
        (index: number) => (value: ChangeEvent<HTMLInputElement>) => {
            if (/^\d*$/.test(String(value.target.value))) {
                const candidateInfoChange = [...candidateInfo]
                candidateInfoChange[index] = {
                    ...candidateInfoChange[index],
                    votedQuantityShare: Number(value.target.value),
                    voteResult: VoteProposalOption.VOTE,
                }
                setCandidateInfo(candidateInfoChange)
                setChecked(false)
            }
        }

    const votedQuantityShare: number = useMemo(() => {
        const totalVotedQuantityShare = candidateInfo.reduce(
            (accumulator, currentValue) => {
                accumulator += Number(currentValue.votedQuantity)
                return accumulator
            },
            0,
        )
        return totalVotedQuantityShare
    }, [candidateInfo])

    const votedQuantityShareUser: number = useMemo(() => {
        const totalVotedQuantityShareUser = candidateInfo.reduce(
            (accumulator, currentValue) => {
                accumulator += Number(currentValue.votedQuantityShare)
                return accumulator
            },
            0,
        )
        return totalVotedQuantityShareUser
    }, [candidateInfo])

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-2 border-b border-b-neutral/4 px-8 pb-8 pt-1">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-neutral/5 bg-neutral/2">
                        <Text className="text-bold">{index + 1}</Text>
                    </div>
                    <Text
                        title={title}
                        className="text-bold break-words text-base text-black decoration-1"
                    >
                        {title}
                    </Text>
                </div>
                <div className="flex w-full flex-grow items-center justify-between px-12">
                    <div className="w-[20%]">{t('CANDIDATE_NAME')}</div>
                    <div className="w-[20%] text-center">
                        {t('TOTAL_VOTES_FAVOR')}
                    </div>
                    <div className="w-[20%] text-center">
                        {t('TOTAL_VOTES_CAST')}
                    </div>
                    <div className="w-[20%]">
                        <Tooltip placement="top" title={t(voteErrorMessage)}>
                            <Button
                                disabled={
                                    voteStatus === FETCH_STATUS.LOADING ||
                                    !!voteErrorMessage
                                }
                                onClick={() => {
                                    setOpenModal(true)
                                }}
                            >
                                {t('VOTE')}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-3">
                    {candidateInfo.map((candidate) => {
                        const votedQuantity = Number(candidate.votedQuantity)

                        const percentVoted =
                            totalQuantityShare === 0
                                ? 0
                                : (votedQuantity * 100) / totalQuantityShare

                        return (
                            <div
                                className="flex w-full flex-grow items-center justify-between px-12"
                                key={candidate.id}
                            >
                                <div className="w-[20%] break-words">
                                    {candidate.candidateName}
                                </div>

                                <div className="w-[20%] text-center">
                                    <Text>
                                        {votedQuantity}/{totalQuantityShare}{' '}
                                    </Text>
                                    <Text className="text-polar-green">
                                        (
                                        {formatNumber(percentVoted, {
                                            maximumFractionDigits: 2,
                                        })}
                                        %)
                                    </Text>
                                </div>
                                <div className="w-[20%] text-center">
                                    {Number(candidate.votedQuantityShare)}
                                </div>
                                <span className="w-[20%]"></span>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-2 flex w-full items-start justify-start gap-[10%] px-12">
                    <div>
                        <span className="font-medium">
                            {t('TOTAL_UNCAST_VOTE')}:{' '}
                        </span>
                        <span>{totalQuantityShare - votedQuantityShare}</span>
                    </div>
                </div>
            </div>

            {/* Modal voting personnel Voting */}
            <Modal
                title={title}
                open={openModal}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                width={787}
                okButtonProps={{
                    disabled: votedQuantityShareUser > quantityShareOfUser,
                }}
                cancelText={t('BTN_CANCEL')}
                okText={t('OK')}
                closable={false}
            >
                <div className="flex w-full flex-grow items-center justify-between px-12">
                    {
                        <Text className="ml-[25%] h-5 text-red-500">
                            {votedQuantityShareUser > quantityShareOfUser &&
                                t('QUANTITY_VOTE_GREATER_THAN_ALLOWED', {
                                    allowed: quantityShareOfUser,
                                })}
                        </Text>
                    }
                </div>
                <div className="flex flex-col items-start justify-between gap-2 border-b border-b-neutral/4 pb-8 pt-1">
                    <div className="flex w-full flex-grow items-center justify-between px-12">
                        <div className="flex w-[25%] gap-1">
                            <Checkbox
                                checked={checked}
                                onChange={handleChangeCheckBox}
                            ></Checkbox>
                            <span>
                                {electionStatus ==
                                ElectionEnum.VOTE_OF_CONFIDENCE
                                    ? t('DISTRIBUTE_VOTE')
                                    : t('FULLY_APPROVE')}
                            </span>
                        </div>
                        <div className="w-[25%]">{t('ENTER_NUMBER_VOTES')}</div>
                        <div className="w-[25%]">{t('PERCENTAGE')}</div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        {candidateInfo.map((candidate, index) => {
                            return (
                                <div
                                    className="flex w-full flex-grow items-center justify-between px-12"
                                    key={candidate.id}
                                >
                                    <div className="w-[25%] break-words">
                                        {candidate.candidateName}
                                    </div>
                                    <div className="w-[25%]">
                                        <Input
                                            className="w-full"
                                            maxLength={9}
                                            defaultValue={Number(
                                                candidate.votedQuantityShare,
                                            )}
                                            value={
                                                candidate.votedQuantityShare ??
                                                0
                                            }
                                            onChange={handleOnChangeInput(
                                                index,
                                            )}
                                        />
                                    </div>
                                    <div className="w-[25%]">
                                        {formatNumber(
                                            (Number(
                                                candidate.votedQuantityShare,
                                            ) *
                                                100) /
                                                quantityShareOfUser,
                                            {
                                                maximumFractionDigits: 2,
                                            },
                                        )}
                                        %
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex w-full flex-grow items-center gap-[10%] px-12">
                        <div>
                            <span className="font-medium">
                                {t('NUMBER_VALID_VOTES')}:{' '}
                            </span>
                            <span>{quantityShareOfUser}</span>
                        </div>
                        <div>
                            <span className="font-medium">
                                {t('REMAINING_SHARE')}:{' '}
                            </span>
                            <span>
                                {quantityShareOfUser - votedQuantityShareUser}
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default DetailPersonnelVotingItem
