import withAuthAdmin from '@/components/component-auth-admin'
import { useTranslations } from 'next-intl'
import ServicePlanDetail from './service-plan-detail'
import ServicePlanSubscription from './service-subscription'
import LayoutTitle from '@/components/content-page-title/layout-title'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { Typography } from 'antd'
const { Title } = Typography

const CompanyServicePlanDetail = () => {
    const t = useTranslations()
    const router = useRouter()

    return (
        <div>
            <LayoutTitle>
                <div className="flex items-center gap-2">
                    <ArrowLeftOutlined
                        onClick={() => {
                            router.back()
                        }}
                    />
                    <Title level={4} className="mb-0 font-medium">
                        {t('SERVICE_PLAN_OF_COMPANY')}
                    </Title>
                </div>
            </LayoutTitle>
            <div className="flex flex-col gap-4 p-6 max-sm:px-0">
                <div className="shadow-01 max-[470px]:px-2">
                    <ServicePlanDetail />
                </div>
                <div className="shadow-01 max-[470px]:px-2">
                    <ServicePlanSubscription />
                </div>
            </div>
        </div>
    )
}

export default withAuthAdmin(CompanyServicePlanDetail)
