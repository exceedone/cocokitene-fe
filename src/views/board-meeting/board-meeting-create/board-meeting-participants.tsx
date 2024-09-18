import { useTranslations } from 'next-intl'
import { useCreateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import BoxArea from '@/components/box-area'
import ParticipantSelector, {
    IParticipants,
} from '@/components/participant-selector'
import { useEffect, useState } from 'react'
import serviceRoleMtg from '@/services/role-mtg'
import { TypeRoleMeeting } from '@/constants/role-mtg'
import { convertSnakeCaseToTitleCase } from '@/utils/format-string'
import { MeetingRole } from '@/stores/attendance/type'
import { useAuthLogin } from '@/stores/auth/hooks'

export interface IRoleBoardMtg {
    id: number
    roleName: string
    description: string
}

const BoardMeetingParticipants = () => {
    const t = useTranslations()
    const { authState } = useAuthLogin()
    const [data, setData] = useCreateBoardMeetingInformation()
    const [roleBoardMtgList, setRoleBoardMtgList] = useState<IRoleBoardMtg[]>(
        [],
    )
    useEffect(() => {
        const fetchInitialData = async () => {
            const roleBoardMtgList = await serviceRoleMtg.getAllRoleMtg({
                page: 1,
                limit: 10,
                type: TypeRoleMeeting.BOARD_MEETING,
            })
            if (roleBoardMtgList) {
                setRoleBoardMtgList(roleBoardMtgList)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const roleMtgHost = roleBoardMtgList.find(
            (roleMtg) =>
                roleMtg.roleName.toUpperCase() ==
                MeetingRole.HOST.toUpperCase(),
        )
        if (roleMtgHost && authState.userData) {
            setData({
                ...data,
                participants: [
                    ...data.participants,
                    {
                        roleMtgId: roleMtgHost.id,
                        roleName: roleMtgHost.roleName,
                        userParticipant: [
                            {
                                users_id: authState.userData.id,
                                users_email: authState.userData.email,
                                users_defaultAvatarHashColor:
                                    authState.userData.defaultAvatarHashColor,
                                disable_delete: true,
                            },
                        ],
                    },
                ],
            })
        }
        // eslint-disable-next-line
    }, [roleBoardMtgList, authState])

    const onSelect =
        (key: string, roleMtgId: number) => (participant: IParticipants) => {
            if (
                data.participants.some(
                    (participant) => participant.roleName == key,
                )
            ) {
                const isNotExisted = data.participants
                    .find((item) => item.roleName === key)
                    ?.userParticipant.some(
                        (user) => user.users_id === participant.users_id,
                    )

                if (!isNotExisted) {
                    const updatedParticipants = data.participants.map(
                        (item) => {
                            if (item.roleName === key) {
                                return {
                                    ...item,
                                    userParticipant: [
                                        ...item.userParticipant,
                                        participant,
                                    ],
                                }
                            }
                            return item
                        },
                    )
                    setData({
                        ...data,
                        participants: [...updatedParticipants],
                    })
                }
            } else {
                setData({
                    ...data,
                    participants: [
                        ...data.participants,
                        {
                            roleMtgId: roleMtgId,
                            roleName: key,
                            userParticipant: [participant],
                        },
                    ],
                })
            }
        }
    const onSelectAll =
        (key: string, roleMtgId: number) => (participants: IParticipants[]) => {
            if (
                data.participants.some(
                    (participant) => participant.roleName == key,
                )
            ) {
                const updatedParticipants = data.participants.map(
                    (participant) => {
                        if (participant.roleName === key) {
                            return {
                                ...participant,
                                userParticipant: participants.map(
                                    (participant) => ({
                                        ...participant,
                                        disable_delete:
                                            key.toLocaleUpperCase() ==
                                                MeetingRole.HOST.toLocaleUpperCase() &&
                                            participant.users_id ==
                                                authState.userData?.id,
                                    }),
                                ),
                            }
                        }
                        return participant
                    },
                )
                setData({
                    ...data,
                    participants: updatedParticipants,
                })
            } else {
                setData({
                    ...data,
                    participants: [
                        ...data.participants,
                        {
                            roleMtgId: roleMtgId,
                            roleName: key,
                            userParticipant: [...participants],
                        },
                    ],
                })
            }
        }
    const onDelete = (key: string) => (participant: IParticipants) => {
        if (
            key.toUpperCase() !== MeetingRole.HOST.toUpperCase() ||
            participant.users_id !== authState.userData?.id
        ) {
            const updatedParticipants = data.participants.map((item) => {
                if (item.roleName == key) {
                    return {
                        ...item,
                        userParticipant: item.userParticipant.filter(
                            (user) => user.users_id !== participant.users_id,
                        ),
                    }
                }
                return item
            })
            setData({
                ...data,
                participants: updatedParticipants,
            })
        }
    }

    return (
        <BoxArea title={t('PARTICIPANTS')}>
            <div
                className={`grid min-h-[220px] grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${
                    roleBoardMtgList.length > 4 ? 4 : roleBoardMtgList.length
                } xl:grid-cols-${
                    roleBoardMtgList.length > 5 ? 5 : roleBoardMtgList.length
                } `}
            >
                {roleBoardMtgList?.map((roleBoardMtg) => {
                    return (
                        <ParticipantSelector
                            key={roleBoardMtg.id}
                            title={convertSnakeCaseToTitleCase(
                                roleBoardMtg.roleName,
                            )}
                            roleName={roleBoardMtg.roleName}
                            type={TypeRoleMeeting.BOARD_MEETING}
                            selectedParticipants={data.participants?.filter(
                                (participant) =>
                                    participant.roleName ==
                                    roleBoardMtg.roleName,
                            )}
                            onSelectParticipant={onSelect(
                                roleBoardMtg.roleName,
                                roleBoardMtg.id,
                            )}
                            onSelectAllParticipants={onSelectAll(
                                roleBoardMtg.roleName,
                                roleBoardMtg.id,
                            )}
                            onDeleteParticipant={onDelete(
                                roleBoardMtg.roleName,
                            )}
                        />
                    )
                })}
            </div>
        </BoxArea>
    )
}

export default BoardMeetingParticipants
