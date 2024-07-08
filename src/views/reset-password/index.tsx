import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Form, Input, Typography, notification } from 'antd'
import { useEffect, useState } from 'react'
import AuthLayout from '@/components/auth-layout'
import { useNotification } from '@/hooks/use-notification'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import servicePassword from '@/services/system-admin/forgot-password'
import { AxiosError } from 'axios'
import { now } from 'moment'

const { Text } = Typography

const ResetPassword = () => {
    const [countdown, setCountdown] = useState<number>()

    const { contextHolder } = useNotification()
    const t = useTranslations()
    const router = useRouter()

    const [form] = Form.useForm()
    const [confirmPasswordError, setConfirmPasswordError] = useState<
        string | null
    >(null)

    //Get Token on Param Url
    const searchParams = useSearchParams()
    const tokenFromUrl = searchParams.get('token')

    useEffect(() => {
        if (tokenFromUrl) {
            const token = tokenFromUrl.split('-')
            const expireTime = new Date(token[1].split('GMT')[0])
            const currentTime = new Date(now())

            const diffInSeconds = Math.round(
                (expireTime.getTime() - currentTime.getTime()) / 1000,
            )
            setCountdown(diffInSeconds)
        }
        const timer = setInterval(() => {
            setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [tokenFromUrl])

    const onFinish = async (values: any) => {
        if (tokenFromUrl) {
            try {
                const token = tokenFromUrl.split('-')[0]
                const response = await servicePassword.createNewPassWord(
                    token,
                    values,
                )
                if (response) {
                    notification.success({
                        message: t('SUCCESS'),
                        description: t('CHANGE_PASSWORD_SUCCESS'),
                        duration: 2,
                    })
                    router.push('/login')
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    notification.error({
                        message: t('ERROR'),
                        description: t('CHANGE_PASSWORD_FAILED'),
                        duration: 3,
                    })
                }
            }
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const validatePassword = (_: any, value: string) => {
        const regex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!value) {
            return Promise.reject(t('PLEASE_ENTER_NEW_PASSWORD'))
        }

        if (!regex.test(value)) {
            return Promise.reject(t('VALID_PASSWORD'))
        }

        // Reset confirm password error when password changes
        form.setFields([{ name: 'confirmPassword', errors: [] }])
        setConfirmPasswordError(null)

        return Promise.resolve()
    }

    return (
        <>
            <AuthLayout>
                {contextHolder}
                <div className="mb-10 flex items-center justify-center gap-5">
                    <Image
                        src={'/images/logo-icon.png'}
                        alt={''}
                        width={48}
                        height={48}
                    />
                    <Text className="text-3xl font-bold">
                        {t('COCOKITENE')}
                    </Text>
                </div>
                <div>
                    <div className="flex items-center">
                        <Text className="mx-auto text-3xl font-bold ">
                            {t('RESET_PASSWORD')}
                        </Text>
                    </div>
                    <div className="mt-3 flex items-center justify-center">
                        <Text className="text-sm">
                            {t('PLEASE_ENTER_NEW_PASSWORD')}
                        </Text>
                    </div>
                    <div className="mb-4 flex items-center justify-center">
                        {countdown !== 0 ? (
                            <Text className="text-sm">
                                {t('THE_LINK_EXPIRES_AFTER_{second}_SECONDS', {
                                    second: countdown,
                                })}
                            </Text>
                        ) : (
                            <div className="text-red-500">
                                {t('LINK_HAS_EXPIRED')}
                            </div>
                        )}
                    </div>
                    {countdown ? (
                        <div className="mb-6">
                            <Form
                                name="resetPassword"
                                layout="vertical"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    style={{ marginBottom: '24px' }}
                                    className="font-semibold"
                                    name="password"
                                    label={t('NEW_PASSWORD')}
                                    rules={[
                                        {
                                            required: true,
                                            validator: validatePassword,
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        size="large"
                                        className="font-normal"
                                    />
                                </Form.Item>

                                <Form.Item
                                    style={{ marginBottom: '24px' }}
                                    className="font-semibold"
                                    name="confirmPassword"
                                    label={t('CONFIRM_PASSWORD')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                'REQUIRE_CONFIRM_PASSWORD',
                                            ),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        'password',
                                                    ) === value
                                                ) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            'VALID_CONFIRM_PASSWORD',
                                                        ),
                                                    ),
                                                )
                                            },
                                        }),
                                    ]}
                                    validateStatus={
                                        confirmPasswordError ? 'error' : ''
                                    }
                                    help={confirmPasswordError}
                                >
                                    <Input.Password
                                        size="large"
                                        className="font-normal"
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginBottom: '24px' }}>
                                    <Button
                                        size="large"
                                        type="primary"
                                        htmlType="submit"
                                        className="bg-#5151E5 w-full rounded text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 "
                                    >
                                        {t('BTN_CONFIRM')}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    ) : (
                        <Button
                            onClick={() => {
                                router.push('/forgot-password')
                            }}
                            size="large"
                            type="primary"
                            htmlType="submit"
                            className="w-full rounded bg-[#5151E5] text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 "
                        >
                            {t('BACK_TO_PREVIOUS_PAGE')}
                        </Button>
                    )}
                </div>
            </AuthLayout>
        </>
    )
}

export default ResetPassword
