import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ListTitle from '@/components/content-page-title/list-title'
import { Button, Grid, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useListAccount } from '@/stores/account/hook'
import { useAuthLogin } from '@/stores/auth/hooks'
import { checkPermission } from '@/utils/auth'
import { Permissions } from '@/constants/permission'
import withAuth from '@/components/component-auth'
import AccountList from '@/views/account/account-list'
import { CONSTANT_EMPTY_STRING } from '@/constants/common'
import { SORT } from '@/constants/meeting'
const { useBreakpoint } = Grid

const AccountView = () => {
    const t = useTranslations()
    const screens = useBreakpoint()
    const router = useRouter()
    const { accountState, getListAccountAction, setFilterAction } =
        useListAccount()
    const { authState } = useAuthLogin()
    const permissionCreateAccount = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.CREATE_ACCOUNT,
    )

    useEffect(() => {
        return () => {
            setFilterAction({
                searchQuery: CONSTANT_EMPTY_STRING,
                sortOrder: SORT.DESC,
            })
        }
    }, [setFilterAction])

    useEffect(() => {
        getListAccountAction({
            page: accountState.page,
            limit: accountState.limit,
            filter: { ...accountState.filter },
        })
        // eslint-disable-next-line
    }, [accountState.filter])

    const handleInputChange = (value: string) => {
        setFilterAction({ ...accountState.filter, searchQuery: value })
    }
    const handleSelectChange = (value: string) => {
        setFilterAction({ ...accountState.filter, sortOrder: value })
    }

    return (
        <div>
            <ListTitle
                pageName={t('LIST_ACCOUNTS')}
                addButton={
                    permissionCreateAccount && (
                        <Tooltip
                            placement="bottomRight"
                            title={
                                accountState.allowCreate
                                    ? ''
                                    : t('UNABLE_TO_CREATE_MORE')
                            }
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size={screens.lg ? 'large' : 'middle'}
                                className="max-[470px]:px-2"
                                onClick={() => {
                                    router.push('/account/create')
                                }}
                                disabled={!accountState.allowCreate}
                            >
                                {t('ADD_NEW')}
                            </Button>
                        </Tooltip>
                    )
                }
                defaultSort={accountState.filter?.sortOrder}
                onChangeInput={handleInputChange}
                onChangeSelect={handleSelectChange}
            />
            <div className="p-6 max-sm:px-0">
                <AccountList />
            </div>
        </div>
    )
}

export default withAuth(AccountView, Permissions.LIST_ACCOUNT)
