import { useBoardMeetingDetail } from '@/stores/board-meeting/hook'
import Loader from '@/components/loader'
import BoxArea from '@/components/box-area'
import { useTranslations } from 'next-intl'
import { Typography } from 'antd'

const { Text } = Typography
const BoardMeetingNote = () => {
    const [{ boardMeeting }] = useBoardMeetingDetail()
    const t = useTranslations()
    if (!boardMeeting) return <Loader />

    return (
        <BoxArea title={t('NOTE_INFORMATION')}>
            <div className="flex flex-col gap-1">
                <Text className="text-black-45">{t('NOTE')}:</Text>
                <div className="flex flex-col gap-1">
                    {/* {boardMeeting.note} */}
                    {boardMeeting.note.split('\n').map((text, index) => {
                        return <div key={index}>{text}</div>
                    })}
                </div>
            </div>
        </BoxArea>
    )
}

export default BoardMeetingNote
