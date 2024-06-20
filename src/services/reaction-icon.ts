import { get } from './fetcher'
import { IReactionIconResponse } from './response.type'

const serviceReactionIcon = {
    getAllReactionIcon: async (): Promise<IReactionIconResponse[]> => {
        const response = await get('/reaction-icons')
        if (response) {
            return response?.data as IReactionIconResponse[]
        }
        return []
    },
}

export default serviceReactionIcon
