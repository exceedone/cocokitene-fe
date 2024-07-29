import DetailTitle from '@/components/content-page-title/detail-title'
import Loader from '@/components/loader'
import { useAuthLogin } from '@/stores/auth/hooks'
import { EditOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MyProfileInfo from './profile-info'
import withAuth from '@/components/component-auth'
import { Permissions } from '@/constants/permission'
import { checkPermission } from '@/utils/auth'
import { IAccountDetail } from '@/stores/account/type'
import serviceProfile from '@/services/profile'

const MyProfileDetail = () => {
    const router = useRouter()
    const t = useTranslations()

    const { authState } = useAuthLogin()

    const [profile, setProfile] = useState<IAccountDetail>()

    const permissionEditProfile = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.BASIC_PERMISSION,
    )

    useEffect(() => {
        const fetchProfile = async (id: number) => {
            const detailProfile = await serviceProfile.getDetailProfile(id)
            if (detailProfile) {
                setProfile({
                    userName: detailProfile.username,
                    email: detailProfile.email,
                    walletAddress: detailProfile.walletAddress,
                    shareQuantity: detailProfile.shareQuantity,
                    phone: detailProfile.phone,
                    avatar: detailProfile.avatar,
                    defaultAvatarHashColor:
                        detailProfile.defaultAvatarHashColor,
                    companyId: detailProfile.company.id,
                    companyName: detailProfile.company.companyName,
                    userStatusId: detailProfile.userStatus.status,
                    userStatus: detailProfile.userStatus.status,
                    roles: detailProfile.roles,
                } as unknown as IAccountDetail)
            }
        }

        if (authState.userData?.id) {
            fetchProfile(authState.userData.id)
        }
    }, [authState.userData?.id])

    if (!profile) {
        return <Loader />
    }

    return (
        <div>
            <DetailTitle
                urlBack="/dashboard"
                pageName={t('MY_PROFILE')}
                editButton={
                    permissionEditProfile && (
                        <Button
                            icon={<EditOutlined />}
                            type="default"
                            size="large"
                            onClick={() => router.push('/profile/update')}
                        >
                            {t('EDIT')}
                        </Button>
                    )
                }
            />
            <div className="p-6">
                <div className="bg-white p-6 px-6 py-4 shadow-01">
                    <MyProfileInfo data={profile} />
                </div>
            </div>
        </div>
    )
}

export default withAuth(MyProfileDetail, Permissions.BASIC_PERMISSION)
