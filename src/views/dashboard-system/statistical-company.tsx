import { CompanyStatusName } from '@/constants/company-status'
import { UserStatusName } from '@/constants/user-status'
import serviceDashBoard from '@/services/system-admin/dash-board'
import { Pie } from '@ant-design/plots'
import { Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import Sliders from 'react-slick'

export interface IStatisticCompany {
    companyStatuses: { type: string; value: number }[]
    userStatuses: { type: string; value: number }[]
    servicePlan: { type: string; value: number }[]
}

const StatisticalCompany = ({
    month,
    year,
}: {
    month: number
    year: number
}) => {
    const t = useTranslations()
    const [dataStatistic, setDataStatistic] = useState<IStatisticCompany>()
    const [loadingFetchData, setLoadingFetchData] = useState<boolean>(true)

    useEffect(() => {
        const fetchDataStatistical = async () => {
            setLoadingFetchData(true)
            const statisticalCompany = await serviceDashBoard.getStatistical(
                month,
                year,
            )

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
    }, [month, year])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        className: 'center',
        customPaging: function () {
            return <div className="dot mt-3"></div>
        },
        dotsClass: 'slick-dots slick-thumb',
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    }

    const configPie = useCallback(
        (data: { type: string; value: number }[]) => {
            const total = data.reduce((acc, cur) => {
                return acc + cur.value
            }, 0)

            return {
                data: data,
                angleField: 'value',
                colorField: 'type',
                marginRight: 16,
                marginBottom: 150,
                marginTop: -45,
                radius: 0.8,
                innerRadius: 0.5,
                width: 276,
                height: 500,
                // insetRight: 50,
                tooltip: false,
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
                        position: 'bottom',
                        rowPadding: 10,
                        width: 250,
                        cols: 1,
                        maxRows: 1,
                        itemLabelFontSize: 16,
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
                interaction: {
                    legendFilter: false,
                },
                // autoFit: true,
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
        <div className="flex min-h-[350px] w-full flex-col gap-3 p-2 py-5">
            <span className="text-xl font-medium">
                {t('COMPANY_INFORMATION_STATISTICS')} ({year}-{month})
            </span>
            <div className="mx-auto w-[90%]">
                <div className="mx-auto max-w-[1200px] px-0">
                    <Sliders {...settings} className="mx-auto pb-3">
                        <div className="mx-auto box-border flex max-w-[320px] flex-col justify-between border pb-3">
                            <div className="mt-3 pl-5 text-lg">
                                {t('COMPANY')}
                            </div>
                            <div className="pl-5 text-sm">
                                {t('COMPANY_STATUS_STATISTICS')}
                            </div>
                            <div className="flex justify-center">
                                <div>
                                    <Pie
                                        {...configPie(
                                            dataStatistic?.companyStatuses ??
                                                [],
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto box-border flex max-w-[320px] flex-col border pb-3 ">
                            <div className="mt-3 pl-5 text-lg">
                                {t('SERVICE_PLAN')}
                            </div>
                            <div className="pl-5 text-sm ">
                                {t('SERVICE_PLAN_STATISTICS')}
                            </div>
                            <div className="flex justify-center">
                                <div>
                                    <Pie
                                        {...configPie(
                                            dataStatistic?.servicePlan ?? [],
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto box-border flex max-w-[320px] flex-col border pb-3 ">
                            <div className="mt-3 pl-5 text-lg">
                                {t('ACCOUNT')}
                            </div>
                            <div className="pl-5 text-sm ">
                                {t('USER_STATUS_STATISTICS')}
                            </div>
                            <div className="flex justify-center">
                                <div>
                                    <Pie
                                        {...configPie(
                                            dataStatistic?.userStatuses ?? [],
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </Sliders>
                </div>
            </div>
        </div>
    )
}

export default StatisticalCompany
