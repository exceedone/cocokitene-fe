import withAuthAdmin from '@/components/component-auth-admin'
import ListTitle from '@/components/content-page-title/list-title'
import { useListPlan } from '@/stores/service-plan/hooks'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Grid } from 'antd'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PlanList from './service-plan-list'
const { useBreakpoint } = Grid

const ServicePlanList = () => {
    const t = useTranslations()
    const screens = useBreakpoint()
    const router = useRouter()

    const { planState, getListPlanAction, setFilterAction } = useListPlan()

    useEffect(() => {
        getListPlanAction({
            page: planState.page,
            limit: planState.limit,
            filter: { ...planState.filter },
        })
        // eslint-disable-next-line
    }, [planState.filter])

    const handleInputChange = (value: string) => {
        setFilterAction({ ...planState.filter, searchQuery: value })
    }

    const handleSelectChange = (value: string) => {
        setFilterAction({ ...planState.filter, sortOrder: value })
    }

    return (
        <div>
            <ListTitle
                pageName={t('LIST_SERVICE_PLAN')}
                addButton={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size={screens.lg ? 'large' : 'middle'}
                        className="max-[470px]:px-2"
                        onClick={() => {
                            router.push('/plan/create')
                        }}
                    >
                        {t('ADD_NEW')}
                    </Button>
                }
                defaultSort={planState.filter?.sortOrder}
                onChangeInput={handleInputChange}
                onChangeSelect={handleSelectChange}
            />
            <div className="w-full p-6 max-sm:px-0">
                <div className="w-full bg-white p-6 px-6 py-4 shadow-01">
                    <PlanList />
                </div>
            </div>
        </div>
    )
}

export default withAuthAdmin(ServicePlanList)
