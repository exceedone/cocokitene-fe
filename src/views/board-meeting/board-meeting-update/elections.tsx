import BoxArea from '@/components/box-area'
import CreateReportItem from '@/components/create-report-item'
import { ResolutionType } from '@/constants/resolution'
import { useUpdateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import { IProposalFile } from '@/stores/meeting/types'
import { getShortNameFromUrl } from '@/utils/meeting'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

const Elections = () => {
    const t = useTranslations()
    const [data, setData] = useUpdateBoardMeetingInformation()

    const onChange =
        (name: 'title' | 'description' | 'oldDescription', index: number) =>
        (value: string) => {
            const elections = [...data.elections]
            elections[index] = {
                ...elections[index],
                [name]: value,
            }
            setData({
                ...data,
                elections,
            })
        }

    const onAddFile = (index: number) => (file: IProposalFile) => {
        const elections = [...data.elections]
        const oldFiles = elections[index].files as IProposalFile[]
        elections[index] = {
            ...elections[index],
            files: [...oldFiles, file],
        }
        setData({
            ...data,
            elections,
        })
    }

    const onRemoveFile = (index: number) => (uid: string) => {
        const elections = [...data.elections]

        const oldFiles = elections[index].files as IProposalFile[]
        const newFiles = oldFiles.filter((file) => file.uid !== uid)

        elections[index] = {
            ...elections[index],
            files: newFiles,
        }
        setData({
            ...data,
            elections,
        })
    }

    const onDelete = (index: number) => () => {
        setData({
            ...data,
            elections: data.elections.filter((r, i) => i !== index),
        })
    }

    const onAddNew = () => {
        setData({
            ...data,
            elections: [
                ...data.elections,
                {
                    type: ResolutionType.ELECTION,
                    title: '',
                    description: '',
                    oldDescription: '',
                    files: [],
                },
            ],
        })
    }

    return (
        <BoxArea title={t('ELECTIONS')}>
            <div className="mb-6 flex flex-col gap-6">
                {data.elections.map((election, index) => (
                    <CreateReportItem
                        key={index}
                        type={ResolutionType.ELECTION}
                        index={index + 1}
                        title={data.elections[index].title}
                        content={data.elections[index].description}
                        oldContent={data.elections[index].oldDescription}
                        fileList={data?.elections[index].files?.map(
                            (file, index) => ({
                                uid: file.id?.toString() || index.toString(),
                                name: getShortNameFromUrl(file.url) as string,
                                url: file.url,
                                status: 'done',
                            }),
                        )}
                        onChangeTitle={onChange('title', index)}
                        onChangeContent={onChange('description', index)}
                        onChangeOldContent={onChange('oldDescription', index)}
                        onAddFile={onAddFile(index)}
                        onRemoveFile={onRemoveFile(index)}
                        onDelete={onDelete(index)}
                    />
                ))}
            </div>
            <Button
                onClick={onAddNew}
                icon={<PlusOutlined />}
                disabled={data.elections.length >= 10}
            >
                {t('ADD_NEW')}
            </Button>
        </BoxArea>
    )
}

export default Elections
