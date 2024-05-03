import { RootState, useAppDispatch, useAppSelector } from '@/stores'
import { useCallback } from 'react'
import {
    IGetAllRoleMtgQuery,
    ISettingRoleMtgState,
} from '@/stores/setting-role-mtg/type'
import {
    getAllRoleMtg,
    setIdModalUpdateRoleMtg,
    setOpenModalRegisterRoleMtg,
    setOpenModalUpdateRoleMtg,
} from '@/stores/setting-role-mtg/slice'

type SettingRoleTypeMtg = {
    settingRoleMtgState: ISettingRoleMtgState
    // eslint-disable-next-line
    getListRoleMtgAction: (data: IGetAllRoleMtgQuery) => void
    // eslint-disable-next-line
    setOpenModalRoleMtg: (isOpenModalRoleMtg: boolean) => void
    // eslint-disable-next-line
    setOpenModalUpdatedRoleMtg: (isOpenModalUpdateRoleMtg: boolean) => void
    // eslint-disable-next-line
    setIdMOpenModalUpdateRoleMtg: (id: number) => void
}

export const useSettingRoleMtg = (): SettingRoleTypeMtg => {
    const dispatch = useAppDispatch()
    const settingRoleMtgState = useAppSelector(
        (state: RootState) => state.settingRoleMtg,
    )

    const getListRoleMtgAction = useCallback(
        (data: IGetAllRoleMtgQuery) => {
            dispatch(getAllRoleMtg(data))
        },
        [dispatch],
    )

    const setOpenModalRoleMtg = useCallback(
        (isOpenModalRoleMtg: boolean) => {
            dispatch(setOpenModalRegisterRoleMtg({ isOpenModalRoleMtg }))
        },
        [dispatch],
    )

    const setOpenModalUpdatedRoleMtg = useCallback(
        (isOpenModalUpdateRoleMtg: boolean) => {
            dispatch(setOpenModalUpdateRoleMtg({ isOpenModalUpdateRoleMtg }))
        },
        [dispatch],
    )
    const setIdMOpenModalUpdateRoleMtg = useCallback(
        (id: number) => {
            dispatch(setIdModalUpdateRoleMtg({ id }))
        },
        [dispatch],
    )

    return {
        settingRoleMtgState,
        getListRoleMtgAction,
        setOpenModalRoleMtg,
        setOpenModalUpdatedRoleMtg,
        setIdMOpenModalUpdateRoleMtg,
    }
}
