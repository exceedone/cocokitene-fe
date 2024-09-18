import withAuthAdmin from '@/components/component-auth-admin'
import NotificationSystem from './notificationSys'
import { useTranslations } from 'next-intl'
import StatisticalCompany from './statistical-company'
import CalendarCustom from '../dashboard/calendar'
import { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { ScreenDashBoard } from '@/constants/dash-board'
import CreateSystemNotificationScreen from './create-system-notification'
import DetailSystemNotification from './detail-system-notification'
import { ISystemNotificationResponse } from '@/services/response.type'
import EditSystemNotificationScreen from './edit-system-notification'
import LayoutTitle from '@/components/content-page-title/layout-title'
import { Typography } from 'antd'

const { Title } = Typography

let screenCurrent: ScreenDashBoard = ScreenDashBoard.DASH_BOARD
let sysNotificationCurrent: ISystemNotificationResponse

const DashBoardSystem = () => {
    const [screen, setScreen] = useState<ScreenDashBoard>(screenCurrent)
    const [sysNotification, setSysNotification] =
        useState<ISystemNotificationResponse>(sysNotificationCurrent)
    const [date, setDate] = useState<{ month: number; year: number }>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    })

    const t = useTranslations()

    const onSelect = (newValue: Dayjs) => {
        setDate({
            month: newValue.month() + 1,
            year: newValue.year(),
        })
    }

    const changeScreen = (screen: ScreenDashBoard) => {
        screenCurrent = screen
        setScreen(screen)
    }

    const getSysNotification = (value: ISystemNotificationResponse) => {
        setSysNotification(value)
        sysNotificationCurrent = value
    }

    const bodySystemAdminStatistical = useMemo(() => {
        return <StatisticalCompany month={date.month} year={date.year} />
    }, [date.month, date.year])

    return (
        <div>
            <LayoutTitle>
                <div className="z-50 flex items-center gap-2">
                    <Title level={3} className="mb-0 font-semibold">
                        {t('DASHBOARD')}
                    </Title>
                </div>
                <div className="flex items-center gap-2"></div>
            </LayoutTitle>
            <div className="sm:p-6">
                <div className="bg-white p-6 px-6 py-4 shadow-lg">
                    {screen === ScreenDashBoard.DASH_BOARD && (
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-wrap gap-5 max-sm:flex-col">
                                <div className="flex-[7_7_0%] border shadow-lg">
                                    <NotificationSystem
                                        changeScreen={changeScreen}
                                        getSysNotification={getSysNotification}
                                    />
                                </div>
                                <div className="mx-auto min-w-[250px] max-w-[378px] flex-[3_3_0%] border shadow-lg">
                                    <CalendarCustom
                                        isSupperAdmin={false}
                                        onSelectDate={onSelect}
                                        isSystemAdmin={true}
                                    />
                                </div>
                            </div>
                            <div className="border shadow-lg">
                                {/* <StatisticalCompany /> */}
                                {bodySystemAdminStatistical}
                            </div>
                        </div>
                    )}
                    {screen === ScreenDashBoard.CREATE_SYSTEM_NOTIFICATION && (
                        <CreateSystemNotificationScreen
                            changeScreen={changeScreen}
                        />
                    )}
                    {screen === ScreenDashBoard.DETAIL_SYSTEM_NOTIFICATION && (
                        <DetailSystemNotification
                            sysNotification={sysNotification}
                            changeScreen={changeScreen}
                        />
                    )}
                    {screen === ScreenDashBoard.UPDATE_SYSTEM_NOTIFICATION && (
                        <EditSystemNotificationScreen
                            sysNotification={sysNotification}
                            changeScreen={changeScreen}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default withAuthAdmin(DashBoardSystem)
