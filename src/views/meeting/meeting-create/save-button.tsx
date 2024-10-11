/*eslint-disable*/
import { FETCH_STATUS, urlRegex } from '@/constants/common'
import { MeetingFileType } from '@/constants/meeting'
import companyServicePlan from '@/services/company-service-plan'
import serviceMeeting from '@/services/meeting'
import {
    ICreateMeetingPayload,
    ISaveCreateMeetingPayload,
} from '@/services/request.type'
import serviceUpload from '@/services/upload'
import { useCreateMeetingInformation } from '@/stores/meeting/hooks'
import { ICreateMeeting, IMeetingResolution } from '@/stores/meeting/types'
import { Button, Spin, notification } from 'antd'
import { RcFile } from 'antd/es/upload'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SaveCreateMeetingButton = () => {
    const t = useTranslations()
    const [data, , resetData] = useCreateMeetingInformation()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE)
    const router = useRouter()

    const onValidate = (data: ICreateMeeting) => {
        const payload = {
            ...data,
            title: data.title.trim(),
            meetingLink:
                data.meetingLink && !data.meetingLink.startsWith('https://')
                    ? `https://${data.meetingLink}`
                    : data.meetingLink,
            participants: data.participants.map((p) => ({
                roleMtgId: p.roleMtgId,
                roleName: p.roleName,
                userIds: p.userParticipant.map((user) => user.users_id),
            })),
            resolutions: data.resolutions.map((resolution) => ({
                ...resolution,
                title: resolution.title.trim(),
                description: resolution.description.trim(),
            })),
            amendmentResolutions: data.amendmentResolutions.map(
                (amendment) => ({
                    ...amendment,
                    title: amendment.title.trim(),
                    description: amendment.description.trim(),
                    oldDescription: amendment.oldDescription?.trim(),
                }),
            ),
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
        }

        const rs: {
            isValid: boolean
            errors: { [key: string]: string }
            payload: ISaveCreateMeetingPayload
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
            payload.resolutions.some((resolution) => !resolution.title.trim())
        ) {
            rs.isValid = false
            rs.errors.resolutions = 'resolutions'
        }

        if (
            payload.amendmentResolutions.some(
                (amendment) => !amendment.title.trim(),
            )
        ) {
            rs.isValid = false
            rs.errors.amendmentResolutions = 'amendmentResolutions'
        }

        if (
            payload.personnelVoting.some(
                (personnel) =>
                    !personnel.title.trim() || !personnel.candidate.length,
            )
        ) {
            rs.isValid = false
            rs.errors.personnelVoting = 'personnelVoting'
        }

        return rs
    }

    const validate = onValidate(data)

    const onSave = async () => {
        if (!validate.isValid) {
            return
        }
        try {
            // ;(async () => {
            setStatus(FETCH_STATUS.LOADING)
            console.log('payload: ', validate.payload)

            let storageUsed: number = 0

            const resolutions: IMeetingResolution[] = []
            const amendmentResolutions: IMeetingResolution[] = []

            validate.payload.resolutions.forEach(async (resolution) => {
                const resolutionItem: IMeetingResolution = {
                    ...resolution,
                    files:
                        resolution.files &&
                        (await Promise.all(
                            resolution.files.map(async (file) => {
                                // @ts-ignore
                                storageUsed += +file.file.size

                                const res = await serviceUpload.getPresignedUrl(
                                    [file.file as File],
                                    MeetingFileType.PROPOSAL_FILES,
                                )

                                await serviceUpload.uploadFile(
                                    file.file as File,
                                    res.uploadUrls[0],
                                )

                                return {
                                    id: file.id,
                                    url: res.uploadUrls[0].split('?')[0],
                                    uid: file.uid,
                                }
                            }),
                        )),
                }
                resolutions.push(resolutionItem)
            })

            validate.payload.amendmentResolutions.forEach(
                async (amendmentResolution) => {
                    const amendmentResolutionItem: IMeetingResolution = {
                        ...amendmentResolution,
                        files:
                            amendmentResolution.files &&
                            (await Promise.all(
                                amendmentResolution.files.map(async (file) => {
                                    // @ts-ignore
                                    storageUsed += +file.file.size

                                    const res =
                                        await serviceUpload.getPresignedUrl(
                                            [file.file as File],
                                            MeetingFileType.PROPOSAL_FILES,
                                        )
                                    await serviceUpload.uploadFile(
                                        file.file as File,
                                        res.uploadUrls[0],
                                    )

                                    return {
                                        id: file.id,
                                        url: res.uploadUrls[0].split('?')[0],
                                        uid: file.uid,
                                    }
                                }),
                            )),
                    }
                    amendmentResolutions.push(amendmentResolutionItem)
                },
            )

            const payloadCreateMeeting: ICreateMeetingPayload = {
                ...validate.payload,
                meetingInvitations: await Promise.all(
                    validate.payload.meetingInvitations.map(
                        async (meetingInvitation) => {
                            // @ts-ignore
                            storageUsed += +meetingInvitation.file.size

                            const res = await serviceUpload.getPresignedUrl(
                                [meetingInvitation.file as File],
                                meetingInvitation.fileType,
                            )

                            const response = await serviceUpload.uploadFile(
                                meetingInvitation.file as File,
                                res.uploadUrls[0],
                            )

                            return {
                                url: res.uploadUrls[0].split('?')[0],
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
                                [meetingMinute.file as File],
                                meetingMinute.fileType,
                            )
                            await serviceUpload.uploadFile(
                                meetingMinute.file as File,
                                res.uploadUrls[0],
                            )

                            return {
                                url: res.uploadUrls[0].split('?')[0],
                                fileType: meetingMinute.fileType,
                                uid: (meetingMinute.file as RcFile).uid,
                            }
                        },
                    ),
                ),
                resolutions: resolutions,
                amendmentResolutions: amendmentResolutions,
            }

            // console.log(
            //     'storageUsed(GB): ',
            //     +(storageUsed / (1024 * 1024 * 1024)).toFixed(9),
            // )

            console.log('payloadCreateMeeting: ', payloadCreateMeeting)

            const res = await serviceMeeting.createMeeting(payloadCreateMeeting)
            notification.success({
                message: t('CREATED'),
                description: t('CREATED_MEETING_SUCCESSFULLY'),
                duration: 2,
            })
            const response = companyServicePlan.updateStorageUsed(
                +(storageUsed / (1024 * 1024 * 1024)).toFixed(9),
            )

            resetData()

            setStatus(FETCH_STATUS.SUCCESS)
            router.push('/meeting')
            // })()
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t(error.response?.data.info.message),
                    duration: 3,
                })
            }
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    return (
        <Spin spinning={status === FETCH_STATUS.LOADING} delay={0}>
            <Button
                type="default"
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

export default SaveCreateMeetingButton
