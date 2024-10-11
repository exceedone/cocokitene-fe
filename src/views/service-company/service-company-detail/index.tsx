import {
    PaymentMethodName,
    StatusSubscription,
    StatusSubscriptionColor,
    SubscriptionEnum,
    SubscriptionType,
} from '@/constants/service-subscript'
import companyServicePlan from '@/services/company-service-plan'
import {
    IMeta,
    IServicePlanOfCompany,
    IServiceSubscription,
} from '@/services/response.type'
import { useServiceSubscriptionCreate } from '@/stores/service-subscription/hooks'
import { formatDate, formatLocalDate } from '@/utils/date'
import EmptyData from '@/views/service-plan/service-plan-list/empty-plan'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import Table, { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import ModalChooseServicePlan from './modal-choose-service-plan'
import { useRouter } from 'next/navigation'

const { Text } = Typography

const ServiceCompanyDetail = () => {
    const t = useTranslations()
    const router = useRouter()

    const {
        // serviceSubscriptionCreateState,
        setInfoSubscriptionCreate,
        setIdServicePlanSubscription,
    } = useServiceSubscriptionCreate()

    const [dataServicePlanOfCompany, setDataServicePlanOfCompany] =
        useState<IServicePlanOfCompany>()

    const [loadingFetchDataService, setLoadingFetchDataService] =
        useState<boolean>(false)

    const [dataServiceSubOfCompany, setDataServiceSubOfCompany] = useState<{
        items: IServiceSubscription[]
        meta: IMeta
    }>()

    const [loadingFetchDataServiceSub, setLoadingFetchDataServiceSub] =
        useState<boolean>(false)

    //Modal Choose ServicePlan
    const [openModal, setOpenModal] = useState<boolean>(false)

    const handleSetOpenModal = (data: boolean) => {
        setOpenModal(data)
    }

    const handleExtendService = () => {
        setInfoSubscriptionCreate({
            type: SubscriptionEnum.EXTEND,
            exServicePlan: {
                planId: dataServicePlanOfCompany?.planId ?? 0,
                expirationDate: dataServicePlanOfCompany?.expirationDate ?? '',
                price: dataServicePlanOfCompany?.plan.price ?? 0,
            },
        })
        setIdServicePlanSubscription({
            planId: dataServicePlanOfCompany?.planId ?? 0,
            price: dataServicePlanOfCompany?.plan.price ?? 0,
            planName: dataServicePlanOfCompany?.plan.planName ?? '',
        })

        router.push('/service-plan/subscription')
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoadingFetchDataService(true)
            setLoadingFetchDataServiceSub(true)
            const responseServicePlanCompany =
                await companyServicePlan.getServicePlanOfCompany()
            const responseServiceSubOfCompany =
                await companyServicePlan.getAllServicePlanSubscriptionOfCompany(
                    {
                        page: 1,
                        limit: 7,
                    },
                )

            if (responseServicePlanCompany) {
                setDataServicePlanOfCompany(responseServicePlanCompany)
            }

            if (responseServiceSubOfCompany) {
                setDataServiceSubOfCompany(responseServiceSubOfCompany)
            }

            setLoadingFetchDataService(false)
            setLoadingFetchDataServiceSub(false)
        }
        fetchData()
    }, [])

    // Service of Company
    const columnServiceCompany: ColumnsType<IServicePlanOfCompany> = [
        {
            title: t('SERVICE_PLAN'),
            dataIndex: 'planName',
            render: (_, record) => {
                return <Text>{record.plan.planName}</Text>
            },
            width: '25%',
            className: 'min-w-[109px] px-2',
        },
        {
            title: `${t('MEETINGS')}`,
            dataIndex: 'maxMeeting',
            render: (_, record) => {
                return (
                    <Text>
                        {record.meetingCreated}/{record.meetingLimit}
                    </Text>
                )
            },
            // width: 130,
        },
        // {
        //     title: t('TOTAL_CREATED_MTGS'),
        //     dataIndex: 'meetingCreated',
        //     render: (_, record) => {
        //         return <Text>{record.meetingCreated}</Text>
        //     },
        //     // width: 130,
        // },
        {
            title: `${t('ACCOUNT')}`,
            dataIndex: 'maxAccount',
            render: (_, record) => {
                return (
                    <Text>
                        {record.accountCreated}/{record.accountLimit}
                    </Text>
                )
            },
            // width: 130,
        },
        // {
        //     title: t('TOTAL_CREATED_ACCOUNT'),
        //     dataIndex: 'accountCreated',
        //     render: (_, record) => {
        //         return <Text>{record.accountCreated}</Text>
        //     },
        //     // width: 130,
        // },
        {
            title: `${t('STORAGE')}(GB)`,
            dataIndex: 'maxStorage',
            render: (_, record) => {
                return (
                    <Text>
                        {record.storageUsed > 0
                            ? record.storageUsed.toFixed(6)
                            : record.storageUsed}
                        /{record.storageLimit}
                    </Text>
                )
            },
            // width: 130,
        },
        // {
        //     title: `${t('TOTAL_STORAGE_USED')}`,
        //     dataIndex: 'storageUsed',
        //     render: (_, record) => {
        //         return <Text>{record.storageUsed}</Text>
        //     },
        //     // width: 130,
        // },
        {
            title: t('EXPIRATION_DATE'),
            dataIndex: 'expirationDate',
            render: (_, record) => {
                return <Text>{record.expirationDate}</Text>
            },
            // width: 130,
            className: 'min-w-[90px]',
        },
        {
            title: '',
            dataIndex: 'action',
            render: (_, record) => {
                return (
                    <div className="flex flex-col gap-[2px]">
                        {record.plan.price > 0 && (
                            <Button
                                size="small"
                                className="max-w-[87px] px-[2px]"
                                onClick={handleExtendService}
                                disabled={
                                    dataServicePlanOfCompany ? false : true
                                }
                            >
                                {t('EXTEND')}
                            </Button>
                        )}
                        {/* <Button
                            size="small"
                            className="max-w-[87px] px-[2px]"
                            onClick={() => {
                                handleSetOpenModal(true)
                            }}
                        >
                            {t('CHANGE_SERVICE')}
                        </Button> */}
                    </div>
                )
            },
            width: '10%',
            className: 'min-w-[85px]',
        },
    ]

    const dataSourceServicePlanCompany: IServicePlanOfCompany[] =
        useMemo(() => {
            if (dataServicePlanOfCompany) {
                return [{ ...dataServicePlanOfCompany }]
            }
            return []
        }, [dataServicePlanOfCompany])

    // Service Subscription of Company
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
                width: '12%',
                className: 'min-w-[85px]',
            },
            {
                title: t('EXPIRATION_DATE'),
                dataIndex: 'expirationDate',
                render: (_, record) => {
                    return <Text>{record.expiration_date}</Text>
                },
                width: '12%',
                className: 'min-w-[85px]',
            },
            {
                title: t('APPROVAL_TIME'),
                dataIndex: 'expirationDate',
                render: (_, record) => {
                    return <Text>{record.approval_time}</Text>
                },
                width: '12%',
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
                width: '12%',
                className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
            },
        ]

    const dataServiceSubscriptionOfCompany = useMemo(() => {
        return dataServiceSubOfCompany?.items.map((serviceSubscription) => {
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
                approval_time: serviceSubscription?.approval_time
                    ? formatLocalDate(
                          new Date(serviceSubscription.approval_time),
                      )
                    : '',
            }
        })
    }, [dataServiceSubOfCompany])

    const handlePageChange = async (pagination: TablePaginationConfig) => {
        setLoadingFetchDataServiceSub(true)
        const response =
            await companyServicePlan.getAllServicePlanSubscriptionOfCompany({
                page: pagination.current ?? 1,
                limit: pagination.pageSize ?? 7,
            })
        if (response) {
            setDataServiceSubOfCompany(response)
            setLoadingFetchDataServiceSub(false)
        }
    }

    // const handleCreateNewServiceSubscription = () => {
    //     setInfoSubscriptionCreate({
    //         type: SubscriptionEnum.EXTEND,
    //         exServicePlan: {
    //             planId: dataServicePlanOfCompany?.planId ?? 0,
    //             expirationDate:
    //                 dataServicePlanOfCompany?.expirationDate ??
    //                 new Date().toISOString(),
    //             price: dataServicePlanOfCompany?.plan.price ?? 0,
    //         },
    //     })
    // }

    let locale = {
        emptyText: <EmptyData />,
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full flex-col gap-3 rounded-lg bg-white px-6 py-4 shadow-01">
                <div className="flex justify-between">
                    <span className="text-lg font-medium">
                        {t('SERVICE_PLAN_OF_COMPANY')}
                    </span>
                    <Button
                        className="flex items-center"
                        onClick={() => {
                            setInfoSubscriptionCreate({
                                type: SubscriptionEnum.CHANGE_SERVICE,
                                exServicePlan: {
                                    planId:
                                        dataServicePlanOfCompany?.planId ?? 0,
                                    expirationDate:
                                        dataServicePlanOfCompany?.expirationDate ??
                                        '',
                                    price:
                                        dataServicePlanOfCompany?.plan.price ??
                                        0,
                                },
                            })
                            handleSetOpenModal(true)
                        }}
                        disabled={dataServicePlanOfCompany ? false : true}
                    >
                        <PlusOutlined />
                        <span>{t('CHANGE_SERVICE')}</span>
                    </Button>
                </div>
                <div className="">
                    <Table
                        rowKey="service_subscription_id"
                        columns={columnServiceCompany}
                        dataSource={dataSourceServicePlanCompany}
                        pagination={false}
                        size="middle"
                        locale={locale}
                        loading={loadingFetchDataService}
                        scroll={{ x: 845 }}
                    />
                </div>
            </div>
            {/* ServiceSubscription of Company */}
            <div className="flex flex-col gap-3 rounded-lg border bg-white px-6 py-4 shadow-01">
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
                                dataServiceSubOfCompany?.meta.itemsPerPage,
                            total: dataServiceSubOfCompany?.meta.totalItems,
                        }}
                        size="middle"
                        locale={locale}
                        loading={loadingFetchDataServiceSub}
                        onChange={handlePageChange}
                        scroll={{ x: 845 }}
                    />
                </div>
            </div>
            <ModalChooseServicePlan
                openModal={openModal}
                setOpenModal={handleSetOpenModal}
            />
        </div>
    )
}

export default ServiceCompanyDetail
