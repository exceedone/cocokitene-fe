import { useTranslations } from 'next-intl'
import { useShareholderDetail } from '@/stores/shareholder/hook'
import Color from 'color'
import { AvatarBgHexColors } from '@/constants/common'
import {
    IRowShareholderInfo,
    RowShareholderInfo,
} from '@/views/shareholder/shareholder-detail/shareholder-rowinfo'
import RoleInfo from '@/components/role-info'
import { Avatar, Col, Row, Typography } from 'antd'
import { getFirstCharacterUpperCase } from '@/utils/get-first-character'
import {
    UserStatus,
    UserStatusColor,
    UserStatusName,
} from '@/constants/user-status'

const { Text } = Typography

const ShareholderInfo = () => {
    const t = useTranslations()
    const [{ shareholder }] = useShareholderDetail()

    const backgroundAvatarColor = Color(
        shareholder?.defaultAvatarHashColor || AvatarBgHexColors.GOLDEN_PURPLE,
    )
        .lighten(0.6)
        .hex()
    const dataShareholderDetailLeft: IRowShareholderInfo[] = [
        {
            label: 'COMPANY_NAME',
            content: (
                <Text className="flex-1 break-words">
                    {shareholder?.companyName || ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: 'PHONE',
            content: (
                <Text className="flex-1 break-all">
                    {shareholder?.phone || ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: 'ROLE',
            content: (
                <div className="mt-[-2px] flex flex-wrap gap-1">
                    {shareholder?.roles.map((item) => (
                        <RoleInfo key={item.id} roleName={item.roleName} />
                    ))}
                </div>
            ),
            lg: 6,
        },
        {
            label: 'WALLET_ADDRESS',
            content: (
                <Text className="flex-1 break-all">
                    {shareholder?.walletAddress || ''}
                </Text>
            ),
            lg: 6,
        },
    ]

    const dataShareholderDetailRight: IRowShareholderInfo[] = [
        {
            label: 'SHAREHOLDER_NAME',
            content: shareholder?.userName && (
                <div
                    className={`mt-[-1px] flex flex-wrap content-start items-center gap-[4px]`}
                >
                    {shareholder?.avatar ? (
                        <Avatar
                            src={shareholder.avatar}
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
                                    shareholder?.defaultAvatarHashColor ||
                                    AvatarBgHexColors.GOLDEN_PURPLE,
                            }}
                            size="small"
                        >
                            {getFirstCharacterUpperCase(shareholder.userName)}
                        </Avatar>
                    )}
                    <Text className="flex-1">{shareholder.userName}</Text>
                </div>
            ),
            lg: 6,
        },
        {
            label: 'EMAIL',
            content: (
                <Text className="flex-1 break-all">
                    {shareholder?.email || ''}
                </Text>
            ),
            lg: 6,
        },
        {
            label: 'SHARES_QUANTITY',
            content: (
                <p className="flex-1">{shareholder?.shareQuantity || ''}</p>
            ),
            lg: 6,
        },
        {
            label: 'STATUS',
            content: (
                <div className="ml-[2px] flex flex-wrap content-start items-center gap-1 text-sm text-black/[85%]">
                    {shareholder?.userStatus && (
                        <>
                            <div
                                className={`h-[6px] w-[6px] rounded-full  ${
                                    shareholder?.userStatus == UserStatus.ACTIVE
                                        ? 'bg-green-500'
                                        : shareholder?.userStatus ==
                                          UserStatus.INACTIVE
                                        ? 'bg-red-500'
                                        : null
                                } `}
                            ></div>
                            <span
                                style={{
                                    color: UserStatusColor[
                                        shareholder?.userStatus
                                    ],
                                }}
                            >
                                {t(UserStatusName[shareholder?.userStatus])}
                            </span>
                        </>
                    )}
                </div>
            ),
            lg: 6,
        },
    ]
    return (
        <div className="bg-white p-6 px-6 py-4 shadow-01 max-[470px]:px-2">
            <Row gutter={[16, 0]} className="">
                <Col xs={24} lg={12} span={24}>
                    {dataShareholderDetailLeft.map((item, index) => {
                        return (
                            <Col key={index} className="max-sm:px-0">
                                <RowShareholderInfo
                                    label={t(item.label)}
                                    content={item.content}
                                    xs={item?.xs}
                                    lg={item?.lg}
                                />
                            </Col>
                        )
                    })}
                </Col>

                <Col xs={24} lg={12} span={24}>
                    {dataShareholderDetailRight.map((item, index) => {
                        return (
                            <Col key={index} className="max-sm:px-0">
                                <RowShareholderInfo
                                    label={t(item.label)}
                                    content={item.content}
                                    xs={item?.xs}
                                    lg={item?.lg}
                                />
                            </Col>
                        )
                    })}
                </Col>
            </Row>
        </div>
    )
}
export default ShareholderInfo
