import {
    useBoardMeetingDetail,
    useBoardMeetingFiles,
} from '@/stores/board-meeting/hook'
import { FileType, MeetingResourceType } from '@/constants/meeting'
import { useTranslations } from 'next-intl'
import Loader from '@/components/loader'
import BoxArea from '@/components/box-area'
import { Col, Row, Typography } from 'antd'
import { PdfIcon } from '@/components/svgs'
import Link from 'next/link'
import { getShortNameFromUrl } from '@/utils/meeting'
import { truncateString } from '@/utils/format-string'

const { Text } = Typography
export interface BoardMeetingResource {
    url: string
    type: FileType
}
interface IBoardDocumentList {
    boardMeetingResourceType: MeetingResourceType
    resources: BoardMeetingResource[]
}

const BoardResource = ({ url, type }: BoardMeetingResource) => {
    const getIconFromFileType = () => {
        switch (type) {
            case FileType.PDF:
                return <PdfIcon fill="#5151E5" />
            default:
                return null
        }
    }

    return (
        <div className="flex items-center gap-2">
            {getIconFromFileType()}
            <Link href={url} target="_blank">
                <Text
                    title={getShortNameFromUrl(url)}
                    className="cursor-pointer text-primary"
                >
                    {truncateString({
                        text: getShortNameFromUrl(url) as string,
                        start: 5,
                        end: 15,
                    })}
                </Text>
            </Link>
        </div>
    )
}
const BoardDocumentList = ({
    boardMeetingResourceType,
    resources,
}: IBoardDocumentList) => {
    const t = useTranslations()

    return (
        <div className="flex gap-3">
            <Text className="text-black-45">
                {' '}
                {t(boardMeetingResourceType)}:
            </Text>
            <div className="flex flex-col gap-1">
                {resources.map((resource, index) => (
                    <BoardResource
                        key={index}
                        url={resource.url}
                        type={resource.type}
                    />
                ))}
            </div>
        </div>
    )
}

const BoardMeetingDocuments = () => {
    const [{ boardMeeting }] = useBoardMeetingDetail()
    const { invitations, minutes } = useBoardMeetingFiles()

    const t = useTranslations()

    if (!boardMeeting) return <Loader />

    return (
        <BoxArea title={t('DOCUMENTS')}>
            <Row gutter={[16, 24]}>
                <Col xs={24} md={12} lg={8}>
                    <BoardDocumentList
                        boardMeetingResourceType={
                            MeetingResourceType.MEETING_INVITATIONS
                        }
                        resources={invitations}
                    />
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <BoardDocumentList
                        boardMeetingResourceType={
                            MeetingResourceType.MEETING_MINUTES
                        }
                        resources={minutes}
                    />
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <BoardDocumentList
                        boardMeetingResourceType={
                            MeetingResourceType.MEETING_LINKS
                        }
                        resources={[
                            {
                                url: boardMeeting.meetingLink,
                                type: FileType.LINK,
                            },
                        ]}
                    />
                </Col>
            </Row>
        </BoxArea>
    )
}

export default BoardMeetingDocuments
