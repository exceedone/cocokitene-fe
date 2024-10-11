import { ICreateServiceSubscriptionPayload, IUpdateServiceSubscriptionPayload } from './request.type';
import { IGetAllServiceSubscriptionQuery } from "@/stores/service-subscription/type";
import { ICompanyOption, IGetAllDataReponse, IListServiceSubscription, IServiceSubscriptionDetailResponse } from "./response.type";
import { get, patch, post } from "./fetcher-system";
import { StatusSubscriptionEnum } from '@/constants/service-subscript';



const serviceSubscriptionService = {
    getAllCompanyOption: async ():Promise<ICompanyOption[]> =>{
        const response: { data: ICompanyOption[]} = await get('/system-admin/get-all-option-company')

        return response.data
    },

    getAllServicePlanOption: async ():Promise<{id:number, planName:string,price:number}[]>  => {
        const response: { data: {id:number, planName:string,price:number}[]} = await get('/system-admin/get-all-option-plan')
        return response.data
    },

    getAllServiceSubscription: async ({
        page,
        limit,
        filter,
    }: IGetAllServiceSubscriptionQuery): Promise<IGetAllDataReponse<IListServiceSubscription>> => {
        const payload = { page, limit, ...filter }
        const response: {data: IGetAllDataReponse<IListServiceSubscription>} = 
            await get('/system-admin/service-subscription',payload)

        return response.data
    },

    createServiceSubscription: async (
        payload: ICreateServiceSubscriptionPayload
    ) => {
        const response = await post<any>('/system-admin/service-subscription', payload)

        return response.data
    },

    getDetailServiceSubscription: async (
        serviceSubscriptionId: number
    ) => {
        const response = await get<IServiceSubscriptionDetailResponse>(
            `/system-admin/service-subscription/${serviceSubscriptionId}`
        )

        return response.data
    },

    updateStatusServiceSubscription: async (
        id: number,
        payload: {status: StatusSubscriptionEnum}
    ) => {
        const response = await patch<any>(`/system-admin/service-subscription/${id}/change-status`,
            payload
        )
        return response.data
    },

    applyServiceSubscriptionNow: async (
        id: number,
        payload: {status: StatusSubscriptionEnum}
    ) => {
        const response = await patch<any>(`/system-admin/service-subscription/${id}/apply-now`,
            payload
        )
        return response.data
    },

    updateServicePlanSubscription: async (
        id: number,
        payload: IUpdateServiceSubscriptionPayload,
    ) => {
        const response = await patch<any>(`/system-admin/service-subscription/${id}`,payload)

        return response.data
    }

}

export default serviceSubscriptionService