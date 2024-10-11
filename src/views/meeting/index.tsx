import withAuth from '@/components/component-auth'
import ListTitle from '@/components/content-page-title/list-title'
import { CONSTANT_EMPTY_STRING } from '@/constants/common'
import { MeetingTime, MeetingType, SORT, SortField } from '@/constants/meeting'
import { Permissions } from '@/constants/permission'
import { useNotification } from '@/hooks/use-notification'
import { useAttendance } from '@/stores/attendance/hooks'
import { useAuthLogin } from '@/stores/auth/hooks'
import { useListMeeting } from '@/stores/meeting/hooks'
import { EActionStatus } from '@/stores/type'
import { checkPermission } from '@/utils/auth'
import ListMeetingFuture from '@/views/meeting/meeting-list/list-future-meeting'
import ListMeetingPast from '@/views/meeting/meeting-list/list-past-meeting'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Grid, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
const { useBreakpoint } = Grid

const MeetingList = () => {
    const router = useRouter()
    const t = useTranslations()
    const screens = useBreakpoint()
    const { attendanceState, resetStateAttendance } = useAttendance()
    const { openNotification, contextHolder } = useNotification()
    const { authState } = useAuthLogin()

    const permissionCreateMeeting = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.CREATE_MEETING,
    )

    const {
        meetingState,
        getListFutureMeetingAction,
        getListPassMeetingAction,
        setFilterAction,
    } = useListMeeting()

    useEffect(() => {
        return () => {
            setFilterAction({
                searchQuery: CONSTANT_EMPTY_STRING,
                sortOrder: SORT.DESC,
                sortField: SortField.START_TIME,
            })
        }
    }, [setFilterAction])

    useEffect(() => {
        getListFutureMeetingAction({
            page: meetingState.page,
            limit: meetingState.limit,
            type: MeetingTime.MEETING_FUTURE,
            meetingType: MeetingType.SHAREHOLDER_MEETING,
            filter: { ...meetingState.filter },
        })

        getListPassMeetingAction({
            page: meetingState.page,
            limit: meetingState.limit,
            type: MeetingTime.MEETING_PASS,
            meetingType: MeetingType.SHAREHOLDER_MEETING,
            filter: { ...meetingState.filter },
        })
        // eslint-disable-next-line
    }, [meetingState.filter])

    const handleInputChange = (value: string) => {
        setFilterAction({ ...meetingState.filter, searchQuery: value })
    }

    const handleSelectChange = (value: string) => {
        setFilterAction({ ...meetingState.filter, sortOrder: value })
    }

    useEffect(() => {
        if (attendanceState.status == EActionStatus.Succeeded) {
            openNotification({
                message: 'Meeting',
                placement: 'bottomRight',
                type: 'info',
            })
            resetStateAttendance()
            router.push('/meeting/detail/' + attendanceState.meetingIdJoin)
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
        if (meetingState.status == EActionStatus.Failed) {
            openNotification({
                message: meetingState.errorMessage,
                placement: 'bottomRight',
                type: 'error',
            })
        }
        // eslint-disable-next-line
    }, [meetingState.status])

    console.log('meetingState:', meetingState)

    return (
        <div>
            {contextHolder}
            <ListTitle
                pageName={t('LIST_SHAREHOLDER_MEETINGS')}
                addButton={
                    permissionCreateMeeting && (
                        <Tooltip
                            placement="bottomRight"
                            title={
                                meetingState.allowCreate
                                    ? ''
                                    : t('UNABLE_TO_CREATE_MORE')
                            }
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size={screens.lg ? 'large' : 'middle'}
                                className="max-[470px]:px-2"
                                onClick={() => {
                                    router.push('/meeting/create')
                                }}
                                disabled={!meetingState.allowCreate}
                            >
                                {t('ADD_NEW')}
                            </Button>
                        </Tooltip>
                    )
                }
                defaultSort={meetingState.filter?.sortOrder}
                onChangeInput={handleInputChange}
                onChangeSelect={handleSelectChange}
            />
            <div className="p-6 max-sm:px-0">
                <ListMeetingFuture data={meetingState.meetingFutureList} />
                <ListMeetingPast data={meetingState.meetingPassList} />
            </div>
        </div>
    )
}

export default withAuth(MeetingList, Permissions.SHAREHOLDERS_MTG)
