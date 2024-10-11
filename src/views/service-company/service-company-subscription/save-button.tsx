import { Button, FormInstance, Spin } from 'antd'
import { IServiceSubscriptionCreateForm } from '.'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useWatch } from 'antd/es/form/Form'

interface ISaveCreateServiceSubscription {
    form: FormInstance<IServiceSubscriptionCreateForm>
    isLoading: boolean
}

const SaveCreateServiceSubscriptionButton = ({
    form,
    isLoading,
}: ISaveCreateServiceSubscription) => {
    const [submittable, setSubmittable] = useState(false)
    const t = useTranslations()

    // Watch all values
    const values = useWatch([], form)

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true)
            },
            () => {
                setSubmittable(false)
            },
        )
        // eslint-disable-next-line
    }, [values])

    return (
        <Spin spinning={isLoading} delay={0}>
            <Button
                type="default"
                className="bg-primary text-white transition-opacity disabled:opacity-60"
                size="large"
                htmlType="submit"
                disabled={!submittable}
            >
                {t('SAVE')}
            </Button>
        </Spin>
    )
}

export default SaveCreateServiceSubscriptionButton
