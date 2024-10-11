/* eslint-disable */
import { SubscriptionEnum } from '@/constants/service-subscript'
import { useListPlan } from '@/stores/service-plan/hooks'
import { useServiceSubscriptionCreate } from '@/stores/service-subscription/hooks'
import { EActionStatus } from '@/stores/type'
import { CheckOutlined } from '@ant-design/icons'
import { Button, Modal, Spin, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const { Title, Text } = Typography

interface IServicePlanOption {
    id: number
    planName: string
    maxMeeting: number
    maxAccount: number
    maxStorage: number
    price: number
    isRecommended?: boolean
    // eslint-disable-next-line
    handleChooseServicePlan: (
        id: number,
        planName: string,
        price: number,
    ) => void
    disabled?: boolean
}

const ServicePlanOption = ({
    id,
    planName,
    maxStorage,
    maxMeeting,
    price,
    maxAccount,
    handleChooseServicePlan,
    isRecommended,
    disabled = false,
}: IServicePlanOption) => {
    const t = useTranslations()

    return (
        <div className="relative flex h-64 w-48 flex-col rounded-2xl border-[1px] border-blue-700 bg-white">
            <div className="plan-item__title border-b border-neutral/4 py-1 text-center">
                <Title
                    level={5}
                    className={`text-u mb-0 font-medium uppercase`}
                >
                    {planName}
                </Title>
            </div>
            <div className="flex flex-col gap-1 p-3">
                <div className="flex gap-1">
                    <CheckOutlined />
                    <Text>
                        {maxMeeting} {t('MEETINGS')} /{t('YEAR')}
                    </Text>
                </div>
                <div className="flex gap-1">
                    <CheckOutlined />
                    <Text>
                        {maxAccount} {t('ACCOUNT')} /{t('YEAR')}
                    </Text>
                </div>
                <div className="flex gap-1">
                    <CheckOutlined />
                    <Text>
                        {maxStorage} {t('GB_STORAGE')}
                    </Text>
                </div>
                <div className="plan-item__price mt-8 flex items-end justify-start">
                    <Title
                        className="font-medium leading-[0] text-primary"
                        level={2}
                    >
                        {price}¥
                    </Title>
                    <Text className="font-medium text-primary">
                        / {t('YEAR')}
                    </Text>
                </div>
            </div>
            <div>
                <Button
                    className="absolute bottom-5 left-[50%] mx-auto w-[90%] translate-x-[-50%] rounded-lg text-base font-normal"
                    //
                    onClick={() => {
                        handleChooseServicePlan(id, planName, price)
                    }}
                    disabled={disabled}
                >
                    {t('SUBSCRIPTION')}
                </Button>
            </div>
        </div>
    )
}

interface IModalChooseServicePlan {
    openModal: boolean
    // eslint-disable-next-line
    setOpenModal: (data: boolean) => void
}

const ModalChooseServicePlan = ({
    openModal,
    setOpenModal,
}: IModalChooseServicePlan) => {
    const t = useTranslations()
    const router = useRouter()

    const { serviceSubscriptionCreateState, setIdServicePlanSubscription } =
        useServiceSubscriptionCreate()

    const { planState, getListPlanAction } = useListPlan()

    useEffect(() => {
        getListPlanAction({
            page: planState.page,
            limit: planState.limit,
            filter: { ...planState.filter },
        })
        // eslint-disable-next-line
    }, [planState.filter])

    const handleSetOpenModal = (data: boolean) => {
        setOpenModal(data)
    }

    const handleChoseServicePlanSubscription = (
        servicePlanId: number,
        planName: string,
        price: number,
    ) => {
        setIdServicePlanSubscription({
            planId: servicePlanId,
            price: price,
            planName: planName,
        })
        router.push('/service-plan/subscription')
    }

    return (
        <Modal
            title={
                <div className="">
                    <Title level={3} className={`mb-0 font-medium`}>
                        {t('PLEASE_CHOOSE_SERVICE_SUBSCRIPTION')}
                    </Title>
                </div>
            }
            open={openModal}
            onCancel={() => {
                handleSetOpenModal(false)
            }}
            closable={false}
            footer={null}
            width="70%"
        >
            <div
            // className="border border-red-600"
            >
                {!planState || planState?.status === EActionStatus.Pending ? (
                    <div>
                        <Spin tip="Loading..." />
                    </div>
                ) : (
                    <div className="p-10 max-[470px]:px-0">
                        {/* <span>
                            This is modal choose ServicePlan to subscription!!!
                        </span> */}
                        <div className="flex flex-wrap justify-center gap-7">
                            {planState.planList
                                .filter((plan) => plan.price > 0)
                                .map((servicePlan) => {
                                    return (
                                        <ServicePlanOption
                                            key={servicePlan.id}
                                            id={servicePlan.id}
                                            planName={servicePlan.planName}
                                            maxMeeting={servicePlan.maxMeeting}
                                            maxAccount={
                                                servicePlan.maxShareholderAccount
                                            }
                                            maxStorage={servicePlan.maxStorage}
                                            price={servicePlan.price}
                                            handleChooseServicePlan={
                                                handleChoseServicePlanSubscription
                                            }
                                            disabled={
                                                serviceSubscriptionCreateState.type ===
                                                    SubscriptionEnum.CHANGE_SERVICE &&
                                                serviceSubscriptionCreateState
                                                    .exServicePlan?.planId ==
                                                    servicePlan.id
                                            }
                                        />
                                    )
                                })}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default ModalChooseServicePlan
