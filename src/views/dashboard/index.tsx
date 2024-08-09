import withAuth from '@/components/component-auth'
import { Permissions } from '@/constants/permission'
import { useTranslations } from 'next-intl'

import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useAuthLogin } from '@/stores/auth/hooks'
import NotificationSystem from './notification-system'
import NotificationPersonal from './notification-personal'
import CalendarCustom from './calendar'
import serviceProfile from '@/services/profile'
import { RoleName } from '@/constants/role'
import Loader from '@/components/loader'
import { ScreenDashBoard } from '@/constants/dash-board'
import LayoutTitle from '@/components/content-page-title/layout-title'
import { Typography } from 'antd'
import DetailSystemNotification from './detail-system-notification'
import { ISystemNotificationResponse } from '@/services/response.type'

const { Title } = Typography

let screenCurrent: ScreenDashBoard = ScreenDashBoard.DASH_BOARD
let sysNotificationCurrent: ISystemNotificationResponse

const DashboardView = () => {
    const t = useTranslations()
    const { authState } = useAuthLogin()
    const [date, setDate] = useState<Date>(new Date())
    const [loading, setLoading] = useState<boolean>(true)
    const [isSupperAdmin, setIsSupperAdmin] = useState<boolean>(false)

    const [screen, setScreen] = useState<ScreenDashBoard>(screenCurrent)
    const [sysNotification, setSysNotification] =
        useState<ISystemNotificationResponse>(sysNotificationCurrent)

    useEffect(() => {
        const fetchProfile = async (id: number) => {
            setLoading(true)
            const detailProfile = await serviceProfile.getDetailProfile(id)
            if (detailProfile) {
                console.log('Role User: ', detailProfile.roles)
                console.log(
                    'isSupperAdmin---------------- ',
                    detailProfile.roles.some(
                        (role) => role.roleName == RoleName.SUPER_ADMIN,
                    ),
                )
                setIsSupperAdmin(
                    detailProfile.roles.some(
                        (role) => role.roleName == RoleName.SUPER_ADMIN,
                    ),
                )
                setLoading(false)
            }
        }
        if (authState.userData?.id) {
            fetchProfile(authState.userData.id)
        }
    }, [authState.userData?.id])

    const onSelect = (newValue: Dayjs) => {
        setDate(newValue.toDate())
    }

    const bodyNotifiCationPersonal = useMemo(() => {
        return (
            <NotificationPersonal date={date} isSupperAdmin={isSupperAdmin} />
        )
    }, [date, isSupperAdmin])

    const changeScreen = (screen: ScreenDashBoard) => {
        setScreen(screen)
        screenCurrent = screen
    }

    const getSysNotification = (value: ISystemNotificationResponse) => {
        setSysNotification(value)
        sysNotificationCurrent = value
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <LayoutTitle>
                <div className="flex items-center gap-2">
                    <Title level={4} className="mb-0 font-medium">
                        {t('DASHBOARD')}
                    </Title>
                </div>
                <div className="flex items-center gap-2"></div>
            </LayoutTitle>
            <div className="p-6">
                <div className=" bg-white p-6 px-6 py-4 shadow-01">
                    {screen === ScreenDashBoard.DASH_BOARD && (
                        <div className="flex flex-col gap-10">
                            <div className="flex gap-5">
                                <div className="flex-[7_7_0%] border shadow-lg">
                                    <NotificationSystem
                                        changeScreen={changeScreen}
                                        getSysNotification={getSysNotification}
                                    />
                                </div>
                                <div className="min-w-[300px] max-w-[350px] flex-[3_3_0%] border shadow-lg">
                                    <CalendarCustom
                                        isSupperAdmin={isSupperAdmin}
                                        onSelectDate={onSelect}
                                    />
                                </div>
                            </div>
                            <div>{bodyNotifiCationPersonal}</div>
                        </div>
                    )}
                    {screen === ScreenDashBoard.DETAIL_SYSTEM_NOTIFICATION && (
                        <DetailSystemNotification
                            sysNotification={sysNotification}
                            changeScreen={changeScreen}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default withAuth(DashboardView, Permissions.BASIC_PERMISSION)
