import { RootState, useAppDispatch, useAppSelector } from '@/stores'
import { ICheckDataMeetingState } from './types'
import { useCallback } from 'react'
import { setInfoMeeting, setOpenModalCheckData } from './slice'
import { MeetingType } from '@/constants/meeting'

type CheckDataMeeting = {
    checkDataMeetingState: ICheckDataMeetingState
    // eslint-disable-next-line
    setOpenModalCheck: (isOpenModal: boolean) => void
    // eslint-disable-next-line
    setInfoCheckMeeting: (id: number, name: string, type: MeetingType) => void
}

export const useCheckDataMeeting = (): CheckDataMeeting => {
    const dispatch = useAppDispatch()
    const checkDataMeetingState = useAppSelector(
        (state: RootState) => state.checkMeetingData,
    )

    const setOpenModalCheck = useCallback(
        (isOpenModal: boolean) => {
            dispatch(setOpenModalCheckData({ isOpenModal }))
        },
        [dispatch],
    )

    const setInfoCheckMeeting = useCallback(
        (id: number, name: string, type: MeetingType) => {
            dispatch(setInfoMeeting({ id, name, type }))
        },
        [dispatch],
    )

    return {
        checkDataMeetingState,
        setOpenModalCheck,
        setInfoCheckMeeting,
    }
}
