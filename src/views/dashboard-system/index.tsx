import withAuthAdmin from '@/components/component-auth-admin'
import NotificationSystem from './notificationSys'
import { useTranslations } from 'next-intl'
import StatisticalCompany from './statistical-company'
import CalendarCustom from '../dashboard/calendar'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
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

    const t = useTranslations()

    const onSelect = (newValue: Dayjs) => {
        console.log(newValue.toDate())
    }

    const changeScreen = (screen: ScreenDashBoard) => {
        console.log('screen: ', screen)
        screenCurrent = screen
        setScreen(screen)
    }

    const getSysNotification = (value: ISystemNotificationResponse) => {
        setSysNotification(value)
        sysNotificationCurrent = value
    }

    console.log('sysNotification-----36: ', sysNotification)

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
                <div className="bg-white p-6 px-6 py-4 shadow-lg">
                    {screen === ScreenDashBoard.DASH_BOARD && (
                        <div className="flex flex-col gap-10">
                            <div className="flex gap-5">
                                <div className="flex-[7_7_0%] border shadow-lg">
                                    <NotificationSystem
                                        changeScreen={changeScreen}
                                        getSysNotification={getSysNotification}
                                    />
                                </div>
                                <div className="h-[350px] min-w-[300px] max-w-[350px] flex-[3_3_0%] border shadow-lg">
                                    <CalendarCustom
                                        isSupperAdmin={false}
                                        onSelectDate={onSelect}
                                    />
                                </div>
                            </div>
                            <div>
                                <StatisticalCompany />
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
