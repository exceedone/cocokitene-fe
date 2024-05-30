import { MeetingFileType, MeetingStatus } from '@/constants/meeting'
import { EActionStatus, FetchError } from '@/stores/type'
import { IUpdateBoardMeeting, IUpdateBoardMeetingState } from './types'
import { ResolutionType } from '@/constants/resolution'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import serviceBoardMeeting from '@/services/board-meeting'
import serviceMeeting from '@/services/meeting'
import {
    IParticipants,
    IParticipantsWithRole,
} from '@/components/participant-selector'
import { AxiosError } from 'axios'

const initialState: IUpdateBoardMeetingState = {
    status: EActionStatus.Idle,
    error: undefined,
    meeting: {
        id: 0,
        title: '',
        note: '',
        meetingLink: '',
        status: MeetingStatus.NOT_HAPPEN,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        endVotingTime: new Date().toISOString(),
        meetingMinutes: [],
        meetingInvitations: [],
        managementAndFinancials: [
            {
                title: '',
                description: '',
                oldDescription: '',
                files: [],
                type: ResolutionType.MANAGEMENT_FINANCIAL,
            },
        ],
        elections: [
            {
                title: '',
                description: '',
                oldDescription: '',
                files: [],
                type: ResolutionType.ELECTION,
            },
        ],
        candidates: [
            {
                title: '',
                candidateName: '',
            },
        ],
        participants: [
            {
                roleMtgId: 1,
                roleName: '',
                userParticipant: [],
            },
        ],
    },
}

export const initUpdateBoardMeeting = createAsyncThunk<
    IUpdateBoardMeeting,
    number,
    {
        rejectValue: FetchError
    }
>('boardMeeting/initUpdateMeeting', async (meetingId, { rejectWithValue }) => {
    try {
        const boardMeetingDetail =
            await serviceBoardMeeting.getDetailBoardMeeting(meetingId)

        const getBoardMeetingFileByType = (type: MeetingFileType) => {
            return boardMeetingDetail.meetingFiles
                .filter((file) => file.fileType === type)
                .map((file) => ({
                    id: file.id,
                    url: file.url,
                    fileType: file.fileType,
                    uid: file.id.toString(),
                }))
        }

        const getProposalsByType = (type: ResolutionType) => {
            return boardMeetingDetail.proposals
                .filter((proposal) => proposal.type === type)
                .map((resolution) => ({
                    id: resolution.id,
                    title: resolution.title,
                    description: resolution.description,
                    oldDescription: resolution.oldDescription,
                    type: resolution.type,
                    files: resolution.proposalFiles.map((file) => ({
                        id: file.id,
                        url: file.url,
                        uid: file.id.toString(),
                    })),
                }))
        }

        const getCandidate = () =>
            boardMeetingDetail.candidates.map((candidate) => ({
                id: candidate.id,
                title: candidate.title,
                candidateName: candidate.candidateName,
                type: candidate.type,
            }))

        const getRoleMtgInMeetings = await serviceMeeting.getRoleMtgs(meetingId)

        let participants: IParticipantsWithRole[] = []

        await Promise.all([
            getRoleMtgInMeetings.map(async (roleMtg) => {
                const participantsWithRole: IParticipantsWithRole = {
                    roleMtgId: roleMtg.id,
                    roleName: roleMtg.roleName,
                    userParticipant: [],
                }

                await Promise.all([
                    boardMeetingDetail.participants.map((participant) => {
                        if (participant.roleMtgId === roleMtg.id) {
                            participant.userParticipants.forEach(
                                (userMeeting) => {
                                    const userParticipant: IParticipants = {
                                        users_defaultAvatarHashColor:
                                            userMeeting.userDefaultAvatarHashColor as string,
                                        users_avartar:
                                            userMeeting.userAvatar as string,
                                        users_email:
                                            userMeeting.userEmail as string,
                                        users_id: userMeeting.userId as number,
                                    }

                                    participantsWithRole.userParticipant.push(
                                        userParticipant,
                                    )
                                },
                            )
                        }
                    }),
                ])
                participants.push(participantsWithRole)
            }),
        ])

        return {
            id: boardMeetingDetail.id,
            title: boardMeetingDetail.title,
            note: boardMeetingDetail.note,
            meetingLink: boardMeetingDetail.meetingLink,
            status: boardMeetingDetail.status,
            startTime: new Date(boardMeetingDetail.startTime).toISOString(),
            endTime: new Date(boardMeetingDetail.endTime).toISOString(),
            endVotingTime: new Date(
                boardMeetingDetail.endVotingTime,
            ).toISOString(),
            meetingInvitations: getBoardMeetingFileByType(
                MeetingFileType.MEETING_INVITATION,
            ),
            meetingMinutes: getBoardMeetingFileByType(
                MeetingFileType.MEETING_MINUTES,
            ),
            managementAndFinancials: getProposalsByType(
                ResolutionType.MANAGEMENT_FINANCIAL,
            ),
            elections: getProposalsByType(ResolutionType.ELECTION),
            candidates: getCandidate(),
            participants: participants,
        }
    } catch (error) {
        const err = error as AxiosError
        const responseData: any = err.response?.data
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code,
        })
    }
})

export const boardMeetingUpdateSlice = createSlice({
    name: 'boardMeetingUpdateSlice',
    initialState,
    reducers: {
        updateBoardMeetingInformation: (
            state: IUpdateBoardMeetingState,
            action: PayloadAction<IUpdateBoardMeeting>,
        ) => {
            state.meeting = action.payload
        },
        resetUpdateBoardMeetingData: () => {
            return initialState
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(initUpdateBoardMeeting.pending, (state) => {
                state.status = EActionStatus.Pending
            })
            .addCase(initUpdateBoardMeeting.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded,
                state.meeting = action.payload
            })
            .addCase(initUpdateBoardMeeting.rejected, (state, action) => {
                state.status = EActionStatus.Failed
                state.error = action.payload
            })
    },
})

export const { updateBoardMeetingInformation, resetUpdateBoardMeetingData } =
    boardMeetingUpdateSlice.actions

export default boardMeetingUpdateSlice.reducer
