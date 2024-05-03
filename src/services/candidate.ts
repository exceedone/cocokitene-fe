import { VoteProposalOption } from '@/constants/resolution'
import { post } from '@/services/fetcher'
import { ICandidate } from '@/stores/board-meeting/types'

const serviceCandidate = {
    voteCandidate: async (candidateId: number, option: VoteProposalOption) => {
        const response = await post<ICandidate>(
            `candidates/vote/${candidateId}?result=${option}`,
        )
        return response.data
    },
}

export default serviceCandidate
