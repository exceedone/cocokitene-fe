import { useServiceSubscriptionDetail } from '@/stores/service-subscription/hooks'
import { Button, Col, Modal, notification, Row, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import {
    IRowServiceSubscriptionInfo,
    RowServiceSubscriptionInfo,
} from './service-subs-rowinfo'
import {
    PaymentMethodName,
    StatusSubscription,
    StatusSubscriptionColor,
    StatusSubscriptionEnum,
    SubscriptionType,
} from '@/constants/service-subscript'
import serviceSubscriptionService from '@/services/system-admin/service-subscription'
import { useParams } from 'next/navigation'
import { AxiosError } from 'axios'
import { formatDate, formatLocalDate } from '@/utils/date'

const { Text } = Typography

const ServiceSubscriptionInfo = () => {
    const t = useTranslations()
    const [{ serviceSubscription }, fetchServiceSubscriptionDetail] =
        useServiceSubscriptionDetail()

    const params = useParams()
    const serviceSubscriptionId = +params.id

    const dataServiceSubscriptionDetail: IRowServiceSubscriptionInfo[] = [
        {
            label: t('COMPANY_NAME'),
            content: (
                <Text className="flex-1 break-words">
                    {serviceSubscription?.company.companyName || ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('SERVICE_PLAN'),
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.plan.planName || ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: `${t('TOTAL_FEE')} (¥)`,
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.amount || ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('PAYMENT_METHOD'),
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.paymentMethod
                        ? t(
                              PaymentMethodName[
                                  serviceSubscription?.paymentMethod
                              ],
                          )
                        : ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('ACTIVATION_DATE'),
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.activationDate ?? ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('EXPIRATION_DATE'),
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.expirationDate ?? ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('REQUEST_TIME'),
            content: (
                <Text className="flex-1">
                    {formatDate(
                        serviceSubscription?.createdAt ?? '',
                        'YYYY-MM-DD HH:mm',
                    )}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('APPROVAL_TIME'),
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.approvalTime
                        ? formatLocalDate(
                              new Date(serviceSubscription.approvalTime),
                          )
                        : ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('TYPE'),
            content: (
                <Text className="flex-1">
                    {serviceSubscription?.type
                        ? t(SubscriptionType[serviceSubscription?.type])
                        : ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: t('STATUS'),
            content: (
                <div>
                    <Text
                        style={{
                            color: serviceSubscription?.status
                                ? StatusSubscriptionColor[
                                      serviceSubscription?.status
                                  ]
                                : '',
                        }}
                    >
                        {serviceSubscription?.status
                            ? t(StatusSubscription[serviceSubscription?.status])
                            : ''}
                    </Text>
                    <div>
                        {
                            <div className="mt-[2px] flex gap-1">
                                {serviceSubscription?.status ==
                                    StatusSubscriptionEnum.PENDING && (
                                    <Button
                                        style={{
                                            background:
                                                serviceSubscription?.status
                                                    ? StatusSubscriptionColor[
                                                          StatusSubscriptionEnum
                                                              .CONFIRMED
                                                      ]
                                                    : '',
                                            color: 'white',
                                            borderRadius: '7px',
                                        }}
                                        size="small"
                                        onClick={() => {
                                            onConfirm(
                                                StatusSubscriptionEnum.CONFIRMED,
                                            )
                                        }}
                                    >
                                        {t(
                                            StatusSubscription[
                                                StatusSubscriptionEnum.CONFIRMED
                                            ],
                                        )}
                                    </Button>
                                )}
                                {serviceSubscription?.status !==
                                    StatusSubscriptionEnum.CANCEL &&
                                    serviceSubscription?.status !==
                                        StatusSubscriptionEnum.APPLIED && (
                                        <Button
                                            style={{
                                                background:
                                                    serviceSubscription?.status
                                                        ? StatusSubscriptionColor[
                                                              StatusSubscriptionEnum
                                                                  .CANCEL
                                                          ]
                                                        : '',
                                                color: 'white',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            onClick={() => {
                                                onConfirm(
                                                    StatusSubscriptionEnum.CANCEL,
                                                )
                                            }}
                                        >
                                            {t(
                                                StatusSubscription[
                                                    StatusSubscriptionEnum
                                                        .CANCEL
                                                ],
                                            )}
                                        </Button>
                                    )}
                            </div>
                        }
                    </div>
                </div>
            ),
            lg: 6,
        },
    ]

    const onConfirm = (value: StatusSubscriptionEnum) => {
        const config = {
            title: t(StatusSubscription[value]),
            content:
                value == StatusSubscriptionEnum.CONFIRMED
                    ? t('DO_YOU_WANT_TO_CONFIRM_TRANSACTION')
                    : t('DO_YOU_WANT_TO_CANCEL_TRANSACTION'),
            okText: t('OK'),
            cancelText: t('CANCEL'),
            oncancel: true,
            onOk() {
                onSubmit(value)
            },
        }
        Modal.confirm(config)
    }

    const onSubmit = async (value: StatusSubscriptionEnum) => {
        try {
            const response =
                await serviceSubscriptionService.updateStatusServiceSubscription(
                    serviceSubscriptionId,
                    {
                        status: value,
                    },
                )

            if (response) {
                notification.success({
                    message: t('UPDATED'),
                    description: t('STATUS_UPDATED_SUCCESSFULLY'),
                    duration: 2,
                })

                fetchServiceSubscriptionDetail(serviceSubscriptionId)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t(error.response?.data.info.message),
                    duration: 3,
                })
            }
        }
    }

    return (
        <div className="bg-white p-0 px-3 py-4 shadow-01 max-[470px]:px-2">
            <Row gutter={[16, 0]}>
                {dataServiceSubscriptionDetail.map((item, index) => {
                    return (
                        <Col xs={24} lg={12} key={index}>
                            <RowServiceSubscriptionInfo
                                label={item.label}
                                content={item.content}
                            />
                        </Col>
                    )
                })}
                {serviceSubscription?.note && (
                    <Col xs={24} lg={24}>
                        <RowServiceSubscriptionInfo
                            label={t('NOTE')}
                            content={
                                <Text className="flex-1">
                                    {serviceSubscription.note}
                                </Text>
                            }
                        />
                    </Col>
                )}
                {/* {serviceSubscription?.transferReceipt && (
                    <Col xs={24} lg={24}>
                        <RowServiceSubscriptionInfo
                            label={t('RECEIPT')}
                            content={
                                <Image
                                    width={200}
                                    src={serviceSubscription.transferReceipt}
                                />
                            }
                        />
                    </Col>
                )} */}
            </Row>
        </div>
    )
}

export default ServiceSubscriptionInfo
