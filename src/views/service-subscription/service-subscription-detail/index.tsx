import withAuthAdmin from '@/components/component-auth-admin'
import DetailTitle from '@/components/content-page-title/detail-title'
import Loader from '@/components/loader'
import { useServiceSubscriptionDetail } from '@/stores/service-subscription/hooks'
import { EActionStatus } from '@/stores/type'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ServiceSubscriptionInfo from './service-subscription-info'
import { StatusSubscriptionEnum } from '@/constants/service-subscript'
import { Button, Modal, notification } from 'antd'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'
import serviceSubscriptionService from '@/services/system-admin/service-subscription'
import { AxiosError } from 'axios'

const ServiceSubscriptionDetail = () => {
    const t = useTranslations()
    const params = useParams()
    const router = useRouter()

    const serviceSubscriptionId = +params.id

    const [{ serviceSubscription, status }, fetchServiceSubscriptionDetail] =
        useServiceSubscriptionDetail()

    useEffect(() => {
        if (serviceSubscriptionId) {
            fetchServiceSubscriptionDetail(serviceSubscriptionId)
        }
        // eslint-disable-next-line
    }, [serviceSubscriptionId])

    const onConfirm = (serviceSubscriptionId: number) => {
        const config = {
            title: t('APPLY_IMMEDIATELY'),
            content: t('DO_YOU_WANT_APPLY_SERVICE_SUBSCRIPTION_NOW'),
            okText: t('OK'),
            cancelText: t('CANCEL'),
            oncancel: true,
            onOk() {
                applyNowForServiceSubscription(serviceSubscriptionId)
            },
        }
        Modal.confirm(config)
    }

    const applyNowForServiceSubscription = async (
        serviceSubscriptionId: number,
    ) => {
        try {
            const response =
                await serviceSubscriptionService.applyServiceSubscriptionNow(
                    serviceSubscriptionId,
                    {
                        status: StatusSubscriptionEnum.CONFIRMED,
                    },
                )
            if (response) {
                notification.success({
                    message: t('SUCCESS_APPLY_SERVICE_PLAN'),
                    description: '',
                    duration: 2,
                })
            }
            router.push('/service-subscription')
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

    console.log('serviceSubscription: ', serviceSubscription)

    if (!serviceSubscription || status === EActionStatus.Pending) {
        return <Loader />
    }

    return (
        <div>
            <DetailTitle
                urlBack="/service-subscription"
                pageName={t('SERVICE_SUBSCRIPTION_DETAIL')}
                editButton={
                    serviceSubscription.status !==
                        StatusSubscriptionEnum.CANCEL && (
                        <Button
                            icon={<CheckOutlined />}
                            type="primary"
                            size="middle"
                            onClick={() => {
                                onConfirm(serviceSubscriptionId)
                            }}
                            className="px-2"
                        >
                            {t('APPLY_IMMEDIATELY')}
                        </Button>
                    )
                }
                extraButton={
                    serviceSubscription.status !==
                        StatusSubscriptionEnum.CANCEL &&
                    serviceSubscription.status !==
                        StatusSubscriptionEnum.APPLIED && (
                        <Button
                            icon={<EditOutlined />}
                            type="default"
                            size="middle"
                            className="px-2"
                            onClick={() =>
                                router.push(
                                    `/service-subscription/update/${serviceSubscriptionId}`,
                                )
                            }
                        >
                            {t('EDIT')}
                        </Button>
                    )
                }
            />
            <div className="p-6 max-sm:px-0">
                <div className="bg-white p-6 px-4 py-4 shadow-01 max-[470px]:px-2">
                    <ServiceSubscriptionInfo />
                </div>
            </div>
        </div>
    )
}

export default withAuthAdmin(ServiceSubscriptionDetail)
