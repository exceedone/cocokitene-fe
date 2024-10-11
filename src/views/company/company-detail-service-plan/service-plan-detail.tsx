import serviceCompany from '@/services/system-admin/company'
import { IServicePlanOfCompanyResponse } from '@/services/system-admin/response.type'
import EmptyData from '@/views/service-plan/service-plan-list/empty-plan'
import { Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
const { Text } = Typography

const ServicePlanDetail = () => {
    const t = useTranslations()
    const param = useParams()
    const companyId = +param.id

    const [dataServicePlanOfCompany, setDataServicePlanOfCompany] =
        useState<IServicePlanOfCompanyResponse>()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const response = await serviceCompany.getServicePlanOfCompany(
                companyId,
            )
            if (response) {
                setDataServicePlanOfCompany(response)
            }
            setIsLoading(false)
        }
        fetchData()
    }, [companyId])

    const columnServiceCompany: ColumnsType<IServicePlanOfCompanyResponse> = [
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
        {
            title: t('EXPIRATION_DATE'),
            dataIndex: 'expirationDate',
            render: (_, record) => {
                return <Text>{record.expirationDate}</Text>
            },
            width: '15%',
            className: 'min-w-[90px]',
        },
    ]

    const dataServicePlanOfCompanyTable: IServicePlanOfCompanyResponse[] =
        useMemo(() => {
            if (dataServicePlanOfCompany) {
                return [{ ...dataServicePlanOfCompany }]
            }
            return []
        }, [dataServicePlanOfCompany])

    let locale = {
        emptyText: <EmptyData />,
    }

    return (
        <div>
            <div className="flex w-full flex-col gap-3 rounded-lg bg-white px-6 py-4 shadow-01">
                <div className="flex justify-between">
                    <span className="text-lg font-medium">
                        {t('SERVICE_PLAN_OF_COMPANY')}
                    </span>
                </div>
                <div className="">
                    <Table
                        rowKey="service_subscription_id"
                        columns={columnServiceCompany}
                        dataSource={dataServicePlanOfCompanyTable}
                        pagination={false}
                        size="middle"
                        locale={locale}
                        loading={isLoading}
                        scroll={{ x: 845 }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ServicePlanDetail
