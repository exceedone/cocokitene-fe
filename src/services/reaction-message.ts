import { post } from './fetcher'
import { ICreateReactionMessagePayload } from './request.type'

const serviceReactionMesage = {
    createReactionMessage: async (payload: ICreateReactionMessagePayload) => {
        const response = await post<any>('/reaction-messages', payload)
        return response.data
    },
}

export default serviceReactionMesage
