import ParticipantList from '@/components/participants-detail/participant-list'
import { Typography } from 'antd'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'
import { convertSnakeCaseToTitleCase } from '@/utils/format-string'

const { Text } = Typography

export interface IParticipantsView {
    defaultAvatarHashColor: string
    avatar?: string
    email: string
    joined: boolean
    status?: UserMeetingStatusEnum
    shareQuantity?: number | null
}

interface IParticipantDetail {
    title: string
    participantList: IParticipantsView[]
    isLoading: boolean
}

const ParticipantDetail = ({
    title,
    participantList,
    isLoading,
}: IParticipantDetail) => {
    return (
        <div className={`flex  flex-col gap-4`}>
            <Text className="text-sm">
                {convertSnakeCaseToTitleCase(title)}
            </Text>

            <ParticipantList
                participantList={participantList}
                isLoading={isLoading}
            />
        </div>
    )
}

export default ParticipantDetail
