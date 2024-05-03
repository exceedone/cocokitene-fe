import {
    IGetAllDataReponse,
    IListRoleMtgResponse,
    IRoleMtgDetailResponse,
} from '@/services/response.type'
import { get, patch, post } from '@/services/fetcher'
import { IGetAllRoleMtgQuery } from '@/stores/setting-role-mtg/type'
import {
    ICreateRoleMtgPayload,
    IUpdateRoleMtgPayload,
} from '@/services/request.type'

const serviceSettingRoleMtg = {
    getAllRoleMtgs: async ({
        page,
        limit,
        searchQuery,
    }: IGetAllRoleMtgQuery): Promise<
        IGetAllDataReponse<IListRoleMtgResponse>
    > => {
        const payload = { page, limit, searchQuery }
        const response: { data: IGetAllDataReponse<IListRoleMtgResponse> } =
            await get('/role-mtgs', payload)
        return response.data
    },

    createRoleMtg: async (payload: ICreateRoleMtgPayload) => {
        const response = await post<any>('/role-mtgs', payload)
        return response.data
    },

    updateRoleMtg: async (
        roleMtgId: number,
        payload: IUpdateRoleMtgPayload,
    ) => {
        const response = await patch<any>(`/role-mtgs/${roleMtgId}`, payload)
        return response.data
    },
    getDetailRoleMtg: async (roleMtgId: number) => {
        const response = await get<IRoleMtgDetailResponse>(
            `/role-mtgs/${roleMtgId}`,
        )
        return response.data
    },
}

export default serviceSettingRoleMtg
