import { IParticipantsWithRole } from '@/components/participant-selector'
import { ResolutionType, VoteProposalOption } from '@/constants/resolution'
import { EActionStatus, FetchError } from '@/stores/type'
import {
    MeetingFileType,
    MeetingStatus,
    MeetingType,
} from '@/constants/meeting'
import { ElectionEnum } from '@/constants/election'
import { UserMeetingStatusEnum } from '@/stores/attendance/type'

export interface ICreateBoardMeeting {
    title: string
    meetingLink: string
    startTime: string
    endTime: string
    endVotingTime: string
    note: string
    meetingMinutes: IBoardMeetingDocument[]
    meetingInvitations: IBoardMeetingDocument[]
    managementAndFinancials: IBoardMeetingReport[]
    elections: IBoardMeetingReport[]
    candidates: IBoardMeetingExecutive[]
    participants: IParticipantsWithRole[]
}

export interface IBoardMeetingDocument {
    id?: number
    uid?: string
    url: string
    fileType: string
}
export interface IBoardProposalFile {
    id?: number
    uid?: string
    url: string
}

export interface IBoardMeetingReport {
    id?: number
    title: string
    description: string
    oldDescription?: string
    files?: IBoardProposalFile[]
    type: ResolutionType
}

export interface IBoardMeetingExecutive {
    title: string
    type: number
    candidateName: string
}

export interface ElectionResponse {
    id: number
    status: ElectionEnum
    description?: string
}

export interface ICandidate {
    id: number
    title: string
    candidateName: string
    type: number
    typeElection: ElectionResponse
    votedQuantity: number | null
    unVotedQuantity: number | null
    notVoteYetQuantity: number | null
    voteResult: VoteProposalOption
    meetingId: number
    creatorId: number
}

export interface IBoardMeetingDetail {
    id: number
    title: string
    note: string
    meetingLink: string
    startTime: string
    endTime: string
    endVotingTime: string
    status: MeetingStatus
    companyId: number
    creatorId: number
    type: MeetingType
    meetingFiles: IBoardMeetingFile[]
    proposals: IBoardMeetingProposal[]
    managementAndFinancials: IBoardMeetingReport[]
    elections: IBoardMeetingReport[]
    candidates: ICandidate[]
    participants: ParticipantDetailBoardMeeting[]
    boardsTotal: number
    boardsJoined: number
}
export interface IBoardMeetingFile {
    id: number
    url: string
    meetingId: number
    fileType: MeetingFileType
}
export interface IBoardProposalCreator {
    username: string
    email: string
    avatar: string | null
    defaultAvatarHashColor: string | null
}

export interface IBoardMeetingProposal {
    id: number
    title: string
    description: string
    oldDescription?: string
    type: ResolutionType
    votedQuantity: number | null
    unVotedQuantity: number | null
    notVoteYetQuantity: number | null
    voteResult: VoteProposalOption
    meetingId: number
    creator: IBoardProposalCreator
    proposalFiles: IBoardProposalFile[]
}

export interface ParticipantDetailBoardMeeting {
    roleMtgId: number
    roleMtgName: string
    userParticipants: IUserBoardMeeting[]
}
export interface IUserBoardMeeting {
    id: number
    status: UserMeetingStatusEnum

    userId: number
    userEmail: string
    userAvatar: string | null
    userShareQuantity: number | null
    userDefaultAvatarHashColor: string | null
}

export interface IBoardMeetingDetailState {
    status: EActionStatus
    boardMeeting: IBoardMeetingDetail | undefined
    error: FetchError | undefined
}

export interface IUpdateBoardMeeting {
    id: number
    title: string
    note: string
    status: MeetingStatus
    meetingLink: string
    startTime: string
    endTime: string
    endVotingTime: string
    meetingMinutes: IBoardMeetingDocument[]
    meetingInvitations: IBoardMeetingDocument[]
    managementAndFinancials: IBoardMeetingReport[]
    elections: IBoardMeetingReport[]
    candidates: IBoardMeetingUpdateCandidate[]
    participants: IParticipantsWithRole[]
}

export interface IUpdateBoardMeetingState {
    status: EActionStatus
    meeting: IUpdateBoardMeeting
    error: FetchError | undefined
}

export interface IBoardMeetingUpdateCandidate {
    id?: number
    title: string
    type?: number
    candidateName: string
}
