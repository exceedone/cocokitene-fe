/* eslint-disable */

import { Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useSettingRoleMtg } from '@/stores/setting-role-mtg/hook'
import Table, { ColumnsType } from 'antd/es/table'
import { IRoleMtgList } from '@/stores/setting-role-mtg/type'
import React, { useEffect } from 'react'
import {
    convertSnakeCaseToTitleCase,
    truncateString,
} from '@/utils/format-string'
import { EditTwoTone } from '@ant-design/icons'
import ModalUpdateRoleMtg from '@/views/setting-role/modal-update-role-mtg'
import withAuth from '@/components/component-auth'
import { Permissions } from '@/constants/permission'
import { TypeRoleMeeting } from '@/constants/role-mtg'
import { MeetingRole } from '@/stores/attendance/type'

const { Text } = Typography
const RoleMtgList = () => {
    const t = useTranslations()
    // const router = useRouter()
    // eslint-disable-next-line
    const {
        settingRoleMtgState,
        getListRoleMtgAction,
        setOpenModalRoleMtg,
        setOpenModalUpdatedRoleMtg,
        setIdMOpenModalUpdateRoleMtg,
    } = useSettingRoleMtg()

    // const [selectedRoleMtgId, setSelectedRoleMtgId] = useState<number>()
    useEffect(() => {
        getListRoleMtgAction({
            page: settingRoleMtgState.page,
            limit: settingRoleMtgState.limit,
            searchQuery: settingRoleMtgState.searchQuery,
        })
        // eslint-disable-next-line
    }, [settingRoleMtgState.searchQuery])

    const checkBaseRoleMtg = (roleMtg: IRoleMtgList) => {
        if (
            roleMtg.roleName.toUpperCase() === MeetingRole.HOST.toUpperCase() &&
            roleMtg.type === TypeRoleMeeting.BOTH_MEETING
        ) {
            return true
        }
        if (
            roleMtg.roleName.toUpperCase() ===
                MeetingRole.SHAREHOLDER.toUpperCase() &&
            roleMtg.type === TypeRoleMeeting.SHAREHOLDER_MEETING
        ) {
            return true
        }
        return false
    }

    const colums: ColumnsType<IRoleMtgList> = [
        {
            title: t('NO'),
            dataIndex: 'index',
            width: '5%',
            className: 'text-center',
        },
        {
            title: t('MEETING_ROLE'),
            dataIndex: 'roleName',
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <Text
                            title={record.roleName}
                            // className="cursor-pointer"
                        >
                            {convertSnakeCaseToTitleCase(record.roleName)}
                        </Text>
                    </div>
                )
            },
            width: '20%',
        },
        {
            title: t('DESCRIPTION'),
            dataIndex: 'description',
            render: (_, record) => {
                return (
                    <>
                        {truncateString({
                            text: record.description,
                            start: 50,
                            end: 3,
                        })}
                    </>
                )
            },
            width: '48%',
        },
        {
            title: t('TYPE'),
            dataIndex: 'type',
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <Text>
                            {convertSnakeCaseToTitleCase(
                                record.type === TypeRoleMeeting.NULL_MEETING
                                    ? ''
                                    : record.type,
                            )}
                        </Text>
                    </div>
                )
            },
            width: '20%',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => {
                return (
                    <div
                        className={`$ flex gap-3 ${
                            checkBaseRoleMtg(record) ? 'hidden' : ''
                        }`}
                    >
                        <EditTwoTone
                            style={{ fontSize: '18px' }}
                            twoToneColor="#5151e5"
                            onClick={() => {
                                // setSelectedRoleMtgId(record.id)
                                setIdMOpenModalUpdateRoleMtg(record.id)
                                setOpenModalUpdatedRoleMtg(true)
                            }}
                        />
                    </div>
                )
            },
            width: '7%',
        },
    ]

    const handlePageChange = (pageChange: number) => {
        getListRoleMtgAction({
            page: pageChange,
            limit: settingRoleMtgState.limit,
            searchQuery: settingRoleMtgState.searchQuery,
        })
    }
    return (
        <div>
            <div className="bg-white p-6">
                <Table
                    columns={colums}
                    dataSource={settingRoleMtgState.roleMtgList}
                    rowKey="id"
                    pagination={{
                        pageSize: settingRoleMtgState.limit,
                        defaultCurrent: settingRoleMtgState.page,
                        total: settingRoleMtgState.totalRoleMtgItem,
                        onChange: handlePageChange,
                    }}
                />
            </div>
            <ModalUpdateRoleMtg />
        </div>
    )
}

export default withAuth(RoleMtgList, Permissions.SETTING_PERMISSION_FOR_ROLES)
