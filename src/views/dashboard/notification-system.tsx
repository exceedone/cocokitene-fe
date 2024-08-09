import Table, { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import EmptyData from '../service-plan/service-plan-list/empty-plan'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'
import serviceDashBoard from '@/services/dash-board'
import {
    ISysNotificationListResponse,
    ISystemNotificationResponse,
} from '@/services/response.type'
import { Button } from 'antd'
import { formatDate } from '@/utils/date'
import { ScreenDashBoard } from '@/constants/dash-board'
import { truncateString } from '@/utils/format-string'

interface DataNotificationSys {
    key: React.Key
    id: number
    title: string
    date: string
}

interface INotificationSystem {
    // eslint-disable-next-line
    changeScreen: (screen: ScreenDashBoard) => void
    // eslint-disable-next-line
    getSysNotification: (value: ISystemNotificationResponse) => void
}

const NotificationSystem = ({
    changeScreen,
    getSysNotification,
}: INotificationSystem) => {
    const [dataSysNotification, setDataSysNotification] =
        useState<ISysNotificationListResponse>()
    const [loadingFetchData, setLoadingFetchData] = useState<boolean>(false)
    const t = useTranslations()

    useEffect(() => {
        const fetchData = async () => {
            setLoadingFetchData(true)
            const response = await serviceDashBoard.getSystemNotification({
                page: 1,
                limit: 4,
            })

            if (response) {
                setDataSysNotification(response)
                setLoadingFetchData(false)
            }
        }
        fetchData()
    }, [])

    const handlePageChange = async (pagination: TablePaginationConfig) => {
        setLoadingFetchData(true)
        const response = await serviceDashBoard.getSystemNotification({
            page: pagination.current ?? 1,
            limit: pagination.pageSize ?? 4,
        })
        if (response) {
            setDataSysNotification(response)
            setLoadingFetchData(false)
        }
    }

    let locale = {
        emptyText: <EmptyData />,
    }

    const columns: ColumnsType<DataNotificationSys> = [
        {
            title: t('NO'),
            dataIndex: 'key',
            width: '5%',
            className: 'text-center',
        },
        {
            title: t('DURATION'),
            dataIndex: 'date',
            render: (_, record) => {
                return (
                    <div className="flex w-full items-center gap-2">
                        {record.date}
                    </div>
                )
            },
            width: '20%',
        },
        {
            title: t('TITLE_SYSTEM_NOTI'),
            dataIndex: 'title',
            render: (_, record) => {
                return (
                    <div className="w-[95%] truncate">
                        {truncateString({
                            text: record.title,
                            start: 78,
                            end: 0,
                        })}
                    </div>
                )
            },
            width: '60%',
        },
        {
            render: (_, record) => {
                return (
                    <div className="">
                        <Button
                            size="small"
                            onClick={() => {
                                const sysNotification =
                                    dataSysNotification?.items.find(
                                        (notification) =>
                                            notification.system_notification_id ==
                                            record.id,
                                    )
                                if (sysNotification) {
                                    changeScreen(
                                        ScreenDashBoard.DETAIL_SYSTEM_NOTIFICATION,
                                    )
                                    getSysNotification(sysNotification)
                                }
                            }}
                        >
                            {t('BTN_VIEW_DETAIL')}
                        </Button>
                    </div>
                )
            },
            width: '15%',
        },
    ]

    const dataSource = useMemo(() => {
        return dataSysNotification?.items.map((sysNotification, index) => {
            return {
                key:
                    (dataSysNotification.meta.currentPage - 1) *
                        dataSysNotification.meta.itemsPerPage +
                    index +
                    1,
                id: sysNotification.system_notification_id,
                date: formatDate(
                    sysNotification.system_notification_created_at,
                    'YYYY-MM-DD HH:mm',
                ),
                title: sysNotification.system_notification_title,
            }
        })
    }, [dataSysNotification])

    return (
        <div className="flex flex-col gap-3 p-2">
            <span className="text-xl">{t('SYSTEM_NOTIFICATION')}</span>
            <div className="">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: dataSysNotification?.meta.itemsPerPage,
                        total: dataSysNotification?.meta.totalItems,
                    }}
                    size="middle"
                    locale={locale}
                    loading={loadingFetchData}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default NotificationSystem
