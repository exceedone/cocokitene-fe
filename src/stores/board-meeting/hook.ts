import { IUpdateBoardMeeting } from './types'
import {
    IBoardMeetingDetail,
    IBoardProposalCreator,
    IBoardProposalFile,
    ICreateBoardMeeting,
} from '@/stores/board-meeting/types'
import { RootState, useAppDispatch, useAppSelector } from '@/stores'
import { useCallback } from 'react'
import {
    resetCreateBoardMeetingData,
    updateCreateBoardMeetingInformation,
} from '@/stores/board-meeting/createSlice'
import { EActionStatus } from '@/stores/type'
import { getBoardMeetingDetail } from '@/stores/board-meeting/detailSlice'
import { BoardMeetingResource } from '@/views/board-meeting/board-meeting-detail/board-meeting-documents'
import { MeetingFileType } from '@/constants/meeting'
import { getFileTypeByUrl } from '@/utils/file'
import { ResolutionType, VoteProposalOption } from '@/constants/resolution'
import {
    initUpdateBoardMeeting,
    updateBoardMeetingInformation,
} from './updateSlice'

export function useCreateBoardMeetingInformation(): [
    ICreateBoardMeeting,
    // eslint-disable-next-line
    (data: ICreateBoardMeeting) => void,
    () => void,
] {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state: RootState) => state.boardMeetingCreate)
    const setCreateBoardMeetingInformation = useCallback(
        (data: ICreateBoardMeeting) => {
            dispatch(updateCreateBoardMeetingInformation(data))
        },
        [dispatch],
    )

    const resetData = useCallback(() => {
        dispatch(resetCreateBoardMeetingData())
    }, [dispatch])
    return [data, setCreateBoardMeetingInformation, resetData]
}

export function useBoardMeetingDetail(): [
    {
        boardMeeting: IBoardMeetingDetail | undefined
        status: EActionStatus
    },
    // eslint-disable-next-line
    (boardMeetingId: number) => void,
] {
    const dispatch = useAppDispatch()
    const { boardMeeting, status } = useAppSelector(
        (state: RootState) => state.boardMeetingDetail,
    )

    const fetchBoardMeetingDetail = useCallback(
        (boardMeetingId: number) => {
            dispatch(getBoardMeetingDetail(boardMeetingId))
        },
        [dispatch],
    )

    return [
        {
            boardMeeting,
            status,
        },
        fetchBoardMeetingDetail,
    ]
}

export function useBoardMeetingFiles(): {
    invitations: BoardMeetingResource[]
    minutes: BoardMeetingResource[]
} {
    const boardMetingDetail = useAppSelector(
        (state: RootState) => state.boardMeetingDetail.boardMeeting,
    )
    if (!boardMetingDetail) {
        return {
            invitations: [],
            minutes: [],
        }
    }
    const invitationsFile = boardMetingDetail.meetingFiles.filter(
        (file) => file.fileType === MeetingFileType.MEETING_INVITATION,
    )
    const minutesFile = boardMetingDetail.meetingFiles.filter(
        (file) => file.fileType === MeetingFileType.MEETING_MINUTES,
    )
    const invitations = invitationsFile.map((file) => ({
        url: file.url,
        type: getFileTypeByUrl(file.url),
    }))
    const minutes = minutesFile.map((file) => ({
        url: file.url,
        type: getFileTypeByUrl(file.url),
    }))
    return {
        invitations,
        minutes,
    }
}

export function useReports(type: ResolutionType): {
    title: string
    description: string
    oldDescription?: string
    percentVoted: number
    percentUnVoted: number
    percentNotVoteYet: number
    voteResult: VoteProposalOption
    creator: IBoardProposalCreator
    id: number
    proposalFiles: IBoardProposalFile[]
}[] {
    const boardMetingDetail = useAppSelector(
        (state: RootState) => state.boardMeetingDetail.boardMeeting,
    )
    if (!boardMetingDetail) return []
    const reports = boardMetingDetail?.proposals.filter(
        (report) => report.type === type,
    )
    return reports.map((report) => {
        const notVoteYetQuantity = Number(report.notVoteYetQuantity)
        const votedQuantity = Number(report.votedQuantity)
        const unVotedQuantity = Number(report.unVotedQuantity)
        const boardsTotal = notVoteYetQuantity + votedQuantity + unVotedQuantity
        const percentVoted =
            boardsTotal === 0 ? 0 : (votedQuantity * 100) / boardsTotal
        const percentUnVoted =
            boardsTotal === 0 ? 0 : (unVotedQuantity * 100) / boardsTotal
        const percentNotVoteYet =
            boardsTotal === 0 ? 0 : (notVoteYetQuantity * 100) / boardsTotal
        return {
            id: report.id,
            title: report.title,
            description: report.description,
            oldDescription: report.oldDescription,
            percentVoted,
            percentUnVoted,
            percentNotVoteYet,
            voteResult: report.voteResult,
            creator: report.creator,
            proposalFiles: report.proposalFiles,
        }
    })
}

// export function useCandidates(): {
//     title: string
//     description: string
//     oldDescription?: string
//     voted: number
//     unVoted: number
//     notVoteYet: number
//     voteResult: VoteProposalOption
//     id: number
//
// }[] {
//     const boardMeetingDetail = useAppSelector(
//         (state: RootState) => state.boardMeetingDetail.boardMeeting,
//     )
//     if (!boardMeetingDetail) return []
//     const reports = boardMeetingDetail?.candidates
//     return reports.map((report) => {
//         const notVoteYet = Number(report.notVoteYetQuantity)
//         const voted = Number(report.votedQuantity)
//         const unVoted = Number(report.unVotedQuantity)
//
//         return {
//             id: report.id,
//             title: report.title,
//             description: report.description,
//             voted,
//             unVoted,
//             notVoteYet,
//             voteResult: report.voteResult,
//             creator: report.creator,
//         }
//     })
// }

export function useUpdateBoardMeetingInformation(): [
    IUpdateBoardMeeting,
    // eslint-disable-next-line
    (data: IUpdateBoardMeeting) => void,
    EActionStatus,
    // eslint-disable-next-line
    (meetingId: number) => void,
] {
    const dispatch = useAppDispatch()
    const data = useAppSelector(
        (state: RootState) => state.boardMeetingUpdate.meeting,
    )

    const status = useAppSelector(
        (state: RootState) => state.boardMeetingUpdate.status,
    )

    const setUpdateBoardMeetingInformation = useCallback(
        (data: IUpdateBoardMeeting) => {
            dispatch(updateBoardMeetingInformation(data))
        },
        [dispatch],
    )

    const initData = useCallback(
        (meetingId: number) => {
            dispatch(initUpdateBoardMeeting(meetingId))
        },
        [dispatch],
    )

    return [data, setUpdateBoardMeetingInformation, status, initData]
}
