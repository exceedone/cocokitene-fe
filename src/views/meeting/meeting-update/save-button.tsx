/*eslint-disable*/
import { FETCH_STATUS, urlRegex } from '@/constants/common'
import serviceMeeting from '@/services/meeting'
import { IUpdateMeetingPayload } from '@/services/request.type'
import { useUpdateMeetingInformation } from '@/stores/meeting/hooks'
import { IUpdateMeeting } from '@/stores/meeting/types'
import { Button, Spin, notification } from 'antd'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SaveUpdateMeetingButton = () => {
    const t = useTranslations()
    const [data] = useUpdateMeetingInformation()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE)
    const router = useRouter()

    const onValidate = (data: IUpdateMeeting) => {
        const payload = {
            ...data,
            meetingInvitations: data.meetingInvitations.map((file) => ({
                ...file,
                url: file.url.split('.amazonaws.com/')[1],
            })),
            meetingMinutes: data.meetingMinutes.map((file) => ({
                ...file,
                url: file.url.split('.amazonaws.com/')[1],
            })),
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
                files: resolution.files?.map((file) => ({
                    ...file,
                    url: file.url.split('.amazonaws.com/')[1],
                })),
            })),
            amendmentResolutions: data.amendmentResolutions.map(
                (amendment) => ({
                    ...amendment,
                    title: amendment.title.trim(),
                    description: amendment.description.trim(),
                    oldDescription: amendment.oldDescription?.trim(),
                    files: amendment.files?.map((file) => ({
                        ...file,
                        url: file.url.split('.amazonaws.com/')[1],
                    })),
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
            payload: IUpdateMeetingPayload
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

        // Check
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
            // console.log('validate.payload: ', validate.payload)
            await serviceMeeting.updateMeeting(data.id, validate.payload)
            notification.success({
                message: t('UPDATED'),
                description: t('UPDATED_MEETING_SUCCESSFULLY'),
                duration: 2,
            })
            setStatus(FETCH_STATUS.SUCCESS)
            router.push(`/meeting/detail/${data.id}`)
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

export default SaveUpdateMeetingButton
