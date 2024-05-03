import { ChangeEvent, ReactNode, useState } from 'react'
import { useTranslations } from 'next-intl'
import LayoutTitle from '@/components/content-page-title/layout-title'
import { Input, Tabs, TabsProps } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface ISettingTile {
    addButton?: ReactNode
    editButton?: ReactNode
    // eslint-disable-next-line
    onChangeInput?: ((value: string) => void) | undefined
    // eslint-disable-next-line
    onChangeTab?: ((key: string) => void) | undefined
}

const SettingTitle = ({
    addButton,
    editButton,
    onChangeInput,
    onChangeTab,
}: ISettingTile) => {
    const t = useTranslations()
    const items: TabsProps['items'] = [
        {
            key: 'roleSys',
            label: t('SYSTEM_ROLE'),
        },
        {
            key: 'roleMtg',
            label: t('MEETING_ROLE'),
        },
    ]
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (onChangeInput) {
            onChangeInput(event.target.value)
        }
    }
    const [choiceTab, setChoiceTab] = useState<string>('roleSys')

    const onChange = (key: string) => {
        setChoiceTab(key)
        if (onChangeTab) {
            onChangeTab(key)
        }
    }

    return (
        <LayoutTitle>
            <Tabs
                items={items}
                onChange={onChange}
                defaultActiveKey="roleSys"
            />

            <div className="items flex items-center gap-2" key={choiceTab}>
                {choiceTab === 'roleSys' ? (
                    <Input
                        className="w-[200px]"
                        size="large"
                        addonAfter={<SearchOutlined />}
                        placeholder={t('SEARCH')}
                        onChange={handleInputChange}
                    />
                ) : null}

                {addButton}
                {choiceTab === 'roleSys' ? editButton : null}
            </div>
        </LayoutTitle>
    )
}

export default SettingTitle
