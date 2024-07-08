import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ICheckDataMeetingState } from './types'
import { MeetingType } from '@/constants/meeting'
import { EActionStatus } from '../type'

const initialState: ICheckDataMeetingState = {
    meetingId: 0,
    name: '',
    openModalCheckData: false,
    type: MeetingType.SHAREHOLDER_MEETING,
    status: EActionStatus.Idle
}

const CheckDataMeetingSlice = createSlice({
    name: 'checkDataMeetingSlice',
    initialState,
    reducers: {
        setOpenModalCheckData(
            state,
            action: PayloadAction<{ isOpenModal: boolean }>,
        ) {
            state.openModalCheckData = action?.payload.isOpenModal
        },
        setInfoMeeting(
            state,
            action: PayloadAction<{ id: number; name: string ,type: MeetingType}>,
        ) {
            state.meetingId = action?.payload.id,
            state.name = action?.payload.name,
            state.type = action?.payload.type
        },
    },
})

export const { setOpenModalCheckData, setInfoMeeting } =
    CheckDataMeetingSlice.actions

export default CheckDataMeetingSlice.reducer
