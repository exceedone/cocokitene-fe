'use client'

import {
    EnvironmentTwoTone,
    MailTwoTone,
    MobileTwoTone,
    PhoneTwoTone,
} from '@ant-design/icons'
import { Button, Col, Form, Input, notification, Row, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useForm } from 'antd/es/form/Form'
import serviceCompany from '@/services/system-admin/company'
import { useState } from 'react'
import { FETCH_STATUS } from '@/constants/common'
import { AxiosError } from 'axios'

const { Title, Text } = Typography

export interface IContactForm {
    username: string
    email: string
    company: string
    phone: string
    note?: string | null
}

const ContactSection = () => {
    const t = useTranslations()
    const [form] = useForm<IContactForm>()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE)

    const onFinish = async (values: IContactForm) => {
        setStatus(FETCH_STATUS.LOADING)
        try {
            const response =
                await serviceCompany.sendMailRegisterCompanyLandingPage({
                    email: values.email,
                    phone: values.phone,
                    username: values.username,
                    company: values.company,
                    note: values.note || '',
                })
            if (response) {
                notification.success({
                    message: t('CREATED'),
                    description: t('SEND_EMAIL_TO_SYSTEM_ADMIN_SUCCESSFULLY'),
                    duration: 2,
                })
                form.resetFields()
                setStatus(FETCH_STATUS.SUCCESS)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: error.response?.data.info.message,
                    duration: 3,
                })
            }
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const groupContactClass = 'flex gap-2 font-normal'

    return (
        <div id="contact" className="sm:bg-gray-sunset">
            <div className="bg-covert relative mx-auto my-0 min-h-[790px] max-w-[1250px] bg-no-repeat max-lg:bg-login-bg lg:bg-landing-registration-bg">
                <div className="registration-form__wrapper absolute top-1/2 w-[100%] -translate-y-1/2 bg-white p-8 max-lg:left-1/2 max-lg:-translate-x-1/2 sm:drop-shadow-md md:right-0 md:mr-7 md:w-[560px]">
                    <Title className="text-center font-bold" level={2}>
                        {t('SEND_YOUR_REGISTRATION')}
                    </Title>
                    <div className="registration-form__content">
                        <Form
                            name="basic"
                            // labelCol={{ span: 8 }}
                            // wrapperCol={{ span: 16 }}
                            // style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Row gutter={[24, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={t('YOUR_NAME')}
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'PLEASE_INPUT_YOUR_NAME',
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={t('EMAIL')}
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'PLEASE_INPUT_YOUR_EMAIL',
                                                ),
                                            },
                                            {
                                                type: 'email',
                                                message: t(
                                                    'PLEASE_INPUT_A_VALID_EMAIL',
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={t('COMPANY')}
                                        name="company"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'PLEASE_INPUT_YOUR_COMPANY',
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={t('PHONE_NUMBER')}
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'PLEASE_INPUT_YOUR_PHONE_NUMBER',
                                                ),
                                            },
                                            {
                                                pattern: new RegExp(/^[0-9]+$/),
                                                message: t(
                                                    'PLEASE_ENTER_ONLY_NUMBER',
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24}>
                                    <Form.Item label={t('NOTE')} name="note">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col
                                    xs={24}
                                    sm={12}
                                    className="mx-auto text-center"
                                >
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            loading={
                                                status === FETCH_STATUS.LOADING
                                            }
                                        >
                                            {t('SUBMIT')}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="contact-information flex flex-wrap gap-3 sm:flex-col">
                        <div className="w-full">
                            <Title level={5} className="font-bold">
                                {t('CONTACT_INFORMATION')}
                            </Title>
                        </div>
                        <div className={`${groupContactClass} w-full`}>
                            <EnvironmentTwoTone />
                            <Text>{t('CONTACT_ADDRESS')}</Text>
                        </div>
                        <div className={`${groupContactClass} w-full`}>
                            <MailTwoTone />
                            <Text>info@exceedone.co.jp</Text>
                        </div>
                        <div className={`${groupContactClass} mr-5`}>
                            <MobileTwoTone />
                            <Text>03-5625-0900</Text>
                        </div>
                        <div className={groupContactClass}>
                            <PhoneTwoTone />
                            <Text>03-5625-0901</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactSection
