import { patch, get } from './fetcher'
import { IAccountDetailResponse, IUpdateProfile } from './response.type'

const serviceProfile = {
    getDetailProfile: async (accountId: number) => {
        const response = await get<IAccountDetailResponse>(
            `/users/profile/${accountId}`,
        )
        return response.data
    },
    updateProfile: async (id: number, payload: IUpdateProfile) => {
        const response = await patch<any>(`/users/profile/${id}`, payload)
        return response.data
    },
}

export default serviceProfile
