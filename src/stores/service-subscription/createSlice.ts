import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICreateServiceSubscriptionState } from "./type";


const initialState: ICreateServiceSubscriptionState = {
    subscriptionServicePlan: undefined,
    type: undefined,
    exServicePlan: undefined
}


const serviceSubscriptionCreateSlice = createSlice({
    name: 'serviceSubscriptionCreateSlice',
    initialState: initialState,
    reducers: {
        setInfoSubscriptionCreateState(state , action: PayloadAction<ICreateServiceSubscriptionState>) {
            state.subscriptionServicePlan = action.payload.subscriptionServicePlan,
            state.type = action.payload.type,
            state.exServicePlan = action.payload.exServicePlan
        },
        setIdServicePlanSubscription(state , action: PayloadAction<{planId: number,planName:string , price: number}>) {
            state.subscriptionServicePlan = action.payload
        }
    }
})

export const { setInfoSubscriptionCreateState , setIdServicePlanSubscription } = serviceSubscriptionCreateSlice.actions


export default serviceSubscriptionCreateSlice.reducer