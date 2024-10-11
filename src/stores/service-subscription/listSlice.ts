import { CONSTANT_EMPTY_STRING } from "@/constants/common";
import { EActionStatus, FetchError } from "../type";
import { IGetAllServiceSubscriptionQuery, IServiceSubscriptionList, IServiceSubState } from "./type";
import { SORT } from "@/constants/meeting";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGetAllDataReponse } from "@/services/response.type";
import serviceSubscriptionService from "@/services/system-admin/service-subscription";
import { AxiosError } from "axios";
import { ListParamsFilter } from "../meeting/types";



const initialState: IServiceSubState = {
    status: EActionStatus.Idle,
    serviceSubList: [],
    totalServiceSubItem: 0,
    page: 1,
    limit: 10,
    filter: {
        searchQuery: CONSTANT_EMPTY_STRING,
        sortOrder: SORT.DESC,
    },
    errorCode: '',
    errorMessage: '',
}

export const getAllServiceSubscription = createAsyncThunk<
    IGetAllDataReponse<IServiceSubscriptionList>,
    IGetAllServiceSubscriptionQuery,
    {
        rejectValue: FetchError
    }
>('service-subscription/getAllServiceSub', async (param, { rejectWithValue }) => {
    try {
        const data = await serviceSubscriptionService.getAllServiceSubscription(param)
        const mappedData = data.items.map((item, index) => {
            return {
                id: item.service_subscription_id,
                index: index + 1,
                planId: item.plan_id,
                planName: item.planName,
                companyId: item.company_id,
                companyName: item.companyName,
                type: item.service_subscription_type,
                amount: item.service_subscription_total_free,
                status: item.service_subscription_status,
                paymentMethod: item.payment_method,
                approvalTime: item.approval_time,
            }
        }) as IServiceSubscriptionList[]

        return {
            ...data,
            items: mappedData,
        }
    } catch (error) {
        const err = error as AxiosError
        const responseData: any = err.response?.data
        return rejectWithValue({
            errorMessage: responseData?.info?.message,
            errorCode: responseData?.code,
        })
    }
})

const serviceSubscriptionListSlice = createSlice({
    name: 'serviceSubscriptionListSlice',
    initialState,
    reducers: {
        setFilter(state , action: PayloadAction<ListParamsFilter>) {
            state.filter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllServiceSubscription.pending , (state) => {
                state.status = EActionStatus.Pending
            })
            .addCase(getAllServiceSubscription.fulfilled , (state,action) => {
                state.status = EActionStatus.Succeeded,
                state.serviceSubList = action.payload.items,
                state.totalServiceSubItem = action.payload.meta.totalItems
            })
            .addCase(getAllServiceSubscription.rejected, (state, action) => {
                state.status = EActionStatus.Failed,
                state.errorCode = action.payload?.errorCode ?? ''
                state.errorMessage = action.payload?.errorMessage ?? ''
            })
    },
})

export const {setFilter} = serviceSubscriptionListSlice.actions

export default serviceSubscriptionListSlice.reducer