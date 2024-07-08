import { MailOutlined } from '@ant-design/icons'
import { Button, notification } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FETCH_STATUS } from '@/constants/common'
import { useParams } from 'next/navigation'
import { AxiosError } from 'axios'
import serviceBoardMeeting from '@/services/board-meeting'

const SendEmailButton = () => {
    const t = useTranslations()
    const params = useParams()
    const meetingId: number = Number(params.id)

    const [status, setStatus] = useState(FETCH_STATUS.IDLE)

    const handleClick = async () => {
        setStatus(FETCH_STATUS.LOADING)
        try {
            const response =
                await serviceBoardMeeting.sendMailInvitationBoardMeeting(
                    meetingId,
                )
            if (response) {
                notification.success({
                    message: t('CREATED'),
                    description: t('SEND_EMAIL_TO_BOARD_SUCCESSFULLY'),
                    duration: 2,
                })
                setStatus(FETCH_STATUS.SUCCESS)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t('SEND_EMAIL_TO_BOARD_FAILED'),
                    duration: 3,
                })
            }
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    return (
        <Button
            icon={<MailOutlined />}
            type="primary"
            size="large"
            loading={status === FETCH_STATUS.LOADING}
            onClick={() => {
                handleClick()
            }}
        >
            {t('SEND_EMAIL_TO_BOARD')}
        </Button>
    )
}

export default SendEmailButton
