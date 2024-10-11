/* eslint-disable */

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { checkPermission } from '@/utils/auth'
import { useAuthLogin } from '@/stores/auth/hooks'
import { Permissions } from '@/constants/permission'
import { useEffect } from 'react'
import { useBoardMeetingDetail } from '@/stores/board-meeting/hook'
import { EActionStatus } from '@/stores/type'
import Loader from '@/components/loader'
import DetailTitle from '@/components/content-page-title/detail-title'
import { Button, Grid, notification } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import BoardMeetingInformation from '@/views/board-meeting/board-meeting-detail/board-meeting-information'
import BoardMeetingDocuments from '@/views/board-meeting/board-meeting-detail/board-meeting-documents'
import ManagementAndFinancialReports from '@/views/board-meeting/board-meeting-detail/management-and-financial-reports'
import Elections from '@/views/board-meeting/board-meeting-detail/elections'
import BoardMeetingParticipants from '@/views/board-meeting/board-meeting-detail/board-meeting-participants'
import BoardMeetingNote from '@/views/board-meeting/board-meeting-detail/board-meeting-note'
import withAuth from '@/components/component-auth'
import SendEmailButton from './send-email-button'
import MeetingChat from '@/components/view-chat'
import { MeetingStatus } from '@/constants/meeting'
import PersonnelVoting from './personnel-voting'
const { useBreakpoint } = Grid

const BoardMeetingDetail = () => {
    const t = useTranslations()
    const screens = useBreakpoint()
    const params = useParams()
    const router = useRouter()
    const boardMeetingId = Number(params.id)
    const { authState } = useAuthLogin()
    const permissionEditBoardMeeting = checkPermission(
        authState?.userData?.permissionKeys,
        Permissions.EDIT_BOARD_MEETING,
    )

    const permissionSendMailBoard = checkPermission(
        authState?.userData?.permissionKeys,
        Permissions.SEND_MAIL_TO_BOARD,
    )

    const [
        { boardMeeting, status },
        fetchBoardMeetingDetail,
        resetStateBoardMtg,
    ] = useBoardMeetingDetail()

    useEffect(() => {
        if (boardMeetingId) {
            fetchBoardMeetingDetail(boardMeetingId)
        }
    }, [boardMeetingId, fetchBoardMeetingDetail])

    useEffect(() => {
        if (status == EActionStatus.Failed) {
            notification.error({
                message: 'Error',
                description: t('MEETING_NOT_FOUND'),
                duration: 3,
            })
            resetStateBoardMtg()
        }
    }, [status])

    if (!boardMeeting || status === EActionStatus.Pending) {
        return <Loader />
    }

    return (
        <div>
            <DetailTitle
                urlBack={'/board-meeting'}
                pageName={boardMeeting.title}
                editButton={
                    <div className="flex items-end gap-2">
                        {permissionEditBoardMeeting &&
                            boardMeeting.status !== MeetingStatus.CANCELED &&
                            boardMeeting.status !== MeetingStatus.HAPPENED && (
                                <Button
                                    icon={<EditOutlined />}
                                    type="default"
                                    size={screens.lg ? 'large' : 'middle'}
                                    className="max-[470px]:px-2"
                                    onClick={() =>
                                        router.push(
                                            `/board-meeting/update/${boardMeetingId}`,
                                        )
                                    }
                                    disabled={authState.serviceIsExpired}
                                >
                                    {t('EDIT')}
                                </Button>
                            )}
                        {permissionSendMailBoard &&
                            !authState.serviceIsExpired &&
                            boardMeeting.status !== MeetingStatus.CANCELED &&
                            boardMeeting.status !== MeetingStatus.HAPPENED && (
                                <SendEmailButton />
                            )}
                    </div>
                }
            />
            <div className="flex flex-col gap-6 p-6 max-sm:px-2">
                <BoardMeetingInformation />
                <BoardMeetingNote />
                <BoardMeetingDocuments />
                <ManagementAndFinancialReports />
                <Elections />
                <PersonnelVoting />
                <BoardMeetingParticipants />
                <MeetingChat meetingInfo={boardMeeting} />
            </div>
        </div>
    )
}
export default withAuth(BoardMeetingDetail, Permissions.DETAIL_BOARD_MEETING)
