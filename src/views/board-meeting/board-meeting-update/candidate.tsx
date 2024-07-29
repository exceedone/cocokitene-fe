/* eslint-disable */

import BoxArea from '@/components/box-area'
import UpdateCandidateItem from '@/components/update-candidate-item'
import { ElectionEnum } from '@/constants/election'
import { ResolutionType } from '@/constants/resolution'
import serviceElection from '@/services/election'
import { IElectionResponse } from '@/services/response.type'
import { useUpdateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const Candidate = () => {
    const t = useTranslations()
    const [data, setData] = useUpdateBoardMeetingInformation()
    const [electionList, setElectionList] = useState<IElectionResponse[]>()
    const [defaultElection, setDefaultElection] = useState<number>()

    useEffect(() => {
        try {
            ;(async () => {
                const electionList = await serviceElection.getAllElection({
                    page: 1,
                    limit: 10,
                })
                if (electionList) {
                    setElectionList(electionList)
                    setDefaultElection(
                        electionList.filter(
                            (election) =>
                                election.status ==
                                ElectionEnum.VOTE_OF_CONFIDENCE,
                        )[0].id,
                    )
                }
            })()
        } catch (error) {
            console.log(error)
        }
    }, [])

    const onChange =
        (name: 'title' | 'candidateName', index: number) => (value: string) => {
            const candidates = [...data.candidates]
            candidates[index] = {
                ...candidates[index],
                [name]: value,
            }
            setData({
                ...data,
                candidates,
            })
        }

    const onAddNew = () => {
        setData({
            ...data,
            candidates: [
                ...data.candidates,
                {
                    id: Math.random(),
                    title: '',
                    candidateName: '',
                    type: defaultElection,
                },
            ],
        })
    }

    const onDelete = (index: number) => () => {
        setData({
            ...data,
            candidates: data.candidates.filter((r, i) => i !== index),
        })
    }

    return (
        <BoxArea title={t('EXECUTIVE_OFFICER_ELECTION')}>
            <div className="mb-6 flex flex-col gap-6">
                {data.candidates.map((x, index) => (
                    <UpdateCandidateItem
                        key={x.id}
                        type={ResolutionType.EXECUTIVE_OFFICER}
                        index={index + 1}
                        title={data.candidates[index].title}
                        content={data.candidates[index].candidateName}
                        onChangeTitle={onChange('title', index)}
                        onChangeContent={onChange('candidateName', index)}
                        onDelete={onDelete(index)}
                        electionList={electionList}
                        electionId={data.candidates[index].type}
                    />
                ))}
            </div>

            <Button
                onClick={onAddNew}
                icon={<PlusOutlined />}
                disabled={data.candidates.length >= 10}
            >
                {t('ADD_NEW')}
            </Button>
        </BoxArea>
    )
}

export default Candidate
