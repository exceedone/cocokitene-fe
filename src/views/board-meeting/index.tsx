/* eslint-disable */
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAttendance } from '@/stores/attendance/hooks'
import { useNotification } from '@/hooks/use-notification'
import { useAuthLogin } from '@/stores/auth/hooks'
import { checkPermission } from '@/utils/auth'
import { Permissions } from '@/constants/permission'
import { useListMeeting } from '@/stores/meeting/hooks'
import { useEffect } from 'react'
import { MeetingTime, MeetingType } from '@/constants/meeting'
import { EActionStatus } from '@/stores/type'
import ListTitle from '@/components/content-page-title/list-title'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ListBoardMeetingFuture from '@/views/board-meeting/board-meeting-list/list-board-meeting-future'
import ListBoardMeetingPast from './board-meeting-list/list-board-meeting-pass'
import withAuth from '@/components/component-auth'
import { useListBoardMeeting } from '@/stores/board-meeting/hook'

const BoardMeetingList = () => {
    const router = useRouter()
    const t = useTranslations()
    const { attendanceState, resetStateAttendance } = useAttendance()
    const { openNotification, contextHolder } = useNotification()
    const { authState } = useAuthLogin()

    const permissionCreateBoardMeeting = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.CREATE_BOARD_MEETING,
    )
    const {
        boardMeetingState,
        getListFutureBoardMeetingAction,
        getListPassBoardMeetingAction,
        setFilterAction,
    } = useListBoardMeeting()
    useEffect(() => {
        getListFutureBoardMeetingAction({
            page: boardMeetingState.page,
            limit: boardMeetingState.limit,
            type: MeetingTime.MEETING_FUTURE,
            meetingType: MeetingType.BOARD_MEETING,
            filter: { ...boardMeetingState.filter },
        })

        getListPassBoardMeetingAction({
            page: boardMeetingState.page,
            limit: boardMeetingState.limit,
            type: MeetingTime.MEETING_PASS,
            meetingType: MeetingType.BOARD_MEETING,
            filter: { ...boardMeetingState.filter },
        })
    }, [boardMeetingState.filter])

    const handleInputChange = (value: string) => {
        setFilterAction({ ...boardMeetingState.filter, searchQuery: value })
    }

    const handleSelectChange = (value: string) => {
        setFilterAction({ ...boardMeetingState.filter, sortOrder: value })
    }

    useEffect(() => {
        if (attendanceState.status == EActionStatus.Succeeded) {
            openNotification({
                message: 'Meeting',
                placement: 'bottomRight',
                type: 'info',
            })
            resetStateAttendance()
            router.push(
                '/board-meeting/detail/' + attendanceState.meetingIdJoin,
            )
        }

        if (attendanceState.status == EActionStatus.Failed) {
            openNotification({
                message: t(attendanceState.errorMessage),
                placement: 'bottomRight',
                type: 'error',
            })
            resetStateAttendance()
        }
        // eslint-disable-next-line
    }, [attendanceState.status])

    useEffect(() => {
        if (boardMeetingState.status == EActionStatus.Failed) {
            openNotification({
                message: boardMeetingState.errorMessage,
                placement: 'bottomRight',
                type: 'error',
            })
        }
        // eslint-disable-next-line
    }, [boardMeetingState.status])

    useEffect(() => {
        if (boardMeetingState.status === EActionStatus.Failed) {
            openNotification({
                message: boardMeetingState.errorMessage,
                placement: 'bottomRight',
                type: 'error',
            })
        }
        // eslint-disable-next-line
    }, [boardMeetingState.status])

    return (
        <div>
            {contextHolder}
            <ListTitle
                pageName={t('LIST_BOARD_MEETINGS')}
                addButton={
                    permissionCreateBoardMeeting && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => {
                                router.push('/board-meeting/create')
                            }}
                        >
                            {t('ADD_NEW')}
                        </Button>
                    )
                }
                defaultSort={boardMeetingState.filter?.sortOrder}
                onChangeInput={handleInputChange}
                onChangeSelect={handleSelectChange}
            />
            <div className="p-6">
                <ListBoardMeetingFuture
                    data={boardMeetingState.meetingFutureList}
                />
                <ListBoardMeetingPast
                    data={boardMeetingState.meetingPassList}
                />
            </div>
        </div>
    )
}
export default withAuth(BoardMeetingList, Permissions.BOARD_MEETING)
