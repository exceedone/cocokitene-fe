import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EActionStatus, FetchError } from "../type";
import { IDetailServiceSubscriptionState, IServiceSubscriptionDetail } from "./type";
import serviceSubscriptionService from "@/services/system-admin/service-subscription";
import { AxiosError } from "axios";


const initialState: IDetailServiceSubscriptionState = {
    status: EActionStatus.Idle,
    serviceSubscription: undefined,
    error: undefined,   
}

export const getServiceSubscriptionDetail = createAsyncThunk<
    IServiceSubscriptionDetail,
    number,
    {
        rejectValue: FetchError
    }
>('service-subscription/getServiceSubscriptionDetail', async (serviceSubId, { rejectWithValue }) => {
    try {
        const serviceSubscriptionDetail = await serviceSubscriptionService.getDetailServiceSubscription(serviceSubId)

        return {
            id: serviceSubscriptionDetail.id,
            companyId: serviceSubscriptionDetail.companyId,
            planId: serviceSubscriptionDetail.planId,
            note: serviceSubscriptionDetail.note,
            type: serviceSubscriptionDetail.type,
            amount: serviceSubscriptionDetail.amount,
            paymentMethod: serviceSubscriptionDetail.paymentMethod,
            activationDate: serviceSubscriptionDetail.activationDate, 
            expirationDate: serviceSubscriptionDetail.expirationDate,
            status: serviceSubscriptionDetail.status,
            transferReceipt: serviceSubscriptionDetail.transferReceipt, 
            approvalTime: serviceSubscriptionDetail.approvalTime,
            createdAt: serviceSubscriptionDetail.createdAt,
            createdSystemId: serviceSubscriptionDetail.createdSystemId,
            updatedAt: serviceSubscriptionDetail.updatedAt,
            updatedSystemId: serviceSubscriptionDetail.updatedSystemId,
            plan: {
                id: serviceSubscriptionDetail.plan.id,
                planName: serviceSubscriptionDetail.plan.planName,
                price: serviceSubscriptionDetail.plan.price,
            },
            company: {
                id: serviceSubscriptionDetail.company.id,
                companyName: serviceSubscriptionDetail.company.companyName,
                taxNumber: serviceSubscriptionDetail.company.taxNumber,
                planId: serviceSubscriptionDetail.company.planId,
            }
        } as unknown as IServiceSubscriptionDetail

    } catch (error) {
        const err = error as AxiosError
        const responseData: any = err.response?.data
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code,
        })
    }
})

const serviceSubscriptionDetailSlice = createSlice({
    name: 'serviceSubscriptionDetailSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServiceSubscriptionDetail.pending, (state) => {
                state.status = EActionStatus.Pending
            })
            .addCase(getServiceSubscriptionDetail.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded,
                state.serviceSubscription = action.payload
            })
            .addCase(getServiceSubscriptionDetail.rejected, (state, action) => {
                state.status = EActionStatus.Failed
                state.error = action.payload
            })
    }
})

export default serviceSubscriptionDetailSlice.reducer