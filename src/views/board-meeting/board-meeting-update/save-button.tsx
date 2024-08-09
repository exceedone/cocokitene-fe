/*eslint-disable*/

import { FETCH_STATUS, urlRegex } from '@/constants/common'
import serviceBoardMeeting from '@/services/board-meeting'
import { IUpdateBoardMeetingPayload } from '@/services/request.type'
import { useUpdateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import { IUpdateBoardMeeting } from '@/stores/board-meeting/types'
import { Button, Spin, notification } from 'antd'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SaveUpdateBoardMeetingButton = () => {
    const t = useTranslations()
    const router = useRouter()
    const [data] = useUpdateBoardMeetingInformation()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE)

    const onValidate = (data: IUpdateBoardMeeting) => {
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
            // managementAndFinancials: data.managementAndFinancials.filter(
            //     (report) => report.title.trim() || report.description.trim(),
            // ),
            managementAndFinancials: data.managementAndFinancials.map(
                (management) => ({
                    ...management,
                    title: management.title.trim(),
                    description: management.description.trim(),
                    oldDescription: management.oldDescription?.trim(),
                }),
            ),
            // elections: data.elections.filter(
            //     (report) => report.title.trim() || report.description.trim(),
            // ),
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
        }

        const rs: {
            isValid: boolean
            errors: { [key: string]: string }
            payload: IUpdateBoardMeetingPayload
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
                await serviceBoardMeeting.updateBoardMeeting(
                    data.id,
                    validate.payload,
                )
                notification.success({
                    message: t('UPDATED'),
                    description: t('UPDATE_BOARD_MEETING_SUCCESSFULLY'),
                    duration: 2,
                })
                setStatus(FETCH_STATUS.SUCCESS)
                router.push(`/board-meeting/detail/${data.id}`)
            })()
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Something went wrong to update Board Meeting!!!',
                duration: 3,
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

export default SaveUpdateBoardMeetingButton
