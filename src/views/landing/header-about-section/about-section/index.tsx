'use client'

import { Typography } from 'antd'
import { useTranslations } from 'next-intl'

const { Title } = Typography

const AboutSection = () => {
    const t = useTranslations()
    return (
        <div className="absolute left-1/2 top-[40%] z-20 w-[90%] -translate-x-1/2 -translate-y-1/2">
            <Title
                level={1}
                className="mx-auto w-[80%] text-center  font-medium text-yellow-sunrise max-[640px]:text-2xl md:max-w-2xl"
            >
                {/* <span className="text-yellow-sunrise">
                    {t('EFFICIENTLY')} {t('STORE')}
                </span>{' '}
                {t('MEETING')} {t('INFORMATION')} {t('USING')}{' '}
                <span className="text-yellow-sunrise">{t('BLOCKCHAIN')}</span>{' '}
                {t('TECHNOLOGY')} */}
                {t('ABOUT_TITLE')}
            </Title>
            <Title level={5} className="text-center font-normal text-white">
                {t('ABOUT_SUB_TITLE')}
            </Title>
        </div>
    )
}

export default AboutSection
