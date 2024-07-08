import { MeetingType } from "@/constants/meeting"
import { EActionStatus } from "../type"


export interface ICheckDataMeetingState {
    meetingId: number
    type: MeetingType
    name: string
    openModalCheckData : boolean
    status: EActionStatus
}