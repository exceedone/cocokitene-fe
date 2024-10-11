import {
    PaymentMethod,
    StatusSubscriptionEnum,
    SubscriptionEnum,
} from '@/constants/service-subscript'
import { ListParamsFilter } from '../meeting/types'
import { EActionStatus, FetchError } from '../type'

export interface IServiceSubscriptionList {
    id: number
    index: number
    planId: number
    planName: string
    companyId: number
    companyName: string
    type: SubscriptionEnum
    amount: number
    status: StatusSubscriptionEnum
    paymentMethod: PaymentMethod
    approvalTime: string
}

export interface IGetAllServiceSubscriptionQuery {
    page: number
    limit: number
    filter?: ListParamsFilter
}

export interface IServiceSubState
    extends IGetAllServiceSubscriptionQuery,
        FetchError {
    status: EActionStatus
    serviceSubList: IServiceSubscriptionList[]
    totalServiceSubItem: number
}

export interface IServiceSubscriptionDetail {
    id: number
    companyId: number
    planId: number
    note: string
    type: SubscriptionEnum
    amount: number
    paymentMethod: PaymentMethod
    activationDate: string
    expirationDate: string
    status: StatusSubscriptionEnum
    approvalTime: string
    transferReceipt?: string
    createdAt: string
    createdSystemId: number
    updatedAt: string
    updatedSystemId?: number
    plan: {
        id: number
        planName: string
        price: number
    }
    company: {
        id: number
        companyName: string
        taxNumber: string
        planId: number
    }
}

export interface IDetailServiceSubscriptionState {
    status: EActionStatus
    serviceSubscription?: IServiceSubscriptionDetail
    error?: FetchError
}

export interface ICreateServiceSubscriptionState {
    subscriptionServicePlan?: {
        planId: number
        planName: string
        price: number
    }
    type?: SubscriptionEnum
    exServicePlan?: {
        planId: number
        price: number
        expirationDate: string
    }
}
