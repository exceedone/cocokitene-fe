import LayoutTitle, {
    IBaseTitle,
} from '@/components/content-page-title/layout-title'
import ViewHtml from '@/components/view-html'
import { ScreenDashBoard } from '@/constants/dash-board'
import { ISystemNotificationResponse } from '@/services/response.type'
import { formatDate } from '@/utils/date'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

const { Title } = Typography

interface IDetailTitle extends IBaseTitle {
    editButton?: ReactNode
    extraButton?: ReactNode
    // eslint-disable-next-line
    changeScreen: (screen: ScreenDashBoard) => void
}

const DetailTitle = ({
    pageName,
    editButton,
    extraButton,
    changeScreen,
}: IDetailTitle) => {
    return (
        <LayoutTitle>
            <div className="flex items-center gap-2">
                <ArrowLeftOutlined
                    onClick={() => {
                        changeScreen(ScreenDashBoard.DASH_BOARD)
                    }}
                />
                <Title level={4} className="mb-0 font-medium">
                    {pageName}
                </Title>
            </div>
            <div className="flex items-center gap-2">
                {editButton}
                {extraButton}
            </div>
        </LayoutTitle>
    )
}

interface IDetailSystemNotification {
    sysNotification: ISystemNotificationResponse | undefined
    // eslint-disable-next-line
    changeScreen: (screen: ScreenDashBoard) => void
}

const DetailSystemNotification = ({
    sysNotification,
    changeScreen,
}: IDetailSystemNotification) => {
    const t = useTranslations()

    console.log('sysNotification---Detail sys-notification: ', sysNotification)

    return (
        <div>
            <DetailTitle
                pageName={t('DETAIL_SYSTEM_NOTIFICATION')}
                changeScreen={changeScreen}
                editButton={
                    <Button
                        icon={<EditOutlined />}
                        type="default"
                        // size="default"
                        onClick={() => {
                            changeScreen(
                                ScreenDashBoard.UPDATE_SYSTEM_NOTIFICATION,
                            )
                        }}
                    >
                        {t('EDIT')}
                    </Button>
                }
            />
            <div className="px-6">
                <div className="flex flex-col gap-3 bg-white p-6 px-6 py-4">
                    <div>
                        <div className="mx-auto flex max-w-[80%] flex-col p-2">
                            <span className="mx-auto max-w-full break-words text-3xl font-semibold">
                                {sysNotification?.system_notification_title}
                            </span>
                            <span className="ml-auto pt-[8px] font-normal">
                                <div>
                                    {t('CREATE_AT')}:{' '}
                                    {formatDate(
                                        sysNotification?.system_notification_created_at ??
                                            '',
                                        'YYYY-MM-DD HH:mm',
                                    )}
                                </div>
                                <span className="ml-auto font-normal">
                                    {t('CREATED_BY')}:{' '}
                                    {sysNotification?.creator_username}
                                </span>
                                {}
                            </span>
                        </div>
                        <div className="border-t"></div>
                    </div>
                    <div className="min-h-[350px]">
                        <ViewHtml
                            value={
                                sysNotification?.system_notification_content ??
                                ''
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailSystemNotification
