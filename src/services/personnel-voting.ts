import { post } from "./fetcher";
import { IVotedCandidateInPersonnel } from "./request.type";
import { IPersonnelVoting } from "./response.type";



const servicePersonnelVoting = {
    voteCandidateInPersonnelVote: async (personnelId: number , payload:IVotedCandidateInPersonnel) => {
        console.log('payload: ', payload)
        
        const response = await post<IPersonnelVoting>(
            `personnel-voting/vote/${personnelId}`, payload)
        
        return response.data
    }
}

export default servicePersonnelVoting