import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { EActionStatus, FetchError } from '../type'
import { IDetailMeetingState, IMeetingDetail } from './types'
import serviceMeeting from '@/services/meeting'

const initialState: IDetailMeetingState = {
    status: EActionStatus.Idle,
    meeting: undefined,
    error: undefined,
}

export const getMeetingDetail = createAsyncThunk<
    IMeetingDetail,
    number,
    {
        rejectValue: FetchError
    }
>('meeting/getMeetingDetail', async (meetingId, { rejectWithValue }) => {
    try {
        const meetingDetail = await serviceMeeting.getDetailMeeting(meetingId)
        return {
            id: meetingDetail.id,
            title: meetingDetail.title,
            note: meetingDetail.note,
            startTime: meetingDetail.startTime,
            endTime: meetingDetail.endTime,
            endVotingTime: meetingDetail.endVotingTime,
            meetingLink: meetingDetail.meetingLink,
            meetingCode: meetingDetail.meetingCode,
            status: meetingDetail.status,
            companyId: meetingDetail.companyId,
            creatorId: meetingDetail.creatorId,
            meetingFiles: meetingDetail.meetingFiles.map((meetingFile)=>({
                ...meetingFile,
                url: meetingFile.url ? process.env.NEXT_PUBLIC_PRE_URL_S3_LINK + meetingFile.url :  meetingFile.url,
            })),
            proposals: meetingDetail.proposals.map((proposal) => ({
                ...proposal,
                proposalFiles: proposal.proposalFiles.map((file) => ({
                    ...file,
                    url: file.url ? process.env.NEXT_PUBLIC_PRE_URL_S3_LINK + file.url : file.url
                }))
            })),
            personnelVoting: meetingDetail.personnelVoting,
            participants: meetingDetail.participants,
            type: meetingDetail.type,
            shareholdersTotal: meetingDetail.shareholdersTotal,
            shareholdersJoined: meetingDetail.shareholdersJoined,
            joinedMeetingShares: meetingDetail.joinedMeetingShares,
            totalMeetingShares: meetingDetail.totalMeetingShares,
            chatPermissionId: meetingDetail.chatPermissionId,
        } as unknown as IMeetingDetail
    } catch (error) {
        const err = error as AxiosError
        const responseData: any = err.response?.data
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code,
        })
    }
})

const meetingDetailSlice = createSlice({
    name: 'meetingDetailSlice',
    initialState,
    reducers: {
        resetStatus(state) {
            state.status = EActionStatus.Idle
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeetingDetail.pending, (state) => {
                state.status = EActionStatus.Pending
            })
            .addCase(getMeetingDetail.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded
                state.meeting = action.payload
            })
            .addCase(getMeetingDetail.rejected, (state, action) => {
                state.status = EActionStatus.Failed
                state.error = action.payload
            })
    },
})

export const { resetStatus } = meetingDetailSlice.actions
export default meetingDetailSlice.reducer
