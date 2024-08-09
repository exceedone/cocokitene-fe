/* eslint-disable */

import { useTranslations } from 'next-intl'
import { useCreateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import { useEffect, useState } from 'react'
import serviceElection from '@/services/election'
import BoxArea from '@/components/box-area'
import { ResolutionType } from '@/constants/resolution'
import { IElectionResponse } from '@/services/response.type'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ElectionEnum } from '@/constants/election'
import CreatePersonnelVotingBoardMtg from '@/components/create-personnel-voting-board'

export interface ICandidateForm {
    title: string
    candidateName: string
    typeId: number
}

const Candidates = () => {
    const t = useTranslations()
    const [data, setData] = useCreateBoardMeetingInformation()
    const [electionList, setElectionList] = useState<IElectionResponse[]>([])

    useEffect(() => {
        try {
            ;(async () => {
                const electionList = await serviceElection.getAllElection({
                    page: 1,
                    limit: 10,
                })
                if (electionList) {
                    setElectionList(electionList)
                    setData({
                        ...data,
                        personnelVoting: {
                            confidence: [...data.personnelVoting.confidence],
                            notConfidence: [
                                ...data.personnelVoting.notConfidence,
                            ],
                        },
                    })
                }
            })()
        } catch (error) {
            console.log(error)
        }
    }, [])

    const onChangeTitle =
        (name: 'title', index: number, type: ElectionEnum) =>
        (value: string) => {
            if (type == ElectionEnum.VOTE_OF_CONFIDENCE) {
                const personnelVotingConfidence = [
                    ...data.personnelVoting.confidence,
                ]
                personnelVotingConfidence[index] = {
                    ...personnelVotingConfidence[index],
                    [name]: value,
                }
                setData({
                    ...data,
                    personnelVoting: {
                        ...data.personnelVoting,
                        confidence: personnelVotingConfidence,
                    },
                })
            }
            if (type == ElectionEnum.VOTE_OF_NOT_CONFIDENCE) {
                const personnelVotingNotConfidence = [
                    ...data.personnelVoting.notConfidence,
                ]
                personnelVotingNotConfidence[index] = {
                    ...personnelVotingNotConfidence[index],
                    [name]: value,
                }
                setData({
                    ...data,
                    personnelVoting: {
                        ...data.personnelVoting,
                        notConfidence: personnelVotingNotConfidence,
                    },
                })
            }
        }

    const onAddNewConfidence = () => {
        setData({
            ...data,
            personnelVoting: {
                ...data.personnelVoting,
                confidence: [
                    ...data.personnelVoting.confidence,
                    {
                        title: '',
                        type: electionList.filter(
                            (election) =>
                                election.status ==
                                ElectionEnum.VOTE_OF_CONFIDENCE,
                        )[0].id,
                        candidate: [{ candidateName: '' }],
                    },
                ],
            },
        })
    }

    const onAddNewNotConfidence = () => {
        setData({
            ...data,
            personnelVoting: {
                ...data.personnelVoting,
                notConfidence: [
                    ...data.personnelVoting.notConfidence,
                    {
                        title: '',
                        type: electionList.filter(
                            (election) =>
                                election.status ==
                                ElectionEnum.VOTE_OF_NOT_CONFIDENCE,
                        )[0].id,
                        candidate: [{ candidateName: '' }],
                    },
                ],
            },
        })
    }

    const onDelete = (index: number, type: ElectionEnum) => () => {
        console.log('index Delete: ', index)
        if (type == ElectionEnum.VOTE_OF_CONFIDENCE) {
            setData({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    confidence: data.personnelVoting.confidence.filter(
                        (voting, i) => i !== index,
                    ),
                },
            })
        }
        if (type == ElectionEnum.VOTE_OF_NOT_CONFIDENCE) {
            setData({
                ...data,
                personnelVoting: {
                    ...data.personnelVoting,
                    notConfidence: data.personnelVoting.notConfidence.filter(
                        (voting, i) => i !== index,
                    ),
                },
            })
        }
    }

    console.log('data.personnelVoting: ', data.personnelVoting)

    return (
        <BoxArea title={t('EXECUTIVE_OFFICER_ELECTION')}>
            <BoxArea title={t('APPOINTMENT')}>
                <div className="mb-6 flex flex-col gap-6">
                    {data.personnelVoting.confidence.map((x, index) => {
                        return (
                            <CreatePersonnelVotingBoardMtg
                                type={ResolutionType.EXECUTIVE_OFFICER}
                                index={index}
                                title={x.title}
                                candidate={x.candidate}
                                electionStatus={ElectionEnum.VOTE_OF_CONFIDENCE}
                                onChangeTitle={onChangeTitle(
                                    'title',
                                    index,
                                    ElectionEnum.VOTE_OF_CONFIDENCE,
                                )}
                                onDelete={onDelete(
                                    index,
                                    ElectionEnum.VOTE_OF_CONFIDENCE,
                                )}
                                electionList={electionList}
                            />
                        )
                    })}
                </div>

                <Button
                    onClick={onAddNewConfidence}
                    icon={<PlusOutlined />}
                    disabled={
                        [
                            ...data.personnelVoting.confidence,
                            ...data.personnelVoting.notConfidence,
                        ].length >= 10
                    }
                >
                    {t('ADD_NEW')}
                </Button>
            </BoxArea>

            <BoxArea title={t('DISMISSAL')}>
                <div className="mb-6 flex flex-col gap-6">
                    {data.personnelVoting.notConfidence.map((x, index) => {
                        return (
                            <CreatePersonnelVotingBoardMtg
                                type={ResolutionType.EXECUTIVE_OFFICER}
                                index={index}
                                title={x.title}
                                candidate={x.candidate}
                                electionStatus={
                                    ElectionEnum.VOTE_OF_NOT_CONFIDENCE
                                }
                                onChangeTitle={onChangeTitle(
                                    'title',
                                    index,
                                    ElectionEnum.VOTE_OF_NOT_CONFIDENCE,
                                )}
                                onDelete={onDelete(
                                    index,
                                    ElectionEnum.VOTE_OF_NOT_CONFIDENCE,
                                )}
                                electionList={electionList}
                            />
                        )
                    })}
                </div>

                <Button
                    onClick={onAddNewNotConfidence}
                    icon={<PlusOutlined />}
                    disabled={
                        [
                            ...data.personnelVoting.confidence,
                            ...data.personnelVoting.notConfidence,
                        ].length >= 10
                    }
                >
                    {t('ADD_NEW')}
                </Button>
            </BoxArea>
        </BoxArea>
    )
}

export default Candidates
