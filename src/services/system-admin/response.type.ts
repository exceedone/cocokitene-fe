import { CompanyStatus } from '@/constants/company-status'
import {
    PaymentMethod,
    StatusSubscriptionEnum,
    SubscriptionEnum,
} from '@/constants/service-subscript'
import { UserStatus } from '@/constants/user-status'

export interface ApiResponse<T = {}> {
    code: string | number
    data: T
    metadata: {
        timestamp: Date
        query: unknown
    }
}

export interface IMeta {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
}

export interface IGetAllDataReponse<T> {
    items: T[]
    meta: IMeta
}

export interface IListCompanyResponse {
    company_id: number
    company_company_name: string
    planName: string
    company_representative: string
    totalCreatedAccount: string
    totalCreatedMTGs: string
    companyStatus: string
}

export interface ICompanyStatusResponse {
    id: number
    status: CompanyStatus
    description: string
}

export interface IUserStatusResponse {
    id: number
    status: UserStatus
    description: string
}

export interface IPlanResponse {
    id: number
    planName: string
    description: string
    maxStorage: number
    maxMeeting: number
    price: number
    maxShareholderAccount: number
}

export interface IUserResponse {
    id: number
    username: string
    email: string
    walletAddress: string
    avatar: string
    statusId: number
    companyId: number
    shareQuantity: number
    nonce: string
    defaultAvatarHashColor: string | null
    phone: string | null
    activeTime: string | null
    userStatus: IUserStatusResponse
}

export interface ICompanyDetailResponse {
    id: number
    companyName: string
    companyShortName: string
    description?: string
    address: string
    planId: number
    statusId: number
    representativeUser: string
    phone: string
    taxNumber: string
    email: string
    fax?: string
    dateOfCorporation: string
    businessType: string
    totalCreateMeeting: string
    totalCreatedAccount: string
    companyStatus: ICompanyStatusResponse
    superAdminInfo: IUserResponse
    servicePlan: IPlanResponse
}

export interface IListPlanResponse {
    id: number
    planName: string
    description: string
    maxStorage: number
    maxMeeting: number
    price: number
    maxShareholderAccount: number
}

export interface ICreatePlan {
    planName: string
    description?: string
    maxStorage: number
    maxMeeting: number
    price: number
    maxShareholderAccount: number
}

export interface IPlanDetailResponse {
    planName: string
    description?: string
    maxStorage: number
    maxMeeting: number
    price: number
    maxShareholderAccount: number
}

export interface IUpdatePlan extends ICreatePlan {}

export interface IStatisticCompanyResponse {
    companyStatuses: {
        company_status_mst_id: number
        company_status_mst_status: CompanyStatus
        totalCompany: number
    }[]
    userStatuses: {
        user_statuses_id: number
        user_statuses_status: UserStatus
        totalUser: number
    }[]
    servicePlan: {
        plan_mst_id: number
        plan_mst_plan_name: string
        totalCompany: number
    }[]
}

export interface IListServiceSubscription {
    service_subscription_id: number
    service_subscription_type: SubscriptionEnum
    service_subscription_total_free: number
    service_subscription_status: StatusSubscriptionEnum
    planName: string
    plan_id: number
    companyName: string
    company_id: number
    payment_method: PaymentMethod
    approval_time: string
}

export interface IServiceSubscriptionDetailResponse {
    id: number
    companyId: number
    planId: number
    note?: string
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

export interface IServicePlanOfCompanyResponse {
    id: number
    companyId: number
    planId: number
    meetingLimit: number
    meetingCreated: number
    accountLimit: number
    accountCreated: number
    storageLimit: number
    storageUsed: number
    expirationDate: string
    createdAt: string
    createdSystemId?: number
    updatedAt: string
    updatedSystemId?: number
    plan: {
        id: number
        planName: string
        description: string
        price: number
    }
    company: {
        id: number
        companyName: string
        companyShortName: string
        planId: number
        statusId: number
    }
}

export interface IServiceSubscription {
    service_subscription_id: number
    service_subscription_type: SubscriptionEnum
    service_subscription_total_free: number
    service_subscription_status: StatusSubscriptionEnum
    planName: string
    company_id: number
    payment_method: PaymentMethod
    activation_date: string
    expiration_date: string
}

export interface ICompanyOption {
    company_id: number
    company_company_name: string
    servicePlanId: number
    expirationDate: string
    servicePlanPrice: number
}
