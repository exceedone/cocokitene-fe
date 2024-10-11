import { Table, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import serviceCompany from '@/services/system-admin/company'
import {
    IMeta,
    IServiceSubscription,
} from '@/services/system-admin/response.type'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import {
    PaymentMethodName,
    StatusSubscription,
    StatusSubscriptionColor,
    SubscriptionType,
} from '@/constants/service-subscript'
import { formatDate } from '@/utils/date'
import EmptyData from '@/views/service-plan/service-plan-list/empty-plan'
import { FormOutlined } from '@ant-design/icons'

const { Text } = Typography

const ServicePlanSubscription = () => {
    const t = useTranslations()
    const router = useRouter()
    const param = useParams()
    const companyId = +param.id

    const [dataServiceSubscription, setDataServiceSubscription] = useState<{
        items: IServiceSubscription[]
        meta: IMeta
    }>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const response =
                await serviceCompany.getAllSubscriptionServiceOfCompany(
                    companyId,
                    {
                        page: 1,
                        limit: 7,
                    },
                )
            if (response) {
                setDataServiceSubscription(response)
            }
            setIsLoading(false)
        }
        fetchData()
    }, [companyId])

    const columnServiceSubscriptionOfCompany: ColumnsType<IServiceSubscription> =
        [
            {
                title: t('SERVICE_PLAN'),
                dataIndex: 'servicePlan',
                render: (_, record) => {
                    return <Text>{record.planName}</Text>
                },
                width: '25%',
                className: 'min-w-[109px] px-2',
            },
            {
                title: t('TYPE'),
                dataIndex: 'type',
                render: (_, record) => {
                    return (
                        <Text>
                            {t(
                                SubscriptionType[
                                    record.service_subscription_type
                                ],
                            )}
                        </Text>
                    )
                },
                width: '10%',
                className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
            },
            {
                title: t('TOTAL_FEE'),
                dataIndex: 'service_subscription_amount',
                render: (_, record) => {
                    return <Text>{record.service_subscription_total_free}</Text>
                },
                width: '10%',
                className: 'px-2 min-w-[78px]',
            },
            {
                title: t('PAYMENT_METHOD'),
                dataIndex: 'paymentMethod',
                render: (_, record) => {
                    return (
                        <Text>
                            {t(PaymentMethodName[record.payment_method])}
                        </Text>
                    )
                },
                width: '12%',
                className: 'min-w-[85px]',
            },
            {
                title: t('ACTIVATION_DATE'),
                dataIndex: 'activeDate',
                render: (_, record) => {
                    return <Text>{record.activation_date}</Text>
                },
                width: '15%',
                className: 'min-w-[85px]',
            },
            {
                title: t('EXPIRATION_DATE'),
                dataIndex: 'expirationDate',
                render: (_, record) => {
                    return <Text>{record.expiration_date}</Text>
                },
                width: '15%',
                className: 'min-w-[85px]',
            },
            {
                title: t('STATUS'),
                dataIndex: 'status',
                render: (_, record) => {
                    return (
                        <Text
                            style={{
                                color: StatusSubscriptionColor[
                                    record.service_subscription_status
                                ],
                            }}
                        >
                            {t(
                                StatusSubscription[
                                    record.service_subscription_status
                                ],
                            )}
                        </Text>
                    )
                },
                width: '10%',
                className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
            },
            {
                title: '',
                dataIndex: 'action',
                render: (_, record) => {
                    return (
                        <div className="flex gap-3 max-lg:gap-2">
                            <FormOutlined
                                style={{ fontSize: '18px' }}
                                twoToneColor="#5151e5"
                                onClick={() => {
                                    router.push(
                                        `/service-subscription/detail/${record.service_subscription_id}`,
                                    )
                                }}
                            />
                        </div>
                    )
                },
                width: '5%',
                className: 'px-[6px] max-[470px]:px-0 min-w-[40px]',
            },
        ]

    const dataServiceSubscriptionOfCompany = useMemo(() => {
        return dataServiceSubscription?.items.map((serviceSubscription) => {
            return {
                service_subscription_id:
                    serviceSubscription.service_subscription_id,
                planName: serviceSubscription.planName,
                company_id: serviceSubscription.company_id,
                service_subscription_type:
                    serviceSubscription.service_subscription_type,
                service_subscription_total_free:
                    serviceSubscription.service_subscription_total_free,
                service_subscription_status:
                    serviceSubscription.service_subscription_status,
                payment_method: serviceSubscription.payment_method,
                activation_date: formatDate(
                    serviceSubscription.activation_date,
                    'YYYY-MM-DD',
                ),
                expiration_date: formatDate(
                    serviceSubscription.expiration_date,
                    'YYYY-MM-DD',
                ),
            }
        })
    }, [dataServiceSubscription])

    const handlePageChange = async (pagination: TablePaginationConfig) => {
        setIsLoading(true)
        const response =
            await serviceCompany.getAllSubscriptionServiceOfCompany(companyId, {
                page: pagination.current ?? 1,
                limit: pagination.pageSize ?? 7,
            })
        if (response) {
            setDataServiceSubscription(response)
        }
        setIsLoading(false)
    }

    let locale = {
        emptyText: <EmptyData />,
    }

    return (
        <div>
            <div className="flex w-full flex-col gap-3 rounded-lg bg-white px-6 py-4 shadow-01">
                <div className="flex justify-between">
                    <span className="text-lg font-medium">
                        {t('SERVICE_SUBSCRIPTION')}
                    </span>
                </div>
                <div className="">
                    <Table
                        rowKey="id"
                        columns={columnServiceSubscriptionOfCompany}
                        dataSource={dataServiceSubscriptionOfCompany}
                        pagination={{
                            pageSize:
                                dataServiceSubscription?.meta.itemsPerPage,
                            total: dataServiceSubscription?.meta.totalItems,
                        }}
                        size="middle"
                        locale={locale}
                        loading={isLoading}
                        onChange={handlePageChange}
                        scroll={{ x: 845 }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ServicePlanSubscription
