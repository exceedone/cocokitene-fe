/* eslint-disable */

import {
    IGetAllRoleMtgQuery,
    IRoleMtgList,
    ISettingRoleMtgState,
} from '@/stores/setting-role-mtg/type'
import { EActionStatus, FetchError } from '@/stores/type'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGetAllDataReponse } from '@/services/response.type'
import { AxiosError } from 'axios/index'
import serviceSettingRoleMtg from '@/services/setting-role-mtg'

const initialState: ISettingRoleMtgState = {
    id: 0,
    status: EActionStatus.Idle,
    openModalRegisterRoleMtg: false,
    openModalUpdateRoleMtg: false,
    roleMtgList: [],
    totalRoleMtgItem: 0,
    page: 1,
    limit: 10,
    errorCode: '',
    errorMessage: '',
    searchQuery: '',
}

export const getAllRoleMtg = createAsyncThunk<
    IGetAllDataReponse<IRoleMtgList>,
    IGetAllRoleMtgQuery,
    {
        rejectValue: FetchError
    }
>('settingRoleMtg/getAllRoleMtgList', async (param, { rejectWithValue }) => {
    try {
        const data = await serviceSettingRoleMtg.getAllRoleMtgs(param)
        const mappedData = data.items.map((item, index) => {
            return {
                id: item.id,
                index: index + 1,
                roleName: item.roleName,
                description: item.description,
                type: item.type,
            }
        }) as IRoleMtgList[]
        return {
            ...data,
            items: mappedData,
        } as unknown as IGetAllDataReponse<IRoleMtgList>
    } catch (error) {
        const err = error as AxiosError
        const responseData: any = err.response?.data
        return rejectWithValue({
            errorMessage: responseData?.info?.message,
            errorCode: responseData?.code,
        })
    }
})

const RoleMtgListSlice = createSlice({
    name: 'roleMtgListSlice',
    initialState,
    reducers: {
        setOpenModalRegisterRoleMtg(
            state,
            action: PayloadAction<{ isOpenModalRoleMtg: boolean }>,
        ) {
            state.openModalRegisterRoleMtg = action?.payload.isOpenModalRoleMtg
        },
        setOpenModalUpdateRoleMtg(
            state,
            action: PayloadAction<{ isOpenModalUpdateRoleMtg: boolean }>,
        ) {
            state.openModalUpdateRoleMtg =
                action?.payload.isOpenModalUpdateRoleMtg
        },
        setIdModalUpdateRoleMtg(state, action: PayloadAction<{ id: number }>) {
            state.id = action?.payload.id
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllRoleMtg.pending, (state, action) => {
                state.status = EActionStatus.Pending
            })
            .addCase(getAllRoleMtg.fulfilled, (state, action) => {
                ;(state.status = EActionStatus.Succeeded),
                    (state.roleMtgList = action.payload.items ?? [])
                state.totalRoleMtgItem = action?.payload?.meta?.totalItems ?? 0
            })
            .addCase(getAllRoleMtg.rejected, (state, action) => {
                ;(state.status = EActionStatus.Failed),
                    (state.errorMessage = action?.payload?.errorMessage ?? '')
                state.errorCode = action.payload?.errorCode ?? ''
            })
    },
})

export const {
    setOpenModalRegisterRoleMtg,
    setOpenModalUpdateRoleMtg,
    setIdModalUpdateRoleMtg,
} = RoleMtgListSlice.actions
export default RoleMtgListSlice.reducer
