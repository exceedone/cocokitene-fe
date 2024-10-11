import {
    ICreateCompanyPayload,
    IUpdateCompanyPayload,
    IUpdateSuperAdminPayload,
} from '@/services/system-admin/request.type'
import { IGetAllCompanyQuery } from '@/stores/company/type'
import {
    ICompanyDetailResponse,
    IGetAllDataReponse,
    IListCompanyResponse,
    IServicePlanOfCompanyResponse,
} from '@/services/system-admin/response.type'
import { get, post, patch } from '@/services/system-admin/fetcher-system'
import { IContactForm } from '@/views/landing/contact-section'
import { IGetAllServiceSubscriptionQuery } from '@/stores/service-subscription/type'
import { IServiceSubscription } from '../response.type'

const serviceCompany = {
    getAllCompanys: async ({
        page,
        limit,
        filter,
    }: IGetAllCompanyQuery): Promise<
        IGetAllDataReponse<IListCompanyResponse>
    > => {
        const payload = { page, limit, ...filter }
        const response: { data: IGetAllDataReponse<IListCompanyResponse> } =
            await get('/system-admin/get-all-company', payload)

        return response.data
    },

    createCompany: async (payload: ICreateCompanyPayload) => {
        const response = await post<any>('/system-admin/company', payload)
        return response.data
    },

    getDetailCompany: async (companyId: number) => {
        const response = await get<ICompanyDetailResponse>(
            `/system-admin/company/${companyId}`,
        )
        return response.data
    },

    updateCompany: async (
        companyId: number,
        payload: IUpdateCompanyPayload,
    ) => {
        const response = await patch<any>(
            `/system-admin/company/${companyId}`,
            payload,
        )
        return response.data
    },

    updateSuperAdmin: async (
        companyId: number,
        superAdminId: number,
        payload: IUpdateSuperAdminPayload,
    ) => {
        const response = await patch<any>(
            `/system-admin/company/${companyId}/superadmin/${superAdminId}`,
            payload,
        )
        return response.data
    },
    sendMailRegisterCompanyLandingPage: async (payload: IContactForm) => {
        const response = await post<any>(
            '/system-admin/register-company',
            payload,
        )
        return response.data
    },
    getServicePlanOfCompany: async (companyId: number) => {
        const response = await get<IServicePlanOfCompanyResponse>(`/system-admin/company/${companyId}/service-plan`)
    
        return response.data
    },
    getAllSubscriptionServiceOfCompany: async (companyId: number,{page,limit}:IGetAllServiceSubscriptionQuery) => {
        const payload = {page, limit}
        const response: {data: IGetAllDataReponse<IServiceSubscription>} = await get(`/system-admin/company/${companyId}/service-plan/subscription`, payload)

        return response.data
    }
}

export default serviceCompany
