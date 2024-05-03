import { post } from './fetcher'
import { VoteProposalOption } from '@/constants/resolution'
import { IBoardProposal, IProposal } from '@/stores/meeting/types'

const serviceProposal = {
    voteProposal: async (proposalId: number, option: VoteProposalOption) => {
        const response = await post<IProposal>(
            `/proposals/vote/${proposalId}?result=${option}`,
        )
        return response.data
    },
    voteProposalBoardMtg: async (
        proposalId: number,
        option: VoteProposalOption,
    ) => {
        const response = await post<IBoardProposal>(
            `/proposals/vote-boardMtg/${proposalId}?result=${option}`,
        )
        return response.data
    },
}

export default serviceProposal
