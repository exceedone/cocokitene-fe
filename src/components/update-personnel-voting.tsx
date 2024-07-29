/* eslint-disable */

import { ElectionEnum } from '@/constants/election'
import { ResolutionTitle, ResolutionType } from '@/constants/resolution'
import { IElectionResponse } from '@/services/response.type'
import {
    useCreateMeetingInformation,
    useUpdateMeetingInformation,
} from '@/stores/meeting/hooks'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { ChangeEvent } from 'react'

const { Text } = Typography
const { TextArea } = Input

interface IUpdatePersonnelVoting {
    type: ResolutionType
    index: number
    title: string
    candidate: { candidateName: string }[]
    electionStatus: ElectionEnum
    // eslint-disable-next-line
    onChangeTitle: (value: string) => void
    onDelete: () => void
    electionList: IElectionResponse[] | []
}

const UpdatePersonnelVoting = ({
    type,
    index,
    title,
    candidate,
    electionStatus,
    onChangeTitle,
    onDelete,
    electionList,
}: IUpdatePersonnelVoting) => {
    const t = useTranslations()

    const [data, setUpdateMeetingInformation, status, initUpdateMeeting] =
        useUpdateMeetingInformation()

    const onAddNewCandidate = (index: number) => {
        if (electionStatus == ElectionEnum.VOTE_OF_CONFIDENCE) {
            const personnelVotingConfident = [
                ...data.personnelVoting.confidence,
            ]
            personnelVotingConfident[index] = {
                ...personnelVotingConfident[index],
                candidate: [
                    ...personnelVotingConfident[index].candidate,
                    { candidateName: '' },
                ],
            }
            setUpdateMeetingInformation({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    confidence: [...personnelVotingConfident],
                },
            })
        }
        if (electionStatus == ElectionEnum.VOTE_OF_NOT_CONFIDENCE) {
            const personnelVotingNotConfident = [
                ...data.personnelVoting.confidence,
            ]
            personnelVotingNotConfident[index] = {
                ...personnelVotingNotConfident[index],
                candidate: [
                    ...personnelVotingNotConfident[index].candidate,
                    { candidateName: '' },
                ],
            }
            setUpdateMeetingInformation({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    notConfidence: [...personnelVotingNotConfident],
                },
            })
        }
    }

    const onDeleteCandidate = (index: number, indexCandidate: number) => {
        // console.log('index:', index)
        // console.log('indexCandidate:', indexCandidate)
        if (electionStatus == ElectionEnum.VOTE_OF_CONFIDENCE) {
            const personnelVotingConfident = [
                ...data.personnelVoting.confidence,
            ]
            personnelVotingConfident[index] = {
                ...personnelVotingConfident[index],
                candidate: [
                    ...personnelVotingConfident[index].candidate.filter(
                        (candidate, i) => i !== indexCandidate,
                    ),
                ],
            }
            setUpdateMeetingInformation({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    confidence: [...personnelVotingConfident],
                },
            })
        }
        if (electionStatus == ElectionEnum.VOTE_OF_NOT_CONFIDENCE) {
            const personnelVotingNotConfident = [
                ...data.personnelVoting.confidence,
            ]
            personnelVotingNotConfident[index] = {
                ...personnelVotingNotConfident[index],
                candidate: [
                    ...personnelVotingNotConfident[index].candidate.filter(
                        (candidate, i) => i !== indexCandidate,
                    ),
                ],
            }
            setUpdateMeetingInformation({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    notConfidence: [...personnelVotingNotConfident],
                },
            })
        }
    }

    const onChange =
        (callback: (value: string) => void) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            callback(event.target.value)
        }

    const onChangeCandidateName = (
        event: ChangeEvent<HTMLInputElement>,
        indexCandidate: number,
    ) => {
        if (electionStatus == ElectionEnum.VOTE_OF_CONFIDENCE) {
            const personnelVotingConfident = [
                ...data.personnelVoting.confidence,
            ]
            const candidateEdit = [...personnelVotingConfident[index].candidate]
            candidateEdit[indexCandidate] = {
                ...candidateEdit[indexCandidate],
                candidateName: event.target.value,
            }
            personnelVotingConfident[index] = {
                ...personnelVotingConfident[index],
                candidate: [...candidateEdit],
            }
            setUpdateMeetingInformation({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    confidence: [...personnelVotingConfident],
                },
            })
        }
        if (electionStatus == ElectionEnum.VOTE_OF_NOT_CONFIDENCE) {
            const personnelVotingNotConfident = [
                ...data.personnelVoting.notConfidence,
            ]
            const candidateEdit = [
                ...personnelVotingNotConfident[index].candidate,
            ]
            candidateEdit[indexCandidate] = {
                ...candidateEdit[indexCandidate],
                candidateName: event.target.value,
            }
            personnelVotingNotConfident[index] = {
                ...personnelVotingNotConfident[index],
                candidate: [...candidateEdit],
            }
            setUpdateMeetingInformation({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    notConfidence: [...personnelVotingNotConfident],
                },
            })
        }
    }

    return (
        <div className="flex flex-row items-start gap-2">
            <div>
                <span className="mr-2 align-middle text-lg font-medium text-[#ff4d4f]">
                    *
                </span>
                <Text className="leading-10">
                    {t(ResolutionTitle[type])} {index + 1} :
                </Text>
            </div>

            <div className="flex flex-grow flex-col gap-2">
                <Input
                    className="placeholder:text-sm"
                    placeholder={t('ENTER_TITLE')}
                    value={title}
                    size="large"
                    onChange={onChange(onChangeTitle)}
                    maxLength={50}
                />
                {candidate.map((candidate, i) => {
                    return (
                        <div className="flex gap-2">
                            <Input
                                className="placeholder:text-sm"
                                placeholder={t('ENTER_CANDIDATE_NAME')}
                                value={candidate.candidateName}
                                onChange={(event) => {
                                    onChangeCandidateName(event, i)
                                }}
                                maxLength={50}
                            />
                            {electionStatus ==
                                ElectionEnum.VOTE_OF_CONFIDENCE && (
                                <MinusOutlined
                                    className={`mr-[-50px] h-10 text-gray-500`}
                                    disabled={i === 1}
                                    onClick={() => {
                                        onDeleteCandidate(index, i)
                                    }}
                                />
                            )}
                        </div>
                    )
                })}
                {electionStatus == ElectionEnum.VOTE_OF_CONFIDENCE && (
                    <Button
                        onClick={() => {
                            onAddNewCandidate(index)
                        }}
                        icon={<PlusOutlined />}
                        disabled={candidate.length >= 5}
                    ></Button>
                )}
            </div>
            <div className="w-[5%]"></div>
            <DeleteOutlined
                className={`h-10 text-dust-red`}
                disabled={index === 1}
                onClick={onDelete}
            />
        </div>
    )
}

export default UpdatePersonnelVoting
