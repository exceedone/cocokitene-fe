import withAuth from '@/components/component-auth'
import DetailTitle from '@/components/content-page-title/detail-title'
import Loader from '@/components/loader'
import { Permissions } from '@/constants/permission'
import { useAuthLogin } from '@/stores/auth/hooks'
import { useMeetingDetail } from '@/stores/meeting/hooks'
import { EActionStatus } from '@/stores/type'
import { checkPermission } from '@/utils/auth'
import AmendmentResolutions from '@/views/meeting/meeting-detail/amendment-resolutions'
import DetailInformation from '@/views/meeting/meeting-detail/detail-information'
import Documents from '@/views/meeting/meeting-detail/documents'
import Participants from '@/views/meeting/meeting-detail/participants'
import Resolutions from '@/views/meeting/meeting-detail/resolutions'
import SendEmailButton from '@/views/meeting/meeting-detail/send-email-button'
import { EditOutlined } from '@ant-design/icons'
import { Button, Grid, notification } from 'antd'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { truncateString } from '@/utils/format-string'
import MeetingChat from '@/components/view-chat'
import { MeetingStatus } from '@/constants/meeting'
import PersonnelVoting from './personnel-voting'
const { useBreakpoint } = Grid

const MeetingDetail = () => {
    const t = useTranslations()
    const screens = useBreakpoint()

    const [{ meeting, status }, fetchMeetingDetail, resetStatusGetMeeting] =
        useMeetingDetail()

    const params = useParams()

    const router = useRouter()

    const meetingId = Number(params.id)

    const { authState } = useAuthLogin()

    const permissionEditMeeting = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.EDIT_MEETING,
    )

    const permissionSendEmailShareholder = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.SEND_MAIL_TO_SHAREHOLDER,
    )

    useEffect(() => {
        if (meetingId) {
            fetchMeetingDetail(meetingId)
        }
    }, [meetingId, fetchMeetingDetail])

    useEffect(() => {
        if (status == EActionStatus.Failed) {
            notification.error({
                message: 'Error',
                description: t('MEETING_NOT_FOUND'),
                duration: 3,
            })
            resetStatusGetMeeting()
        }
        // eslint-disable-next-line
    }, [status])

    if (!meeting || status === EActionStatus.Pending) {
        return <Loader />
    }

    return (
        <div>
            <DetailTitle
                urlBack="/meeting"
                pageName={
                    meeting.title.length > 100
                        ? truncateString({
                              text: meeting.title,
                              start: 70,
                              end: 5,
                          })
                        : meeting.title
                }
                editButton={
                    <div className="flex items-end gap-2">
                        {permissionEditMeeting &&
                            meeting.status !== MeetingStatus.CANCELED &&
                            meeting.status !== MeetingStatus.HAPPENED && (
                                <Button
                                    icon={<EditOutlined />}
                                    type="default"
                                    size={screens.lg ? 'large' : 'middle'}
                                    className="max-[470px]:px-2"
                                    onClick={() =>
                                        router.push(
                                            `/meeting/update/${meetingId}`,
                                        )
                                    }
                                >
                                    {t('EDIT')}
                                </Button>
                            )}
                        {permissionSendEmailShareholder &&
                            meeting.status !== MeetingStatus.CANCELED &&
                            meeting.status !== MeetingStatus.HAPPENED && (
                                <SendEmailButton />
                            )}
                    </div>
                }
                // editUrl={`/meeting/update/${meetingId}`}
                // extraButton={
                //     permissionSendEmailShareholder &&
                //     meeting.status !== MeetingStatus.CANCELED &&
                //     meeting.status !== MeetingStatus.HAPPENED && (
                //         <SendEmailButton />
                //     )
                // }
            />
            <div className="flex flex-col gap-6 p-6 max-sm:px-2">
                <DetailInformation />
                <Documents />
                <Resolutions />
                <AmendmentResolutions />
                <PersonnelVoting />
                <Participants />
                <MeetingChat meetingInfo={meeting} />
            </div>
        </div>
    )
}

export default withAuth(MeetingDetail, Permissions.DETAIL_MEETING)
