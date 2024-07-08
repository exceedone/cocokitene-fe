import { Empty, Typography } from 'antd'
import { useTranslations } from 'next-intl'

const { Text } = Typography

const EmptyData = () => {
    const t = useTranslations()
    return (
        <div className="flex flex-col items-center">
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{
                    marginBlock: 0,
                }}
                description={
                    <Text className="text-black-25">{t('NO_DATA')}</Text>
                }
            />
        </div>
    )
}

export default EmptyData
