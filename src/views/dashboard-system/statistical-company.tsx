import { CompanyStatusName } from '@/constants/company-status'
import { UserStatusName } from '@/constants/user-status'
import serviceDashBoard from '@/services/system-admin/dash-board'
import { Pie } from '@ant-design/plots'
import { Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

export interface IStatisticCompany {
    companyStatuses: { type: string; value: number }[]
    userStatuses: { type: string; value: number }[]
    servicePlan: { type: string; value: number }[]
}

const StatisticalCompany = () => {
    const t = useTranslations()
    const [dataStatistic, setDataStatistic] = useState<IStatisticCompany>()
    const [loadingFetchData, setLoadingFetchData] = useState<boolean>(true)

    useEffect(() => {
        const fetchDataStatistical = async () => {
            setLoadingFetchData(true)
            const statisticalCompany = await serviceDashBoard.getStatistical()

            if (statisticalCompany) {
                const statisticalCompanyData = {
                    ...statisticalCompany,
                    companyStatuses: statisticalCompany.companyStatuses.map(
                        (status) => ({
                            type:
                                t(
                                    CompanyStatusName[
                                        status.company_status_mst_status
                                    ],
                                ) +
                                ': ' +
                                status.totalCompany,
                            value: +status.totalCompany,
                        }),
                    ),
                    userStatuses: statisticalCompany.userStatuses.map(
                        (status) => ({
                            type:
                                t(UserStatusName[status.user_statuses_status]) +
                                ': ' +
                                status.totalUser,
                            value: +status.totalUser,
                        }),
                    ),
                    servicePlan: statisticalCompany.servicePlan.map((plan) => ({
                        type:
                            plan.plan_mst_plan_name + ': ' + plan.totalCompany,
                        value: +plan.totalCompany,
                    })),
                }
                setDataStatistic(statisticalCompanyData)
            }
            setLoadingFetchData(false)
        }
        fetchDataStatistical()
        // eslint-disable-next-line
    }, [])

    const configPie = useCallback(
        (data: { type: string; value: number }[]) => {
            const total = data.reduce((acc, cur) => {
                return acc + cur.value
            }, 0)

            return {
                data: data,
                angleField: 'value',
                colorField: 'type',
                marginRight: 180,
                innerRadius: 0.65,
                width: 450,
                height: 350,
                label: {
                    text: ({ value }: { value: any }) =>
                        value > 0 ? value : '',
                    style: {
                        fontWeight: '400',
                        fontSize: 19,
                        pointerEvents: 'none', // Loại bỏ hover
                    },
                },
                legend: {
                    color: {
                        title: false,
                        position: 'right-',
                        rowPadding: 10,
                        leftPadding: 100,
                        width: 250,
                        cols: 1,
                        maxRows: 1,
                    },
                },
                annotations: [
                    {
                        type: 'text',
                        style: {
                            text: t('TOTAL') + ': ' + total,
                            x: '50%',
                            y: '50%',
                            textAlign: 'center',
                            fontSize: 22,
                            fontStyle: 'bold',
                            pointerEvents: 'none', // Loại bỏ hover
                        },
                    },
                ],
                color: [
                    '#001122',
                    '#003322',
                    '#004422',
                    '#005522',
                    '#006622',
                    '#007722',
                    '#008822',
                ],
            }
        },
        // eslint-disable-next-line
        [dataStatistic],
    )

    if (loadingFetchData) {
        return (
            <div className="flex h-[178px] items-center justify-center">
                <Spin tip="Loading..." />
            </div>
        )
    }

    return (
        <div className="flex min-h-[350px] flex-col gap-3 px-2 py-5 ">
            <span className="text-xl">
                {t('COMPANY_INFORMATION_STATISTICS')}
            </span>
            <div className="flex gap-5">
                <div className="flex-1 border pb-10 shadow-xl">
                    <div className="mt-3 pl-5 text-lg">{t('COMPANY')}</div>
                    <div className="mb-3 h-[24px] pl-5 text-base">
                        {t('COMPANY_STATUS_STATISTICS')}
                    </div>
                    <Pie {...configPie(dataStatistic?.companyStatuses ?? [])} />
                </div>
                <div className="flex-1  border pb-10 shadow-xl">
                    <div className="mt-3 pl-5 text-lg">{t('SERVICE_PLAN')}</div>
                    <div className="mb-3 pl-5 text-base">
                        {t('SERVICE_PLAN_STATISTICS')}
                    </div>
                    <Pie {...configPie(dataStatistic?.servicePlan ?? [])} />
                </div>
                <div className="flex-1 border pb-10 shadow-xl">
                    <div className="mt-3 pl-5 text-lg">{t('USER')}</div>
                    <div className="mb-3 pl-5 text-base">
                        {t('USER_STATUS_STATISTICS')}
                    </div>
                    <Pie {...configPie(dataStatistic?.userStatuses ?? [])} />
                </div>
            </div>
        </div>
    )
}

export default StatisticalCompany
