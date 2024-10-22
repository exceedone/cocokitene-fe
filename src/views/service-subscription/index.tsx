import withAuthAdmin from '@/components/component-auth-admin'
import ListTitle from '@/components/content-page-title/list-title'
import { useListServiceSubscription } from '@/stores/service-subscription/hooks'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Grid } from 'antd'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ServiceSubscriptionList from './service-subscription-list'
import useDebounce from '@/hooks/useDebounce'

const { useBreakpoint } = Grid

const ServiceSubscription = () => {
    const t = useTranslations()
    const screens = useBreakpoint()
    const router = useRouter()

    const {
        serviceSubscriptionState,
        getListServiceSubscriptionAction,
        setFilterAction,
    } = useListServiceSubscription()

    const [searchString, setSearchString] = useState<string>('')
    const searchQueryString = useDebounce(searchString, 200)

    useEffect(() => {
        setFilterAction({
            ...serviceSubscriptionState.filter,
            searchQuery: searchQueryString,
        })
        // eslint-disable-next-line
    }, [searchQueryString])

    useEffect(() => {
        getListServiceSubscriptionAction({
            page: serviceSubscriptionState.page,
            limit: serviceSubscriptionState.limit,
            filter: { ...serviceSubscriptionState.filter },
        })
        // eslint-disable-next-line
    }, [serviceSubscriptionState.filter])

    const handleInputChange = (value: string) => {
        // setFilterAction({
        //     ...serviceSubscriptionState.filter,
        //     searchQuery: value,
        // })
        setSearchString(value.toLocaleLowerCase().trim())
    }

    const handleSelectChange = (value: string) => {
        setFilterAction({
            ...serviceSubscriptionState.filter,
            sortOrder: value,
        })
    }

    return (
        <div>
            <ListTitle
                pageName={t('LIST_SERVICE_SUBSCRIPTION')}
                addButton={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size={screens.lg ? 'large' : 'middle'}
                        className="max-[470px]:px-2"
                        onClick={() => {
                            router.push('/service-subscription/create')
                        }}
                    >
                        {t('ADD_NEW')}
                    </Button>
                }
                defaultSort={serviceSubscriptionState.filter?.sortOrder}
                onChangeInput={handleInputChange}
                onChangeSelect={handleSelectChange}
            />
            <div className="p-6 max-sm:px-0">
                <ServiceSubscriptionList />
            </div>
        </div>
    )
}

export default withAuthAdmin(ServiceSubscription)
