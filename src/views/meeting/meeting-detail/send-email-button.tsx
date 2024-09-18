import { MailOutlined } from '@ant-design/icons'
import { Button, Grid, notification } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FETCH_STATUS } from '@/constants/common'
import serviceMeeting from '@/services/meeting'
import { useParams } from 'next/navigation'
import { AxiosError } from 'axios'
const { useBreakpoint } = Grid

const SendEmailButton = () => {
    const t = useTranslations()
    const screens = useBreakpoint()
    const params = useParams()
    const meetingId: number = Number(params.id)

    const [status, setStatus] = useState(FETCH_STATUS.IDLE)

    const handleClick = async () => {
        setStatus(FETCH_STATUS.LOADING)
        try {
            const response =
                await serviceMeeting.sendMailInvitationShareholderMeeting(
                    meetingId,
                )
            if (response) {
                notification.success({
                    message: t('CREATED'),
                    description: t(
                        'SEND_EMAIL_TO_SHAREHOLDER_MEETING_SUCCESSFULLY',
                    ),
                    duration: 2,
                })
                setStatus(FETCH_STATUS.SUCCESS)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t('SEND_EMAIL_TO_SHAREHOLDER_MEETING_FAILED'),
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
            size={screens.lg ? 'large' : 'middle'}
            className="max-[470px]:px-2"
            loading={status === FETCH_STATUS.LOADING}
            onClick={() => {
                handleClick()
            }}
        >
            <span className="max-sm:hidden">
                {t('SEND_EMAIL_TO_SHAREHOLDERS')}
            </span>
            <span className="sm:hidden">{t('SEND_MAIL')}</span>
        </Button>
    )
}

export default SendEmailButton
