/* eslint-disable */

import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Col, DatePicker, Form, Input, notification, Row, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'

import withAuthAdmin from '@/components/component-auth-admin'
import UpdateTitle from '@/components/content-page-title/update-title'
import Loader from '@/components/loader'
import { FETCH_STATUS } from '@/constants/common'
import {
    PaymentMethod,
    PaymentMethodName,
    StatusSubscription,
    StatusSubscriptionColor,
    StatusSubscriptionEnum,
    SubscriptionEnum,
    SubscriptionType,
} from '@/constants/service-subscript'
import serviceSubscriptionService from '@/services/system-admin/service-subscription'
import SaveUpdatePlanButton from './save-button'

export interface IServiceSubscriptionUpdate {
    companyId: number
    planId: number
    amount: number
    type: SubscriptionEnum
    paymentMethod: PaymentMethod
    status: StatusSubscriptionEnum
    activationDate: string
    expirationDate: string
    note?: string
}

const UpdateServiceSubscription = () => {
    const t = useTranslations()
    const router = useRouter()
    const param = useParams()
    const serviceSubscriptionId = +param.id
    const [form] = useForm<IServiceSubscriptionUpdate>()

    const [companyInfo, setCompanyInfo] = useState<{
        companyId: number
        companyName: string
        planId: number
    }>()
    const [optionServicePlan, setOptionServicePlan] = useState<
        {
            value: number
            label: string
            price: number
        }[]
    >([])
    const [initServiceSubscription, setInitServiceSubscription] =
        useState<IServiceSubscriptionUpdate>()
    const [initStatus, setInitStatus] = useState<FETCH_STATUS>(
        FETCH_STATUS.IDLE,
    )
    const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.IDLE)

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const res =
                    await serviceSubscriptionService.getDetailServiceSubscription(
                        serviceSubscriptionId,
                    )

                const optionServicePlanList =
                    await serviceSubscriptionService.getAllServicePlanOption()

                if (res) {
                    setInitServiceSubscription({
                        companyId: res.companyId,
                        planId: res.planId,
                        amount: res.amount,
                        type: res.type,
                        paymentMethod: res.paymentMethod,
                        status: res.status,
                        activationDate: res.activationDate,
                        expirationDate: res.expirationDate,
                        note: res?.note,
                    })
                    setCompanyInfo({
                        companyId: res.company.id,
                        companyName: res.company.companyName,
                        planId: res.company.planId,
                    })
                }
                if (optionServicePlanList) {
                    setOptionServicePlan(
                        optionServicePlanList.map((option) => ({
                            value: option.id,
                            label: option.planName,
                            price: option.price,
                        })),
                    )
                }

                setInitStatus(FETCH_STATUS.SUCCESS)
            } catch (error) {
                if (error instanceof AxiosError) {
                    notification.error({
                        message: t('ERROR'),
                        description: error.response?.data.info.message,
                        duration: 3,
                    })
                }
                setInitStatus(FETCH_STATUS.ERROR)
            }
        }
        if (serviceSubscriptionId) {
            fetchInitData()
        }
    }, [serviceSubscriptionId])

    const handleChangeServicePlan = (value: number) => {
        form.setFieldsValue({
            type:
                companyInfo?.planId == value
                    ? SubscriptionEnum.EXTEND
                    : SubscriptionEnum.CHANGE_SERVICE,
            amount:
                optionServicePlan.find((service) => service.value == value)
                    ?.price ?? 0,
        })
    }

    const onFinish = async (value: IServiceSubscriptionUpdate) => {
        setStatus(FETCH_STATUS.LOADING)

        console.log('value: ', {
            companyId: value.companyId,
            planId: value.planId,
            amount: +value.amount,
            type: value.type,
            paymentMethod: value.paymentMethod,
            status: value.status,
            activationDate: dayjs(value.activationDate).format('YYYY-MM-DD'),
            expirationDate: dayjs(value.expirationDate).format('YYYY-MM-DD'),
            note: value?.note,
        })

        try {
            const updateServicePlanSubscription =
                await serviceSubscriptionService.updateServicePlanSubscription(
                    serviceSubscriptionId,
                    {
                        companyId: value.companyId,
                        planId: value.planId,
                        amount: +value.amount,
                        type: value.type,
                        paymentMethod: value.paymentMethod,
                        status: value.status,
                        activationDate: dayjs(value.activationDate).format(
                            'YYYY-MM-DD',
                        ),
                        expirationDate: dayjs(value.expirationDate).format(
                            'YYYY-MM-DD',
                        ),
                        note: value?.note,
                    },
                )
            if (updateServicePlanSubscription) {
                notification.success({
                    message: t('UPDATED'),
                    description: t('UPDATE_SUBSCRIPTION_SERVICE_SUCCESSFULLY'),
                    duration: 2,
                })
                setStatus(FETCH_STATUS.SUCCESS)
                router.push(
                    `/service-subscription/detail/${serviceSubscriptionId}`,
                )
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t(error.response?.data.info.message),
                    duration: 3,
                })
            }
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    if (
        initServiceSubscription?.status == StatusSubscriptionEnum.CANCEL ||
        initServiceSubscription?.status == StatusSubscriptionEnum.APPLIED
    ) {
        notification.error({
            message: t('ERROR'),
            duration: 3,
        })
        router.push(`/service-subscription/detail/${serviceSubscriptionId}`)
    }

    if (!initServiceSubscription || initStatus === FETCH_STATUS.LOADING) {
        return <Loader />
    }

    return (
        <div>
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
                initialValues={{
                    ...initServiceSubscription,
                    activationDate: dayjs(
                        initServiceSubscription.activationDate,
                    ),
                    expirationDate: dayjs(
                        initServiceSubscription.expirationDate,
                    ),
                }}
            >
                <UpdateTitle
                    pageName={t('UPDATE_SUBSCRIPTION_SERVICE')}
                    saveButton={
                        <SaveUpdatePlanButton
                            form={form}
                            isLoading={status === FETCH_STATUS.LOADING}
                        />
                    }
                />
                <div className="p-6">
                    <div className="bg-white px-6 py-6 shadow-01">
                        <Row gutter={[16, 24]}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="companyId"
                                    label={t('COMPANY_NAME')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('REQUIRE_COMPANY_NAME'),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        showSearch
                                        placeholder=""
                                        optionFilterProp="label"
                                        disabled={true}
                                        options={[
                                            {
                                                label: companyInfo?.companyName,
                                                value: companyInfo?.companyId,
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="planId"
                                    label={t('SERVICE_PLAN')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('REQUIRE_SERVICE_PLAN'),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        showSearch
                                        placeholder=""
                                        optionFilterProp="label"
                                        onChange={handleChangeServicePlan}
                                        options={optionServicePlan}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="type"
                                    label={t('TYPE')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(''),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        showSearch
                                        placeholder=""
                                        options={[
                                            {
                                                value: SubscriptionEnum.EXTEND,
                                                label: t(
                                                    SubscriptionType[
                                                        SubscriptionEnum.EXTEND
                                                    ],
                                                ),
                                            },
                                            {
                                                value: SubscriptionEnum.CHANGE_SERVICE,
                                                label: t(
                                                    SubscriptionType[
                                                        SubscriptionEnum
                                                            .CHANGE_SERVICE
                                                    ],
                                                ),
                                            },
                                        ]}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="paymentMethod"
                                    label={t('PAYMENT_METHOD')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(''),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        showSearch
                                        placeholder=""
                                        options={[
                                            {
                                                value: PaymentMethod.DIRECT_PAYMENT,
                                                label: t(
                                                    PaymentMethodName[
                                                        PaymentMethod
                                                            .DIRECT_PAYMENT
                                                    ],
                                                ),
                                            },
                                            {
                                                value: PaymentMethod.BANK_TRANSFER,
                                                label: t(
                                                    PaymentMethodName[
                                                        PaymentMethod
                                                            .BANK_TRANSFER
                                                    ],
                                                ),
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12} lg={6}>
                                <Form.Item
                                    name="activationDate"
                                    label={t('ACTIVATION_DATE')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('REQUIRE_TIME'),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <DatePicker
                                        size="middle"
                                        placeholder={t('SELECT_DATE')}
                                        format="YYYY-MM-DD"
                                        style={{ width: '100%' }}
                                        // disabledDate={disabledDate}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={12} lg={6}>
                                <Form.Item
                                    name="expirationDate"
                                    label={t('EXPIRATION_DATE')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('REQUIRE_TIME'),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <DatePicker
                                        size="middle"
                                        placeholder={t('SELECT_DATE')}
                                        format="YYYY-MM-DD"
                                        style={{ width: '100%' }}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="amount"
                                    label={`${t('TOTAL_FEE')} (¥)`}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(''),
                                        },
                                        {
                                            pattern: new RegExp(/^[0-9]+$/),
                                            message: t(
                                                'PLEASE_ENTER_ONLY_NUMBER',
                                            ),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        size="middle"
                                        maxLength={10}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="status"
                                    label={t('STATUS')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(''),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        showSearch
                                        placeholder=""
                                        options={[
                                            {
                                                value: StatusSubscriptionEnum.PENDING,
                                                label: (
                                                    <span
                                                        style={{
                                                            color: StatusSubscriptionColor[
                                                                StatusSubscriptionEnum
                                                                    .PENDING
                                                            ],
                                                        }}
                                                    >
                                                        {t(
                                                            StatusSubscription[
                                                                StatusSubscriptionEnum
                                                                    .PENDING
                                                            ],
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                value: StatusSubscriptionEnum.CONFIRMED,
                                                label: (
                                                    <span
                                                        style={{
                                                            color: StatusSubscriptionColor[
                                                                StatusSubscriptionEnum
                                                                    .CONFIRMED
                                                            ],
                                                        }}
                                                    >
                                                        {t(
                                                            StatusSubscription[
                                                                StatusSubscriptionEnum
                                                                    .CONFIRMED
                                                            ],
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                value: StatusSubscriptionEnum.CANCEL,
                                                label: (
                                                    <span
                                                        style={{
                                                            color: StatusSubscriptionColor[
                                                                StatusSubscriptionEnum
                                                                    .CANCEL
                                                            ],
                                                        }}
                                                    >
                                                        {t(
                                                            StatusSubscription[
                                                                StatusSubscriptionEnum
                                                                    .CANCEL
                                                            ],
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={24}>
                                <Form.Item
                                    name="note"
                                    label={t('NOTE')}
                                    rules={[
                                        {
                                            max: 5000,
                                            message: t(
                                                'NOTE_MUST_BE_UP_TO_{max}_CHARACTERS',
                                                {
                                                    max: 5000,
                                                },
                                            ),
                                        },
                                    ]}
                                    className="mb-0"
                                >
                                    <TextArea
                                        name="note"
                                        size="large"
                                        maxLength={5000}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default withAuthAdmin(UpdateServiceSubscription)
