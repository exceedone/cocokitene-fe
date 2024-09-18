import { Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const { Title } = Typography

export interface IServiceItem {
    serviceImage: string
    serviceTitle: string
    serviceSubtitle: string
}

const ServiceItem = ({
    serviceImage,
    serviceTitle,
    serviceSubtitle,
}: IServiceItem) => {
    const t = useTranslations()

    return (
        <div
            id="service-item-wrapper"
            className="flex flex-1 items-center border-solid border-neutral/5 p-5 max-[639px]:gap-3 max-[470px]:px-2 sm:max-w-[320px] sm:flex-col sm:border"
        >
            <Image
                src={serviceImage}
                alt="service-image-alt"
                width={150}
                height={150}
                className="mx-auto sm:mb-10"
            />
            <div>
                <Title
                    level={4}
                    className="mx-auto mb-3 font-medium max-[470px]:text-lg sm:max-w-[200px] sm:text-center "
                >
                    {t(serviceTitle)}
                </Title>
                <p className="mx-auto text-sm font-normal text-black/[45%] sm:mb-4 sm:text-center">
                    {t(serviceSubtitle)}
                </p>
            </div>
        </div>
    )
}

export default ServiceItem
