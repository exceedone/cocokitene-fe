import { Avatar, Col, Row, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Color from 'color'

import BoxArea from '@/components/box-area'
import { useCompanyDetail } from '@/stores/company/hooks'
import { IRowInfo, RowInfo } from './row-info'
import { AvatarBgHexColors } from '@/constants/common'
import { getFirstCharacterUpperCase } from '@/utils/get-first-character'
import { UserStatus } from '@/constants/user-status'

const { Text } = Typography

const backgroundAvatarColor = Color(AvatarBgHexColors.GOLDEN_PURPLE)
    .lighten(0.6)
    .hex()

const SuperAdminInfo = () => {
    const t = useTranslations()
    const [{ company }] = useCompanyDetail()

    const dataSuperAdminInfo: IRowInfo[] = [
        {
            label: 'USERNAME',
            content: company?.superAdminInfo?.username && (
                <div
                    className={`flex flex-nowrap content-start items-center gap-[4px]`}
                >
                    <Avatar
                        style={{
                            backgroundColor: backgroundAvatarColor,
                            verticalAlign: 'middle',
                            color: AvatarBgHexColors.GOLDEN_PURPLE,
                        }}
                        size="small"
                        className="mb-auto"
                    >
                        {getFirstCharacterUpperCase(
                            company?.superAdminInfo?.username,
                        )}
                    </Avatar>
                    <Text className="flex-1">
                        {company?.superAdminInfo?.username}
                    </Text>
                </div>
            ),
        },
        {
            label: 'WALLET_ADDRESS',
            content: company?.superAdminInfo?.walletAddress && (
                <Text className="">
                    {company?.superAdminInfo?.walletAddress}
                </Text>
            ),
        },
        {
            label: 'STATUS',
            content: (
                <div className="ml-[2px] flex flex-wrap content-start items-center gap-1 text-sm text-black/[85%]">
                    <div
                        className={`h-[6px] w-[6px] rounded-full  ${
                            company?.superAdminInfo?.userStatus?.status ==
                            UserStatus.ACTIVE
                                ? 'bg-green-300'
                                : company?.superAdminInfo?.userStatus?.status ==
                                  UserStatus.INACTIVE
                                ? 'bg-red-500'
                                : null
                        } `}
                    ></div>
                    <Text>
                        {company?.superAdminInfo?.userStatus?.status ==
                        UserStatus.ACTIVE
                            ? t('ACTIVE')
                            : company?.superAdminInfo?.userStatus?.status ==
                              UserStatus.INACTIVE
                            ? t('INACTIVE')
                            : null}
                    </Text>
                </div>
            ),
        },
        {
            label: 'EMAIL',
            content: (
                <Text className="flex-1 break-all">
                    {company?.superAdminInfo?.email}
                </Text>
            ),
        },
    ]

    return (
        <div>
            <BoxArea title={t('SUPER_ADMIN_INFORMATION')}>
                <Row gutter={[16, 0]} className="">
                    {dataSuperAdminInfo.map((item) => {
                        return (
                            <Col xs={24} lg={12} key={item.label}>
                                <RowInfo
                                    label={t(item.label)}
                                    content={item.content}
                                />
                            </Col>
                        )
                    })}
                </Row>
            </BoxArea>
        </div>
    )
}

export default SuperAdminInfo
