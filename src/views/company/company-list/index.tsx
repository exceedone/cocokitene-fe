import { AvatarBgHexColors } from '@/constants/common'
import { useListCompany } from '@/stores/company/hooks'
import { ICompanyList } from '@/stores/company/type'
import { convertSnakeCaseToTitleCase } from '@/utils/format-string'
import { getFirstCharacterUpperCase } from '@/utils/get-first-character'
import EmptyData from '@/views/service-plan/service-plan-list/empty-plan'
import { EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import { Avatar, Badge, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import Color from 'color'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

const { Text } = Typography

const backgroundAvatarColor = Color(AvatarBgHexColors.GOLDEN_PURPLE)
    .lighten(0.6)
    .hex()

interface CompanyListProps {
    data: ICompanyList[]
}

const CompanyList = ({ data }: CompanyListProps) => {
    const t = useTranslations()
    const router = useRouter()

    let locale = {
        emptyText: <EmptyData />,
    }

    const columns: ColumnsType<ICompanyList> = [
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
                return <Text>{record.companyName}</Text>
            },
            width: '40%',
            className: 'min-w-[248px]',
        },
        {
            title: t('SERVICE_PLAN'),
            dataIndex: 'servicePlan',
            render: (_, record) => {
                return <Text>{record.servicePlan}</Text>
            },
            width: '15%',
            className: 'min-w-[109px] px-2',
        },
        {
            title: t('REPRESENTATIVE'),
            dataIndex: 'representative',
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-6">
                            <Avatar
                                style={{
                                    backgroundColor: backgroundAvatarColor,
                                    verticalAlign: 'middle',
                                    color: AvatarBgHexColors.GOLDEN_PURPLE,
                                }}
                                size="small"
                                className="w-[24px] flex-initial"
                            >
                                {getFirstCharacterUpperCase(
                                    record.representative,
                                )}
                            </Avatar>
                        </div>
                        <Text title={record.representative} className="">
                            {record.representative}
                        </Text>
                    </div>
                )
            },
            width: '18%',
            className: 'min-w-[126px]',
        },
        {
            title: t('TOTAL_CREATED_ACCOUNT'),
            dataIndex: 'totalCreatedAccount',
            width: '12%',
            className: 'px-2 min-w-[78px]',
        },
        {
            title: t('TOTAL_CREATED_MTGS'),
            dataIndex: 'totalCreatedMTGs',
            width: '12%',
            className: 'min-w-[85px]',
        },
        {
            title: t('STATUS'),
            dataIndex: 'status',
            render: (_, record) => (
                <>
                    {record.status && record.status == '0' ? (
                        <Badge status="success" text={t('ACTIVE')} />
                    ) : (
                        <Badge status="error" text={t('INACTIVE')} />
                    )}{' '}
                </>
            ),
            width: '12%',
            className: 'px-[6px] max-[470px]:px-0 min-w-[79px]',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-3 max-lg:gap-2">
                    <EditTwoTone
                        style={{ fontSize: '18px' }}
                        twoToneColor="#5151e5"
                        onClick={() => {
                            router.push(`/company/update/${record.id}`)
                        }}
                    />
                    <EyeTwoTone
                        style={{ fontSize: '18px' }}
                        twoToneColor="#5151e5"
                        onClick={() => {
                            router.push(`/company/detail/${record.id}`)
                        }}
                    />
                </div>
            ),
            width: '10%',
            className: 'px-3 min-w-[68px]',
        },
    ]
    const { companyState, getListCompanyAction } = useListCompany()
    const handlePageChange = (pageChange: number) => {
        getListCompanyAction({
            page: pageChange,
            limit: companyState.limit,
            filter: { ...companyState.filter },
        })
    }

    const dataFinal = data.map((item, index) => ({
        ...item,
        servicePlan: convertSnakeCaseToTitleCase(item.servicePlan),
        index: companyState.limit * (companyState.page - 1) + index + 1,
    }))

    return (
        <div className="bg-white p-6 max-[470px]:px-1">
            <Table
                columns={columns}
                dataSource={dataFinal}
                rowKey="id"
                pagination={{
                    pageSize: companyState.limit,
                    defaultCurrent: companyState.page,
                    total: companyState.totalCompanyItem,
                    onChange: handlePageChange,
                }}
                locale={locale}
                scroll={{ x: 845, y: 'calc(100vh - 337px)' }}
            />
        </div>
    )
}

export default CompanyList
