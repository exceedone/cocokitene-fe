import { useCallback } from "react"
import { RootState, useAppDispatch, useAppSelector } from ".."
import { ListParamsFilter } from "../meeting/types"
import { ICreateServiceSubscriptionState, IGetAllServiceSubscriptionQuery, IServiceSubscriptionDetail, IServiceSubState } from "./type"
import { getAllServiceSubscription, setFilter } from "./listSlice"
import { EActionStatus } from "../type"
import { getServiceSubscriptionDetail } from "./detailSlice"
import { setIdServicePlanSubscription, setInfoSubscriptionCreateState } from "./createSlice"



type ListService = {
    serviceSubscriptionState: IServiceSubState
    // eslint-disable-next-line
    getListServiceSubscriptionAction: (data: IGetAllServiceSubscriptionQuery) => void
    // eslint-disable-next-line
    setFilterAction: (data: ListParamsFilter) => void
}

export const useListServiceSubscription = (): ListService => {
    const dispatch = useAppDispatch()
    const serviceSubscriptionState = useAppSelector((state: RootState) => state.serviceSubscriptionList)

    const getListServiceSubscriptionAction = useCallback((data: IGetAllServiceSubscriptionQuery) => {
        dispatch(getAllServiceSubscription(data))
    },[dispatch])

    const setFilterAction = useCallback((data: ListParamsFilter) => {
        dispatch(setFilter(data))
    },[dispatch])

    return {
        serviceSubscriptionState,
        getListServiceSubscriptionAction,
        setFilterAction,
    }
}

export function useServiceSubscriptionDetail(): [
    {
        serviceSubscription: IServiceSubscriptionDetail | undefined
        status: EActionStatus
    },
    // eslint-disable-next-line
    (serviceSubscriptionId: number) => void,
] {
    const dispatch = useAppDispatch()
    const { serviceSubscription , status } = useAppSelector(
        (state: RootState) => state.serviceSubscriptionDetail,)

    const fetchServiceSubscriptionDetail = useCallback(
        (serviceSubscriptionId: number) => {
            dispatch(getServiceSubscriptionDetail(serviceSubscriptionId))
        }
    ,[dispatch])
    
    return [
        {serviceSubscription, status},
        fetchServiceSubscriptionDetail
    ]
}


type ListServicePlanSubscriptionType = {
    serviceSubscriptionCreateState: ICreateServiceSubscriptionState
    // eslint-disable-next-line
    setInfoSubscriptionCreate: (data: ICreateServiceSubscriptionState) => void
    // eslint-disable-next-line
    setIdServicePlanSubscription: (data: {planId: number, planName: string, price: number}) => void
}

export function useServiceSubscriptionCreate(): ListServicePlanSubscriptionType {
    const dispatch = useAppDispatch()

    const serviceSubscriptionCreateState = useAppSelector((state: RootState) => state.serviceSubscriptionCreate)

    const setInfoSubscriptionCreate = useCallback((data:ICreateServiceSubscriptionState ) =>{
        dispatch(setInfoSubscriptionCreateState(data))
    },[dispatch])

    const setIdServicePlanSubscriptionCreate = useCallback((data: {planId: number,planName:string ,price: number}) => {
        dispatch(setIdServicePlanSubscription(data))
    }, [dispatch])

    return {
        serviceSubscriptionCreateState,
        setInfoSubscriptionCreate: setInfoSubscriptionCreate,
        setIdServicePlanSubscription: setIdServicePlanSubscriptionCreate,
    }
}

