import { get, patch } from './fetcher'
import { IGetAllDataRequest } from './request.type'
import {
    IAllMeetingChatInMeetingResponse,
    IGetAllDataReponse,
    ILastMessageSeen,
    IPermissionChatResponse,
    IUpdateLastMessageSeen,
    IUpdatePermissionChat,
} from './response.type'

const serviceChatMeeting = {
    //Get All chat by meetingID
    getAllMessageChatByMeetingId: async (meetingId: number) => {
        const response = await get<IAllMeetingChatInMeetingResponse>(
            `/messages/meeting/${meetingId}`,
        )
        return response.data
    },

    //Get all permission chat
    getAllPermissionChat: async ({
        page = 1,
        limit = 10,
    }: IGetAllDataRequest): Promise<IPermissionChatResponse[]> => {
        const payload = { page, limit }
        const response: { data: IGetAllDataReponse<IPermissionChatResponse> } =
            await get('/chat-permission', payload)
        return response.data.items
    },

    //Update Permission Chat
    updatePermissionChat: async (
        meetingId: number,
        payload: IUpdatePermissionChat,
    ) => {
        const response = await patch<any>(
            `/meetings/${meetingId}/changePermissionChat`,
            payload,
        )
        return response.data
    },

    //Get Last Message in Meeting Seen
    getLastMessageSeen: async (
        meetingId: number,
    ): Promise<ILastMessageSeen> => {
        const response = await get<ILastMessageSeen>(
            `/user-seen-message/meeting/${meetingId}`,
        )
        return response.data
    },

    updateLastMeetingSeen: async (
        meetingId: number,
        payload: IUpdateLastMessageSeen,
    ) => {
        const response = await patch<any>(
            `/user-seen-message/meeting/${meetingId}`,
            payload,
        )
        return response.data
    },
}

export default serviceChatMeeting
