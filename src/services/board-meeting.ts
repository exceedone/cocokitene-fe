import {
    ICreateBoardMeetingPayload,
    IUpdateBoardMeetingPayload,
} from '@/services/request.type'
import { get, patch, post } from './fetcher'
import { IGetAllMeetingQuery, IMeeting } from '@/stores/meeting/types'
import {
    IBoardMeetingDetailResponse,
    IGetAllDataReponse,
} from '@/services/response.type'

const serviceBoardMeeting = {
    getAllMeetings: async ({
        page,
        limit,
        type,
        filter,
        meetingType,
    }: IGetAllMeetingQuery): Promise<IGetAllDataReponse<IMeeting>> => {
        const payload = { page, limit, type, meetingType, ...filter }
        const response: { data: IGetAllDataReponse<IMeeting> } = await get(
            '/board-meetings',
            payload,
        )
        return response.data
    },
    createBoardMeeting: async (payload: ICreateBoardMeetingPayload) => {
        const response = await post<any>('/board-meetings', payload)
        return response.data
    },

    getDetailBoardMeeting: async (boardMeetingId: number) => {
        const response = await get<IBoardMeetingDetailResponse>(
            `/board-meetings/${boardMeetingId}`,
        )
        return response.data
    },

    updateBoardMeeting: async (
        boardMeetingId: number,
        payload: IUpdateBoardMeetingPayload,
    ) => {
        const response = await patch<any>(
            `board-meetings/${boardMeetingId}`,
            payload,
        )
        return response.data
    },
}

export default serviceBoardMeeting
