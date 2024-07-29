import BoxArea from '@/components/box-area'
import CreateResolutionItem from '@/components/create-resolution-item'
import { ResolutionType } from '@/constants/resolution'
import { useUpdateBoardMeetingInformation } from '@/stores/board-meeting/hook'
import { IBoardProposalFile } from '@/stores/board-meeting/types'
import { IProposalFile } from '@/stores/meeting/types'
import { getShortNameFromUrl } from '@/utils/meeting'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

const ManagementAndFinancialReports = () => {
    const t = useTranslations()
    const [data, setData] = useUpdateBoardMeetingInformation()

    const onChange =
        (name: 'title' | 'description', index: number) => (value: string) => {
            const managementAndFinancials = [...data.managementAndFinancials]
            managementAndFinancials[index] = {
                ...managementAndFinancials[index],
                [name]: value,
            }
            setData({
                ...data,
                managementAndFinancials,
            })
        }

    const onAddFile = (index: number) => (file: IProposalFile) => {
        const managementAndFinancials = [...data.managementAndFinancials]
        const oldFiles = managementAndFinancials[index]
            .files as IBoardProposalFile[]
        managementAndFinancials[index] = {
            ...managementAndFinancials[index],
            files: [...oldFiles, file],
        }
        setData({
            ...data,
            managementAndFinancials,
        })
    }

    const onRemoveFile = (index: number) => (uid: string) => {
        const managementAndFinancials = [...data.managementAndFinancials]
        const oldFiles = managementAndFinancials[index]
            .files as IBoardProposalFile[]
        const newFiles = oldFiles.filter((file) => file.uid !== uid)
        managementAndFinancials[index] = {
            ...managementAndFinancials[index],
            files: newFiles,
        }
        setData({
            ...data,
            managementAndFinancials,
        })
    }

    const onDelete = (index: number) => () => {
        setData({
            ...data,
            managementAndFinancials: data.managementAndFinancials.filter(
                (r, i) => i !== index,
            ),
        })
    }

    const onAddNew = () => {
        setData({
            ...data,
            managementAndFinancials: [
                ...data.managementAndFinancials,
                {
                    title: '',
                    description: '',
                    files: [],
                    type: ResolutionType.MANAGEMENT_FINANCIAL,
                },
            ],
        })
    }

    return (
        <BoxArea title={t('MANAGEMENT_AND_FINANCIAL_REPORTS')}>
            <div className="mb-6 flex flex-col gap-6">
                {data.managementAndFinancials.map((report, index) => (
                    <CreateResolutionItem
                        key={index}
                        type={ResolutionType.MANAGEMENT_FINANCIAL}
                        index={index + 1}
                        title={data.managementAndFinancials[index].title}
                        content={
                            data.managementAndFinancials[index].description
                        }
                        fileList={data?.managementAndFinancials[
                            index
                        ].files?.map((file, index) => ({
                            uid: file.id?.toString() || index.toString(),
                            name: getShortNameFromUrl(file.url) as string,
                            url: file.url,
                            status: 'done',
                        }))}
                        onChangeTitle={onChange('title', index)}
                        onChangeContent={onChange('description', index)}
                        onAddFile={onAddFile(index)}
                        onRemoveFile={onRemoveFile(index)}
                        onDelete={onDelete(index)}
                    />
                ))}
            </div>
            <Button
                onClick={onAddNew}
                icon={<PlusOutlined />}
                disabled={data.managementAndFinancials.length >= 10}
            >
                {t('ADD_NEW')}
            </Button>
        </BoxArea>
    )
}

export default ManagementAndFinancialReports
