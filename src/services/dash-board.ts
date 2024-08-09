import { IMeeting } from '@/stores/meeting/types';
import { IGetAllMeetingInDayPayload, IGetAllDataRequest } from './request.type';
import { IGetAllDataReponse, IStatisticMeetingInMonthResponse, ISystemNotificationResponse } from './response.type';
import { get } from './fetcher';



const serviceDashBoard = {
    getAllMeetingInDay: async ({
        page,
        limit,
        date, 
    }: IGetAllMeetingInDayPayload): Promise<IGetAllDataReponse<IMeeting>> => {
        const payload = { page, limit, date }
        const response: {data: IGetAllDataReponse<IMeeting>} = await get(
            '/dash-board/meeting-in-day',
            payload,
        )

        return response.data
    },
    getStatisticMeetingInMonth: async ({
        date
    }:{date:Date}): Promise<IStatisticMeetingInMonthResponse> =>{
        const payload = { date }
        const response: {data: IStatisticMeetingInMonthResponse} = await get<IStatisticMeetingInMonthResponse>('/dash-board/meeting-in-month/statistics',payload)
        return response.data
    },

    getSystemNotification: async ({
        page,
        limit,
    }:IGetAllDataRequest):Promise<IGetAllDataReponse<ISystemNotificationResponse>> => {
        const payload = {page,limit}
        const response: {data: IGetAllDataReponse<ISystemNotificationResponse>} = await get(
            '/dash-board/system-notification',
            payload
        )
        return response.data
    }

}


export default serviceDashBoard