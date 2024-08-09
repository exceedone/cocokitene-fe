import { ISystemNotificationResponse } from '../response.type';
import { IGetAllDataRequest, ISystemNotification } from './../request.type';
import { get, patch, post } from "./fetcher-system"
import { IGetAllDataReponse, IStatisticCompanyResponse } from "./response.type"


const serviceDashBoard = {
    getStatistical: async (): Promise<IStatisticCompanyResponse> => {
        const response:{data: IStatisticCompanyResponse} = await get<IStatisticCompanyResponse>('/system-admin/statistical')

        return response.data
    },

    getSystemNotification: async ({
        page,
        limit,
    }:IGetAllDataRequest):Promise<IGetAllDataReponse<ISystemNotificationResponse>> => {
        const payload = {page,limit}
        const response: {data: IGetAllDataReponse<ISystemNotificationResponse>} = await get(
            '/system-admin/system-notification',
            payload
        )
        return response.data
    },

    createSystemNotification: async (payload: ISystemNotification) => {
        const response = await post<any>('/system-admin/system-notification',payload)
        return response.data
    },

    updateSystemNotification: async (sysNotificationId : number , payload: ISystemNotification) => {
        const response = await patch<any>(`/system-admin/system-notification/${sysNotificationId}`, payload)
        return response.data
    },
}

export default serviceDashBoard