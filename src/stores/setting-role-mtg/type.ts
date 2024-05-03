import { EActionStatus, FetchError } from '@/stores/type'
import { TypeRoleMeeting } from '@/constants/role-mtg'

export interface ISettingRoleMtgState extends IGetAllRoleMtgQuery, FetchError {
    id?: number
    status: EActionStatus
    openModalRegisterRoleMtg: boolean
    openModalUpdateRoleMtg?: boolean
    totalRoleMtgItem: number
    roleMtgList: IRoleMtgList[]
}

export interface IRoleMtgList {
    id: number
    index: number
    roleName: string
    description: string
    type: TypeRoleMeeting
}

export interface IGetAllRoleMtgQuery {
    page: number
    limit: number
    searchQuery?: string
}

export interface IUpdateRoleMtgState {}
