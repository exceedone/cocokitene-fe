import LayoutTitle, {
    IBaseTitle,
} from '@/components/content-page-title/layout-title'
import { SORT } from '@/constants/meeting'
import { SearchOutlined } from '@ant-design/icons'
import { Grid, Input, Select, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { ChangeEvent, ReactNode } from 'react'

const { Title } = Typography
const { useBreakpoint } = Grid

interface IListTitle extends IBaseTitle {
    addButton?: ReactNode
    editButton?: ReactNode
    // eslint-disable-next-line
    onChangeInput?: ((value: string) => void) | undefined
    // eslint-disable-next-line
    onChangeSelect?: ((value: string) => void) | undefined
    defaultSort?: string
}

const ListTitle = ({
    pageName,
    addButton,
    editButton,
    onChangeInput,
    onChangeSelect,
    defaultSort,
}: IListTitle) => {
    const t = useTranslations()
    const screens = useBreakpoint()

    const handleChangeSelect = (value: string) => {
        if (onChangeSelect) {
            onChangeSelect(value)
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (onChangeInput) {
            onChangeInput(event.target.value)
        }
    }
    return (
        <LayoutTitle>
            <Title
                level={4}
                className="mb-0 pr-1 font-medium max-[470px]:text-base"
            >
                {pageName}
            </Title>
            <div className="items flex items-center gap-2">
                <Input
                    className="w-[178px] max-[470px]:w-[150px]"
                    size={screens.lg ? 'large' : 'middle'}
                    // size="middle"
                    addonAfter={<SearchOutlined />}
                    placeholder={t('SEARCH')}
                    onChange={handleInputChange}
                />
                {onChangeSelect && (
                    <Select
                        className="w-[155px] max-md:hidden"
                        defaultValue={
                            defaultSort == SORT.ASC
                                ? t('SORT_OLDEST_MEETING')
                                : t('SORT_NEWEST_MEETING')
                        }
                        size={screens.lg ? 'large' : 'middle'}
                        style={{ width: 120 }}
                        onChange={handleChangeSelect}
                        options={[
                            {
                                value: SORT.ASC,
                                label: t('SORT_OLDEST_MEETING'),
                            },
                            {
                                value: SORT.DESC,
                                label: t('SORT_NEWEST_MEETING'),
                            },
                        ]}
                    />
                )}

                {addButton}
                {editButton}
            </div>
        </LayoutTitle>
    )
}

export default ListTitle
