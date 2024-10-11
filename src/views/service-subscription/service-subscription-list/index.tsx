import {
    PaymentMethodName,
    StatusSubscription,
    StatusSubscriptionColor,
    StatusSubscriptionEnum,
    SubscriptionType,
} from '@/constants/service-subscript'
import { useListServiceSubscription } from '@/stores/service-subscription/hooks'
import { IServiceSubscriptionList } from '@/stores/service-subscription/type'
import { formatLocalDate } from '@/utils/date'
import EmptyData from '@/views/service-plan/service-plan-list/empty-plan'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const { Text } = Typography

// interface ServiceSubscriptionListProps {
//     data: IServiceSubscriptionList[]
// }

const ServiceSubscriptionList = () => {
    const t = useTranslations()
    const router = useRouter()

    const {
        serviceSubscriptionState,
        getListServiceSubscriptionAction,
        // setFilterAction,
    } = useListServiceSubscription()

    let locale = {
        emptyText: <EmptyData />,
    }

    const columns: ColumnsType<IServiceSubscriptionList> = [
        {
            title: t('NO'),
            dataIndex: 'index',
            width: 55,
            className: 'text-center',
            responsive: ['md'],
        },
        {
            title: t('COMPANY_NAME'),
            dataIndex: 'companyName',
            render: (_, record) => {
                return (
                    <div>
                        <Link
                            href={`/company/${record.companyId}/service-plan`}
                            passHref
                            legacyBehavior
                        >
                            <Text className="hover:cursor-pointer hover:underline">
                                {record.companyName}
                            </Text>
                        </Link>
                    </div>
                )
            },
            width: '25%',
            className: 'min-w-[248px]',
        },
        {
            title: t('SERVICE_PLAN'),
            dataIndex: 'servicePlan',
            render: (_, record) => {
                return <Text>{record.planName}</Text>
            },
            width: '15%',
            className: 'min-w-[109px] px-2',
        },
        {
            title: `${t('TOTAL_FEE')}(¥)`,
            dataIndex: 'amount',
            width: '10%',
            className: 'px-2 min-w-[78px]',
        },
        {
            title: t('PAYMENT_METHOD'),
            dataIndex: 'paymentMethod',
            render: (_, record) => {
                return <Text>{t(PaymentMethodName[record.paymentMethod])}</Text>
            },
            width: '12%',
            className: 'min-w-[85px]',
        },
        {
            title: t('TYPE'),
            dataIndex: 'type',
            render: (_, record) => {
                return <Text>{t(SubscriptionType[record.type])}</Text>
            },
            width: '8%',
            className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
        },
        {
            title: t('APPROVAL_TIME'),
            dataIndex: 'approvalTime',
            render: (_, record) => {
                return (
                    <Text>
                        {record.approvalTime
                            ? formatLocalDate(new Date(record.approvalTime))
                            : ''}
                    </Text>
                )
            },
            width: '12%',
            className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
        },
        {
            title: t('STATUS'),
            dataIndex: 'status',
            render: (_, record) => {
                return (
                    <Text
                        style={{
                            color: StatusSubscriptionColor[record.status],
                        }}
                    >
                        {t(StatusSubscription[record.status])}
                    </Text>
                )
            },
            width: '10%',
            className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-3 max-lg:gap-2">
                    <EyeOutlined
                        style={{ fontSize: '18px' }}
                        twoToneColor="#5151e5"
                        onClick={() => {
                            router.push(
                                `/service-subscription/detail/${record.id}`,
                            )
                        }}
                    />
                    {record.status !== StatusSubscriptionEnum.CANCEL &&
                        record.status !== StatusSubscriptionEnum.APPLIED && (
                            <EditOutlined
                                style={{ fontSize: '18px' }}
                                twoToneColor="#5151e5"
                                onClick={() => {
                                    router.push(
                                        `/service-subscription/update/${record.id}`,
                                    )
                                }}
                            />
                        )}
                </div>
            ),
            width: '8%',
            className: 'px-3 min-w-[68px]',
        },
    ]

    const handlePageChange = (pageChange: number) => {
        getListServiceSubscriptionAction({
            page: pageChange,
            limit: serviceSubscriptionState.limit,
            filter: { ...serviceSubscriptionState.filter },
        })
    }

    return (
        <div className="bg-white p-6 max-[470px]:px-1">
            <Table
                columns={columns}
                dataSource={serviceSubscriptionState.serviceSubList}
                rowKey="id"
                pagination={{
                    pageSize: serviceSubscriptionState.limit,
                    defaultCurrent: serviceSubscriptionState.page,
                    total: serviceSubscriptionState.totalServiceSubItem,
                    onChange: handlePageChange,
                }}
                locale={locale}
                scroll={{ x: 845, y: 'calc(100vh - 337px)' }}
            />
        </div>
    )
}

export default ServiceSubscriptionList
