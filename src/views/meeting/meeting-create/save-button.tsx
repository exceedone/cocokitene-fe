/*eslint-disable*/
import { FETCH_STATUS, urlRegex } from '@/constants/common'
import serviceMeeting from '@/services/meeting'
import { ICreateMeetingPayload } from '@/services/request.type'
import { useCreateMeetingInformation } from '@/stores/meeting/hooks'
import { ICreateMeeting } from '@/stores/meeting/types'
import { Button, Spin, notification } from 'antd'
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
            payload: ICreateMeetingPayload
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

    const onSave = () => {
        if (!validate.isValid) {
            return
        }
        try {
            ;(async () => {
                setStatus(FETCH_STATUS.LOADING)
                console.log('payload: ', validate.payload)
                const res = await serviceMeeting.createMeeting(validate.payload)
                notification.success({
                    message: t('CREATED'),
                    description: t('CREATED_MEETING_SUCCESSFULLY'),
                    duration: 2,
                })

                resetData()

                setStatus(FETCH_STATUS.SUCCESS)
                router.push('/meeting')
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