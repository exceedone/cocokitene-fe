import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '@/stores/auth/slice'
import meetingCreateReducer from '@/stores/meeting/createSlice'
import meetingListReducer from '@/stores/meeting/listSlice'
import meetingDetailReducer from '@/stores/meeting/detailSlice'
import meetingUpdateReducer from '@/stores/meeting/updateSlice'
import attendanceReducer from '@/stores/attendance/slice'
import companyListReducer from '@/stores/company/listSlice'
import companyDetailReducer from '@/stores/company/detailSlice'
import authAdminReducer from '@/stores/auth-admin/slice'
import accountListReducer from '@/stores/account/listSlice'
import accountDetailReducer from '@/stores/account/detailSlice'
import shareholderListReducer from '@/stores/shareholder/listSlice'
import shareholderDetailReducer from '@/stores/shareholder/detailSlice'
import settingRoleReducer from '@/stores/setting-role-sys/slice'
import planListSlice from '@/stores/service-plan/listSlice'
import forgotPasswordReducer from '@/stores/forgot-password/slice'
import settingRoleMtgReducer from '@/stores/setting-role-mtg/slice'
import boardMeetingListReducer from '@/stores/board-meeting/listSlice'
import boardMeetingCreateReducer from '@/stores/board-meeting/createSlice'
import boardMeetingDetailReducer from '@/stores/board-meeting/detailSlice'
import boardMeetingUpdateReducer from '@/stores/board-meeting/updateSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    meetingList: meetingListReducer,
    meetingCreate: meetingCreateReducer,
    meetingDetail: meetingDetailReducer,
    meetingUpdate: meetingUpdateReducer,
    attendance: attendanceReducer,
    companyList: companyListReducer,
    companyDetail: companyDetailReducer,
    authAdmin: authAdminReducer,
    accountList: accountListReducer,
    accountDetail: accountDetailReducer,
    shareholderList: shareholderListReducer,
    shareholderDetail: shareholderDetailReducer,
    settingRole: settingRoleReducer,
    settingRoleMtg: settingRoleMtgReducer,
    planListSlice: planListSlice,
    forgotPassword: forgotPasswordReducer,
    boardMeetingList: boardMeetingListReducer,
    boardMeetingCreate: boardMeetingCreateReducer,
    boardMeetingDetail: boardMeetingDetailReducer,
    boardMeetingUpdate: boardMeetingUpdateReducer,

})

export default rootReducer
