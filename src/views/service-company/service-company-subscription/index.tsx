import { useServiceSubscriptionCreate } from '@/stores/service-subscription/hooks'
import TextArea from 'antd/es/input/TextArea'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Col, DatePicker, Form, Input, notification, Row, Select } from 'antd'
import CreateTitle from '@/components/content-page-title/create-title'
import { FETCH_STATUS } from '@/constants/common'
import {
    PaymentMethod,
    PaymentMethodName,
    SubscriptionEnum,
    SubscriptionType,
} from '@/constants/service-subscript'
import SaveCreateServiceSubscriptionButton from './save-button'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useAuthLogin } from '@/stores/auth/hooks'
import dayjs from 'dayjs'
import companyServicePlan from '@/services/company-service-plan'
import { AxiosError } from 'axios'
import withAuth from '@/components/component-auth'
import { Permissions } from '@/constants/permission'
import { RangePickerProps } from 'antd/es/date-picker'

export interface IServiceSubscriptionCreateForm {
    companyId: number
    planId: number
    amount: number
    type: SubscriptionEnum
    paymentMethod: PaymentMethod
    activationDate: string
    expirationDate: string
    note?: string
    transferReceipt?: string
}

const ServiceCompanySubscription = () => {
    const { serviceSubscriptionCreateState } = useServiceSubscriptionCreate()
    const { authState } = useAuthLogin()

    const t = useTranslations()
    const router = useRouter()

    const [form] = useForm<IServiceSubscriptionCreateForm>()
    const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.IDLE)

    const onFinish = async (value: IServiceSubscriptionCreateForm) => {
        setStatus(FETCH_STATUS.LOADING)

        try {
            const response =
                await companyServicePlan.subscriptionServicePlanForCompany({
                    ...value,
                    amount: +value.amount,
                    activationDate: dayjs(value.activationDate).format(
                        'YYYY-MM-DD',
                    ),
                    expirationDate: dayjs(value.expirationDate).format(
                        'YYYY-MM-DD',
                    ),
                })

            if (response) {
                notification.success({
                    message: t('CREATED'),
                    description: t(''),
                    duration: 2,
                })
                router.push('/service-plan')
                form.resetFields()
                setStatus(FETCH_STATUS.SUCCESS)
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

    useEffect(() => {
        form.setFieldsValue({
            companyId: authState.userData?.companyId,
            planId: serviceSubscriptionCreateState.subscriptionServicePlan
                ?.planId,
            type: serviceSubscriptionCreateState.type,
            amount: serviceSubscriptionCreateState.subscriptionServicePlan
                ?.price,
            // @ts-ignore
            activationDate: dayjs(
                serviceSubscriptionCreateState.exServicePlan?.expirationDate,
            ).add(1, 'days'),
            // @ts-ignore
            expirationDate: dayjs(
                serviceSubscriptionCreateState.exServicePlan?.expirationDate,
            )
                .add(1, 'days')
                .add(12, 'month'),
        })

        // eslint-disable-next-line
    }, [serviceSubscriptionCreateState, authState])

    const handleChangeActiveDate = (dateString: string) => {
        form.setFieldsValue({
            // @ts-ignore
            expirationDate: dayjs(dateString).add(12, 'month'),
        })
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return (
            (current &&
                current >
                    dayjs(
                        serviceSubscriptionCreateState.exServicePlan
                            ?.expirationDate,
                    ).add(1, 'days')) ||
            current <= dayjs(new Date()).add(-1, 'days')
        )
    }

    if (
        !serviceSubscriptionCreateState.subscriptionServicePlan?.planId ||
        !serviceSubscriptionCreateState.type
    ) {
        notification.info({
            message: t('ERROR'),
            description: t('PLEASE_CHOOSE_SERVICE_SUBSCRIPTION'),
            duration: 2,
        })

        router.push('/service-plan')
    }

    return (
        <div>
            <Form onFinish={onFinish} layout="vertical" form={form}>
                <CreateTitle
                    pageName={t('CREATE_SERVICE_SUBSCRIPTION')}
                    saveButton={
                        <SaveCreateServiceSubscriptionButton
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
                                        options={[
                                            {
                                                label: authState.userData
                                                    ?.companyName,
                                                value: authState.userData
                                                    ?.companyId,
                                            },
                                        ]}
                                        disabled={true}
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
                                        options={[
                                            {
                                                label: serviceSubscriptionCreateState
                                                    .subscriptionServicePlan
                                                    ?.planName,
                                                value: serviceSubscriptionCreateState
                                                    .subscriptionServicePlan
                                                    ?.planId,
                                            },
                                        ]}
                                        disabled={true}
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
                                        disabled={
                                            !!serviceSubscriptionCreateState
                                                .exServicePlan?.price
                                        }
                                        disabledDate={disabledDate}
                                        // @ts-ignore
                                        onChange={handleChangeActiveDate}
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

export default withAuth(
    ServiceCompanySubscription,
    Permissions.SUPER_ADMIN_PERMISSION,
)
