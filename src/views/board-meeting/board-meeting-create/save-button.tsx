/* eslint-disable */

import { useTranslations } from 'next-intl'
import { useCreateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import { useState } from 'react'
import { FETCH_STATUS, urlRegex } from '@/constants/common'
import { useRouter } from 'next/navigation'
import { Button, notification, Spin } from 'antd'
import {
    IBoardMeetingReport,
    ICreateBoardMeeting,
} from '@/stores/board-meeting/types'
import {
    ICreateBoardMeetingPayload,
    ISaveCreateBoardMeetingPayload,
} from '@/services/request.type'
import serviceBoardMeeting from '@/services/board-meeting'
import serviceUpload from '@/services/upload'
import { RcFile } from 'antd/es/upload'
import { MeetingCode, MeetingFileType } from '@/constants/meeting'
import companyServicePlan from '@/services/company-service-plan'
import { FolderType } from '@/constants/s3'

const SaveCreateBoardMeetingButton = () => {
    const t = useTranslations()

    const [data, , resetData] = useCreateBoardMeetingInformation()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE)
    const router = useRouter()
    const onValidate = (data: ICreateBoardMeeting) => {
        const payload = {
            title: data.title.trim(),
            meetingLink:
                data.meetingLink && !data.meetingLink.startsWith('https://')
                    ? `https://${data.meetingLink}`
                    : data.meetingLink,
            startTime: data.startTime,
            endTime: data.endTime,
            endVotingTime: data.endVotingTime,
            note: data.note,
            meetingMinutes: data.meetingMinutes,
            meetingInvitations: data.meetingInvitations,
            managementAndFinancials: data.managementAndFinancials.map(
                (management) => ({
                    ...management,
                    title: management.title.trim(),
                    description: management.description.trim(),
                    oldDescription: management.oldDescription?.trim(),
                }),
            ),
            elections: data.elections.map((election) => ({
                ...election,
                title: election.title.trim(),
                description: election.description.trim(),
                oldDescription: election.oldDescription?.trim(),
            })),
            personnelVoting: [
                ...data.personnelVoting.confidence,
                ...data.personnelVoting.notConfidence,
            ].map((personnel) => ({
                title: personnel.title.trim(),
                type: personnel.type,
                candidate: personnel.candidate
                    .filter((candidate) => candidate.candidateName.trim())
                    .map((candidate) => {
                        return {
                            ...candidate,
                            candidateName: candidate.candidateName.trim(),
                        }
                    }),
            })),
            participants: data.participants?.map((participant) => {
                return {
                    roleMtgId: participant.roleMtgId,
                    roleName: participant.roleName,
                    userIds: participant.userParticipant?.map(
                        (user) => user.users_id,
                    ),
                }
            }),
        }
        const rs: {
            isValid: boolean
            errors: { [key: string]: string }
            payload: ISaveCreateBoardMeetingPayload
        } = {
            isValid: true,
            errors: {},
            payload,
        }

        if (!payload.title.trim()) {
            rs.isValid = false
            rs.errors.title = 'title'
        }
        if (!urlRegex.test(payload.meetingLink)) {
            rs.isValid = false
            rs.errors.meetingLink = 'meetingLink'
        }

        //Check
        if (
            payload.managementAndFinancials.some(
                (management) => !management.title.trim(),
            )
        ) {
            rs.isValid = false
            rs.errors.resolutions = 'managementAndFinancials'
        }

        if (payload.elections.some((election) => !election.title.trim())) {
            rs.isValid = false
            rs.errors.resolutions = 'elections'
        }

        if (
            payload.personnelVoting.some(
                (personnel) =>
                    !personnel.title.trim() ||
                    personnel.candidate.some(
                        (candidate) => !candidate.candidateName.trim(),
                    ),
            )
        ) {
            rs.isValid = false
            rs.errors.resolutions = 'personnelVoting'
        }

        return rs
    }
    const validate = onValidate(data)
    const onSave = () => {
        if (!validate.isValid) {
            return
        }
        try {
            ;(async () => {
                setStatus(FETCH_STATUS.LOADING)

                const meetingCode: string =
                    MeetingCode.MEETING_PRE_CODE +
                    Math.floor(100000000 + Math.random() * 900000000)

                let storageUsed: number = 0

                const managementAndFinancials: IBoardMeetingReport[] = []
                const elections: IBoardMeetingReport[] = []

                validate.payload.managementAndFinancials.forEach(
                    async (managementAndFinancial) => {
                        const managementAndFinancialItem: IBoardMeetingReport =
                            {
                                ...managementAndFinancial,
                                files:
                                    managementAndFinancial.files &&
                                    (await Promise.all(
                                        managementAndFinancial.files.map(
                                            async (file) => {
                                                // @ts-ignore
                                                storageUsed += +file.file.size

                                                const res =
                                                    await serviceUpload.getPresignedUrl(
                                                        FolderType.MEETING,
                                                        meetingCode,
                                                        [file.file as File],
                                                        MeetingFileType.REPORTS,
                                                    )
                                                await serviceUpload.uploadFile(
                                                    file.file as File,
                                                    res.uploadUrls[0],
                                                )

                                                return {
                                                    id: file.id,
                                                    url: res.uploadUrls[0]
                                                        .split('?')[0]
                                                        .split(
                                                            '.amazonaws.com/',
                                                        )[1],
                                                    uid: file.uid,
                                                }
                                            },
                                        ),
                                    )),
                            }
                        managementAndFinancials.push(managementAndFinancialItem)
                    },
                )

                validate.payload.elections.forEach(async (election) => {
                    const electionItem: IBoardMeetingReport = {
                        ...election,
                        files:
                            election.files &&
                            (await Promise.all(
                                election.files.map(async (file) => {
                                    // @ts-ignore
                                    storageUsed += +file.file.size

                                    const res =
                                        await serviceUpload.getPresignedUrl(
                                            FolderType.MEETING,
                                            meetingCode,
                                            [file.file as File],
                                            MeetingFileType.PROPOSAL_FILES,
                                        )
                                    await serviceUpload.uploadFile(
                                        file.file as File,
                                        res.uploadUrls[0],
                                    )

                                    return {
                                        id: file.id,
                                        url: res.uploadUrls[0]
                                            .split('?')[0]
                                            .split('.amazonaws.com/')[1],
                                        uid: file.uid,
                                    }
                                }),
                            )),
                    }
                    elections.push(electionItem)
                })

                const payloadCreateBoardMeeting: ICreateBoardMeetingPayload = {
                    ...validate.payload,
                    meetingCode: meetingCode,
                    meetingInvitations: await Promise.all(
                        validate.payload.meetingInvitations.map(
                            async (meetingInvitation) => {
                                // @ts-ignore
                                storageUsed += +meetingInvitation.file.size

                                const res = await serviceUpload.getPresignedUrl(
                                    FolderType.MEETING,
                                    meetingCode,
                                    [meetingInvitation.file as File],
                                    meetingInvitation.fileType,
                                )
                                await serviceUpload.uploadFile(
                                    meetingInvitation.file as File,
                                    res.uploadUrls[0],
                                )

                                return {
                                    url: res.uploadUrls[0]
                                        .split('?')[0]
                                        .split('.amazonaws.com/')[1],
                                    fileType: meetingInvitation.fileType,
                                    uid: (meetingInvitation.file as RcFile).uid,
                                }
                            },
                        ),
                    ),
                    meetingMinutes: await Promise.all(
                        validate.payload.meetingMinutes.map(
                            async (meetingMinute) => {
                                // @ts-ignore
                                storageUsed += +meetingMinute.file.size

                                const res = await serviceUpload.getPresignedUrl(
                                    FolderType.MEETING,
                                    meetingCode,
                                    [meetingMinute.file as File],
                                    meetingMinute.fileType,
                                )
                                await serviceUpload.uploadFile(
                                    meetingMinute.file as File,
                                    res.uploadUrls[0],
                                )

                                return {
                                    url: res.uploadUrls[0]
                                        .split('?')[0]
                                        .split('.amazonaws.com/')[1],
                                    fileType: meetingMinute.fileType,
                                    uid: (meetingMinute.file as RcFile).uid,
                                }
                            },
                        ),
                    ),
                    managementAndFinancials: managementAndFinancials,
                    elections: elections,
                }

                const res = await serviceBoardMeeting.createBoardMeeting(
                    payloadCreateBoardMeeting,
                )

                // console.log(
                //     'storageUsed(GB): ',
                //     +(storageUsed / (1024 * 1024)).toFixed(3),
                // )

                notification.success({
                    message: t('CREATED'),
                    description: t('CREATE_BOARD_MEETING_SUCCESSFULLY'),
                    duration: 2,
                })

                const response = companyServicePlan.updateStorageUsed(
                    +(storageUsed / (1024 * 1024 * 1024)).toFixed(9),
                )

                resetData()
                setStatus(FETCH_STATUS.SUCCESS)
                router.push('/board-meeting')
            })()
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Something went wrong!',
                duration: 2,
            })
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    return (
        <Spin spinning={status === FETCH_STATUS.LOADING} delay={0}>
            <Button
                className="bg-primary text-white transition-opacity disabled:opacity-60"
                size="large"
                onClick={onSave}
                disabled={!validate.isValid || status === FETCH_STATUS.LOADING}
            >
                {t('SAVE')}
            </Button>
        </Spin>
    )
}
export default SaveCreateBoardMeetingButton
