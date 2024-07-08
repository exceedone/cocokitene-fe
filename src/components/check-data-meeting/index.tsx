/* eslint-disable */

import { MeetingType } from '@/constants/meeting'
import serviceBoardMeeting from '@/services/board-meeting'
import serviceMeeting from '@/services/meeting'
import { IDataHashMeeting } from '@/services/response.type'
import { useCheckDataMeeting } from '@/stores/check-data-meeting/hooks'
import { EActionStatus } from '@/stores/type'
import { Button, Modal, Row, Spin, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useState } from 'react'

export enum MeetingHash {
    HASH_DETAIL_MEETING = 'detailMeetingHash',
    HASH_MEETING_BASE = 'basicInformationMeetingHash',
    HASH_MEETING_FILE = 'fileMeetingHash',
    HASH_MEETING_PROPOSAL = 'proposalMeetingHash',
    HASH_MEETING_VOTED_PROPOSAL = 'votedProposalHash',
    HASH_MEETING_CANDIDATE = 'candidateHash',
    HASH_MEETING_VOTED_CANDIDATE = 'votedCandidateHash',
    HASH_MEETING_PARTICIPANT = 'participantHash',
}

export const checkDataMessage: { [key in MeetingHash]: string } = {
    [MeetingHash.HASH_DETAIL_MEETING]: 'THE_DATA_OF_MEETING_MATCHED',
    [MeetingHash.HASH_MEETING_BASE]:
        'THE_MEETING_BASIC_INFORMATION_HAS_BEEN_CHANGED',
    [MeetingHash.HASH_MEETING_FILE]:
        'THE_MEETING_FILE_INFORMATION_HAS_BEEN_CHANGED',
    [MeetingHash.HASH_MEETING_PROPOSAL]:
        'THE_PROPOSAL_INFORMATION_HAS_BEEN_CHANGED',
    [MeetingHash.HASH_MEETING_VOTED_PROPOSAL]:
        'THE_VOTED_DATA_OF_PROPOSAL_HAS_BEEN_CHANGED',
    [MeetingHash.HASH_MEETING_CANDIDATE]:
        'THE_CANDIDATE_INFORMATION_HAS_BEEN_CHANGED',
    [MeetingHash.HASH_MEETING_VOTED_CANDIDATE]:
        'THE_VOTED_DATA_OF_CANDIDATE_HAS_BEEN_CHANGED',
    [MeetingHash.HASH_MEETING_PARTICIPANT]:
        'THE_PARTICIPANT_OF_MEETING_HAS_BEEN_CHANGED',
}

const ModalCheckDataInMtg = () => {
    const t = useTranslations()

    const [hashValue, setHashValue] = useState<string>('')
    const [status, setStatus] = useState<EActionStatus>(EActionStatus.Idle)
    const [dataCheck, setDataCheck] = useState<string[]>([])

    const { checkDataMeetingState, setInfoCheckMeeting, setOpenModalCheck } =
        useCheckDataMeeting()

    const pressHashInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setHashValue(e.target.value.trim())
    }

    const handleCheckDataHash = async () => {
        const arrayHashValue = hashValue.trim().split(',')

        const objHashValue: { [key: string]: string } = {}
        for (let i = 0; i < arrayHashValue.length; i += 2) {
            objHashValue[arrayHashValue[i]] = arrayHashValue[i + 1]
        }

        try {
            setStatus(EActionStatus.Pending)
            let dataHashMeeting: IDataHashMeeting
            if (
                checkDataMeetingState.type === MeetingType.SHAREHOLDER_MEETING
            ) {
                dataHashMeeting = await serviceMeeting.getDataHashMeeting(
                    checkDataMeetingState.meetingId,
                )
            } else {
                dataHashMeeting =
                    await serviceBoardMeeting.getDataHashBoardMeeting(
                        checkDataMeetingState.meetingId,
                    )
            }
            if (dataHashMeeting) {
                setStatus(EActionStatus.Succeeded)
                const arrCheck: string[] = []
                Object.values(MeetingHash).forEach((hash) => {
                    if (hash == MeetingHash.HASH_DETAIL_MEETING) {
                        objHashValue[hash] == dataHashMeeting[hash] &&
                            arrCheck.push(checkDataMessage[hash])
                    } else {
                        objHashValue[hash] !== dataHashMeeting[hash] &&
                            arrCheck.push(checkDataMessage[hash])
                    }
                })

                setDataCheck([...arrCheck])
            }
        } catch (error) {
            setStatus(EActionStatus.Failed)
        }
    }

    return (
        <>
            <Modal
                footer={null}
                // closeIcon={null}
                onCancel={() => {
                    setOpenModalCheck(false)
                    setStatus(EActionStatus.Idle)
                    setDataCheck([])
                    setHashValue('')
                }}
                open={checkDataMeetingState.openModalCheckData}
                centered
            >
                <div className="mb-5 flex h-[38px] w-full items-center px-2 pt-2 hover:cursor-pointer">
                    <Tooltip
                        placement="top"
                        color="white"
                        overlayStyle={{ maxWidth: '378px' }}
                        title={
                            t('CHECK_DATA_OF_MEETING', {
                                name: checkDataMeetingState.name,
                            }).length > 80 ? (
                                <span className="w-full text-black">
                                    {t('CHECK_DATA_OF_MEETING', {
                                        name: checkDataMeetingState.name,
                                    })}
                                </span>
                            ) : (
                                false
                            )
                        }
                    >
                        <span className="mx-auto line-clamp-2 max-w-full text-xl font-semibold">
                            {t('CHECK_DATA_OF_MEETING', {
                                name: checkDataMeetingState.name,
                            })}
                        </span>
                    </Tooltip>
                </div>
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <TextArea
                            onChange={(e) => pressHashInput(e)}
                            placeholder={t('PLEASE_INPUT_HASH_CODE')}
                            value={hashValue}
                            autoSize={{ minRows: 2, maxRows: 2 }}
                        />
                        <Button
                            type="primary"
                            onClick={handleCheckDataHash}
                            disabled={!hashValue.length}
                        >
                            {t('CHECK_DATA')}
                        </Button>
                    </div>
                    <div className="">
                        {status === EActionStatus.Idle ? (
                            <></>
                        ) : status === EActionStatus.Pending ? (
                            <Row
                                align={'middle'}
                                justify={'center'}
                                style={{ height: '100%' }}
                            >
                                <Spin tip="Loading..." />
                            </Row>
                        ) : (
                            <div className="flex flex-col gap-1 pl-6">
                                {dataCheck.map((data) => {
                                    if (
                                        data ==
                                        checkDataMessage[
                                            MeetingHash.HASH_DETAIL_MEETING
                                        ]
                                    ) {
                                        return (
                                            <div>
                                                &#x2022;{' '}
                                                <span className="text-green-400">
                                                    {t(data)}
                                                </span>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div>
                                            &#x2022;{' '}
                                            <span className="text-red-400">
                                                {t(data)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ModalCheckDataInMtg
