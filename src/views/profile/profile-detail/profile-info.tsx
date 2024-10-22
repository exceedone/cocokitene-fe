import { useTranslations } from 'next-intl'
import { IRowMyInforInfo, RowMyInforInfo } from './profile-rowinfo'
import { Avatar, Col, Row } from 'antd'
import {
    UserStatus,
    UserStatusColor,
    UserStatusName,
} from '@/constants/user-status'
import Color from 'color'
import { AvatarBgHexColors } from '@/constants/common'
import { getFirstCharacterUpperCase } from '@/utils/get-first-character'
import RoleInfo from '@/components/role-info'
import { IAccountDetail } from '@/stores/account/type'

interface IProfileDetail {
    data: IAccountDetail | undefined
}

const MyProfileInfo = ({ data }: IProfileDetail) => {
    const t = useTranslations()

    const backgroundAvatarColor = Color(
        data?.defaultAvatarHashColor || AvatarBgHexColors.GOLDEN_PURPLE,
    )
        .lighten(0.6)
        .hex()

    const dataAccountDetailLeft: IRowMyInforInfo[] = [
        {
            label: 'COMPANY',
            content: (
                <p className="flex-1 break-words">{data?.companyName || ''}</p>
            ),
            lg: 6,
        },
        {
            label: 'PHONE',
            content: <p className="flex-1 break-all">{data?.phone || ''}</p>,
            lg: 6,
        },
        {
            label: 'ROLE',
            content: (
                <div className="mt-[-2px] flex flex-wrap gap-1 truncate hover:text-clip">
                    {data?.roles.map((item) => (
                        <RoleInfo key={item.id} roleName={item.roleName} />
                    ))}
                </div>
            ),
            lg: 6,
        },
        {
            label: 'WALLET_ADDRESS',
            content: (
                <p className="flex-1 break-all">{data?.walletAddress || ''}</p>
            ),
            lg: 6,
        },
    ]

    const dataAccountDetailRight: IRowMyInforInfo[] = [
        {
            label: 'USERNAME',
            content: data?.userName && (
                <div
                    className={`mt-[-1px] flex flex-wrap content-start items-center gap-[4px]`}
                >
                    {data?.avatar ? (
                        <Avatar
                            src={
                                process.env.NEXT_PUBLIC_PRE_URL_S3_LINK +
                                data.avatar
                            }
                            alt="avatar-alt"
                            size="small"
                            style={{
                                verticalAlign: 'middle',
                            }}
                        />
                    ) : (
                        <Avatar
                            style={{
                                backgroundColor: backgroundAvatarColor,
                                verticalAlign: 'middle',
                                color:
                                    data?.defaultAvatarHashColor ||
                                    AvatarBgHexColors.GOLDEN_PURPLE,
                            }}
                            size="small"
                        >
                            {getFirstCharacterUpperCase(data.userName)}
                        </Avatar>
                    )}
                    <span className="flex-1">{data.userName}</span>
                </div>
            ),
            lg: 3,
        },

        {
            label: 'EMAIL',
            content: <p className="flex-1 break-all">{data?.email || ''}</p>,
            lg: 3,
        },
        {
            label: 'STATUS',
            content: (
                <div className="ml-[2px] flex flex-wrap content-start items-center gap-1 text-sm text-black/[85%]">
                    {data?.userStatus && (
                        <>
                            <div
                                className={`h-[6px] w-[6px] rounded-full  ${
                                    data?.userStatus == UserStatus.ACTIVE
                                        ? 'bg-green-500'
                                        : data?.userStatus ==
                                          UserStatus.INACTIVE
                                        ? 'bg-red-500'
                                        : null
                                } `}
                            ></div>
                            <span
                                style={{
                                    color: UserStatusColor[data?.userStatus],
                                }}
                            >
                                {t(UserStatusName[data?.userStatus])}
                            </span>
                        </>
                    )}
                </div>
            ),
            lg: 3,
        },
    ]

    return (
        <div className="bg-white p-6 px-6 py-4 shadow-01">
            <Row gutter={[16, 0]}>
                <Col xs={24} lg={12} span={24}>
                    {dataAccountDetailLeft.map((item, index) => {
                        return (
                            <Col key={index} className="max-sm:px-0">
                                <RowMyInforInfo
                                    label={t(item.label)}
                                    content={item.content}
                                />
                            </Col>
                        )
                    })}
                </Col>
                <Col xs={24} lg={12} span={24}>
                    {dataAccountDetailRight.map((item, index) => {
                        return (
                            <Col key={index} className="max-sm:px-0">
                                <RowMyInforInfo
                                    label={t(item.label)}
                                    content={item.content}
                                />
                            </Col>
                        )
                    })}
                </Col>
            </Row>
        </div>
    )
}

export default MyProfileInfo
