import { VoteProposalOption } from '@/constants/resolution'
import { post } from '@/services/fetcher'
import { ICandidate } from '@/stores/board-meeting/types'

const serviceCandidate = {
    voteCandidateBoardMtg: async (candidateId: number, option: VoteProposalOption) => {
        const response = await post<ICandidate>(
            `candidates/vote-board/${candidateId}?result=${option}`,
        )
        return response.data
    },
    voteCandidateShareholderMtg: async (candidateId: number, option: VoteProposalOption) => {
        const response = await post<ICandidate>(
            `candidates/vote-shareholder/${candidateId}?result=${option}`
        )
        return response.data
    }

}

export default serviceCandidate
