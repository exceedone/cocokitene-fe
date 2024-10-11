import withAuth from '@/components/component-auth'
import DetailTitle from '@/components/content-page-title/detail-title'
import { Permissions } from '@/constants/permission'
import { useTranslations } from 'next-intl'
import ServiceCompanyDetail from './service-company-detail'

const ServicePlanOfCompany = () => {
    const t = useTranslations()

    return (
        <div>
            <DetailTitle urlBack="/dashboard" pageName={t('SERVICE_PLAN')} />
            <div className="p-6 max-sm:px-0">
                <div className="shadow-01 max-[470px]:px-2">
                    <ServiceCompanyDetail />
                </div>
            </div>
        </div>
    )
}

export default withAuth(
    ServicePlanOfCompany,
    Permissions.SUPER_ADMIN_PERMISSION,
)
