import {
    MeetingStatus,
    MeetingStatusColor,
    MeetingStatusName,
    MeetingType,
} from '@/constants/meeting'
import { Permissions } from '@/constants/permission'
import { useAuthLogin } from '@/stores/auth/hooks'
import { useCheckDataMeeting } from '@/stores/check-data-meeting/hooks'
import { enumToArray } from '@/utils'
import { checkPermission } from '@/utils/auth'
import { formatTimeMeeting } from '@/utils/date'
import { truncateString } from '@/utils/format-string'
import { IMeetingItem } from '@/views/meeting/meeting-list/type'
import { CheckOutlined, CopyTwoTone, EyeTwoTone } from '@ant-design/icons'
import { Badge, Button, Col, Row, Tooltip, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const { Text } = Typography

const ItemPastMeeting = ({
    meetings_id,
    meetings_title,
    meetings_start_time,
    meetings_end_time,
    meetings_meeting_link,
    meetings_status,
    meetings_note,
    transaction_contract_address,
    transaction_key_query,
}: IMeetingItem) => {
    const t = useTranslations()
    const router = useRouter()

    const [copySuccess, setCopySuccess] = useState<boolean>()

    const { setInfoCheckMeeting, setOpenModalCheck } = useCheckDataMeeting()

    const { authState } = useAuthLogin()
    const permissionDetail = checkPermission(
        authState.userData?.permissionKeys,
        Permissions.DETAIL_MEETING,
    )

    const permissionCheckData =
        !!transaction_key_query && !!transaction_contract_address

    const copyToClipboard = async () => {
        if (transaction_key_query) {
            try {
                if (window.isSecureContext && navigator.clipboard) {
                    await navigator.clipboard.writeText(transaction_key_query)
                } else {
                    const textArea = document.createElement('textarea')
                    textArea.value = transaction_key_query
                    document.body.appendChild(textArea)
                    textArea.focus()
                    textArea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textArea)
                }
                setCopySuccess(true)
                // Reset the message after 1,5 second
                setTimeout(() => setCopySuccess(false), 1500)
            } catch (error) {
                console.log('Failed to copy text:', error)
            }
        }
    }

    return (
        <Row
            className="border-true-gray-300 m-0 mb-2 rounded-lg border p-2"
            gutter={[16, 16]}
        >
            <Col span={6} className="flex items-center space-x-2 px-0">
                <Image
                    src="/images/logo-meeting-future.png"
                    alt="service-image-alt"
                    width={72}
                    height={48}
                />
                <Text>
                    {formatTimeMeeting(
                        meetings_start_time.toString(),
                        meetings_end_time.toString(),
                    )}
                </Text>
            </Col>
            <Col span={5} className="flex items-center">
                <Tooltip
                    placement="topLeft"
                    title={
                        meetings_note && (
                            <>
                                {truncateString({
                                    text: meetings_note,
                                    start: 200,
                                    end: 0,
                                })
                                    .split('\n')
                                    .map((text, index) => (
                                        <div key={index}>{text}</div>
                                    ))}
                            </>
                        )
                    }
                    overlayClassName="lg:max-2xl:max-w-[370px] 2xl:max-w-[500px]"
                    color={'rgba(81, 81, 229, 1)'}
                >
                    {/* <Text className="overflow-hidden overflow-ellipsis whitespace-nowrap "> */}
                    <Text className="line-clamp-2">{meetings_title}</Text>
                </Tooltip>
            </Col>
            <Col span={4} xl={5} className="my-auto h-full p-1">
                <div className="flex justify-around gap-5 max-xl:flex-col max-xl:items-center max-xl:gap-1">
                    {transaction_key_query && (
                        <div className="flex items-center gap-[2px]">
                            <Text className="xl:break-keep">
                                {transaction_key_query}
                            </Text>
                            {copySuccess ? (
                                <CheckOutlined
                                    style={{
                                        color: '#03fc3d',
                                        fontSize: '18px',
                                    }}
                                />
                            ) : (
                                <CopyTwoTone
                                    className="cursor-pointer"
                                    twoToneColor="#5151e5"
                                    style={{ fontSize: '18px' }}
                                    onClick={copyToClipboard}
                                />
                            )}
                        </div>
                    )}
                    {transaction_contract_address && (
                        <Link
                            href={`${process.env.NEXT_PUBLIC_TRANSACTION_LINK}${transaction_contract_address}${process.env.NEXT_PUBLIC_PROXY_CONTRACT}`}
                            target="_blank"
                            className="inline"
                        >
                            <span className="break-words text-blue-500 hover:underline">
                                {t('TRANSACTION_LINK')}
                            </span>
                        </Link>
                    )}
                </div>
            </Col>
            <Col span={2} className="flex items-center">
                <Link
                    href={meetings_meeting_link.toString()}
                    passHref
                    legacyBehavior
                >
                    <a target="_blank" rel="noopener noreferrer">
                        <div className="text-blue-500 hover:underline">
                            {t('MEETING_LINKS')}
                        </div>
                    </a>
                </Link>
            </Col>
            <Col span={3} xl={2} className="flex items-center px-0">
                {enumToArray(MeetingStatus).map((status, key) => {
                    if (status === meetings_status) {
                        return (
                            <Badge
                                color={MeetingStatusColor[status]}
                                text={t(MeetingStatusName[status])}
                                className="mx-auto"
                                key={key}
                            />
                        )
                    }
                })}
            </Col>
            <Col
                span={2}
                className="flex items-center justify-center space-x-2 px-1"
            >
                {permissionCheckData && (
                    <Button
                        className="w-[62px] px-0 xl:w-[73px]"
                        type="primary"
                        // icon={<PlusOutlined />}
                        // size="Default"
                        onClick={() => {
                            setOpenModalCheck(true)
                            setInfoCheckMeeting(
                                meetings_id,
                                meetings_title,
                                MeetingType.SHAREHOLDER_MEETING,
                            )
                        }}
                    >
                        {t('CHECK_DATA')}
                    </Button>
                )}
            </Col>
            <Col
                span={2}
                className="flex items-center justify-end pr-3 2xl:pr-7"
            >
                {permissionDetail && (
                    <EyeTwoTone
                        style={{ fontSize: '18px' }}
                        twoToneColor="#5151e5"
                        onClick={() => {
                            router.push(`/meeting/detail/${meetings_id}`)
                        }}
                    />
                )}
            </Col>
        </Row>
    )
}

export default ItemPastMeeting
