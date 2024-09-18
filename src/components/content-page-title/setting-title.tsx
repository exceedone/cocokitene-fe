import { ChangeEvent, ReactNode, useState } from 'react'
import { useTranslations } from 'next-intl'
import LayoutTitle from '@/components/content-page-title/layout-title'
import { Grid, Input, Tabs, TabsProps } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface ISettingTile {
    addButton?: ReactNode
    editButton?: ReactNode
    // eslint-disable-next-line
    onChangeInput?: ((value: string) => void) | undefined
    // eslint-disable-next-line
    onChangeTab?: ((key: string) => void) | undefined
}

const { useBreakpoint } = Grid

const SettingTitle = ({
    addButton,
    editButton,
    onChangeInput,
    onChangeTab,
}: ISettingTile) => {
    const t = useTranslations()
    const screens = useBreakpoint()

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
            <div className="flex w-full justify-between gap-2 max-md:flex-col-reverse">
                <div className="">
                    <Tabs
                        items={items}
                        onChange={onChange}
                        defaultActiveKey="roleSys"
                        size="small"
                    />
                </div>

                <div
                    className="items flex items-center gap-2 max-md:justify-end "
                    key={choiceTab}
                >
                    {choiceTab === 'roleSys' ? (
                        <Input
                            className="w-[178px] max-[470px]:w-[150px] lg:w-[200px]"
                            size={screens.lg ? 'large' : 'middle'}
                            addonAfter={<SearchOutlined />}
                            placeholder={t('SEARCH')}
                            onChange={handleInputChange}
                        />
                    ) : null}

                    {addButton}
                    {choiceTab === 'roleSys' ? editButton : null}
                </div>
            </div>
        </LayoutTitle>
    )
}

export default SettingTitle
