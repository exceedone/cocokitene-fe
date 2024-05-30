import { get } from "./fetcher";
import { IAllMeetingChatInMeetingResponse } from "./response.type";



const serviceChatMeeting = {

    //Get All chat by meetingID
    getAllMessageChatByMeetingId: async (meetingId: number) =>{
        const response = await get<IAllMeetingChatInMeetingResponse>(`/messages/meeting/${meetingId}`)
        return response.data
    }
}

export default serviceChatMeeting