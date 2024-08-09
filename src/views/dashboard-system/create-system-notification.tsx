import LayoutTitle, {
    IBaseTitle,
} from '@/components/content-page-title/layout-title'
import ViewHtml from '@/components/view-html'
import { FETCH_STATUS } from '@/constants/common'
import { ScreenDashBoard } from '@/constants/dash-board'
import serviceDashBoard from '@/services/system-admin/dash-board'
import {
    ArrowLeftOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
} from '@ant-design/icons'
import {
    Button,
    Col,
    Form,
    Input,
    notification,
    Row,
    Spin,
    Typography,
} from 'antd'
import { useForm, useWatch } from 'antd/es/form/Form'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { FormInstance } from 'rc-field-form'
import { ReactNode, useEffect, useMemo, useState } from 'react'

import 'react-quill/dist/quill.snow.css'

const { Title } = Typography

interface IHeaderScreenSysNotification extends IBaseTitle {
    saveButton?: ReactNode
    extraButton?: ReactNode
    // eslint-disable-next-line
    changeScreen: (screen: ScreenDashBoard) => void
}

const Header = ({
    pageName,
    saveButton,
    extraButton,
    changeScreen,
}: IHeaderScreenSysNotification) => {
    const t = useTranslations()
    return (
        <LayoutTitle>
            <div className="flex items-center gap-2">
                <ArrowLeftOutlined
                    onClick={() => {
                        changeScreen(ScreenDashBoard.DASH_BOARD)
                    }}
                />
                <Title level={4} className="mb-0 font-medium">
                    {t(pageName)}
                </Title>
            </div>
            <div className="flex items-center gap-2">
                {saveButton}
                {extraButton}
            </div>
        </LayoutTitle>
    )
}

// Save Button
interface ISystemNotification {
    form: FormInstance<ISystemNotificationForm>
    isLoading: boolean
}

const SaveButton = ({ form, isLoading }: ISystemNotification) => {
    const t = useTranslations()
    const [submittable, setSubmittable] = useState(false)

    // Watch all values
    const values = useWatch([], form)

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                if (
                    values.content.replace(/<(.|\n)*?>/g, '').trim().length != 0
                ) {
                    setSubmittable(true)
                } else {
                    setSubmittable(false)
                }
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

interface ISystemNotificationForm {
    title: string
    content: string
}

interface ICreateSystemNotification {
    // eslint-disable-next-line
    changeScreen: (screen: ScreenDashBoard) => void
}

const CreateSystemNotificationScreen = ({
    changeScreen,
}: ICreateSystemNotification) => {
    const ReactQuill = useMemo(
        () => dynamic(() => import('react-quill'), { ssr: false }),
        [],
    )

    const t = useTranslations()

    const [status, setStatus] = useState(FETCH_STATUS.IDLE)
    const [value, setValue] = useState('')
    const [showPreView, setShowPreView] = useState<boolean>(false)

    const [form] = useForm<ISystemNotificationForm>()

    const onFinish = async (values: ISystemNotificationForm) => {
        setStatus(FETCH_STATUS.LOADING)
        console.log('values: ', values)
        try {
            const response = await serviceDashBoard.createSystemNotification(
                values,
            )

            if (response) {
                notification.success({
                    message: t('CREATED'),
                    description: t('CREATED_SYSTEM_NOTIFICATION_SUCCESSFULLY'),
                    duration: 2,
                })
                setStatus(FETCH_STATUS.SUCCESS)
                changeScreen(ScreenDashBoard.DASH_BOARD)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t(error.response?.data.info.message),
                    duration: 3,
                })
            }
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    return (
        <div>
            <div>
                <div className="bg-white px-6 pb-6 shadow-01">
                    <Form onFinish={onFinish} form={form} layout="vertical">
                        <Header
                            pageName={
                                ScreenDashBoard.CREATE_SYSTEM_NOTIFICATION
                            }
                            changeScreen={changeScreen}
                            saveButton={
                                <SaveButton
                                    form={form}
                                    isLoading={status === FETCH_STATUS.LOADING}
                                />
                            }
                        />
                        <div className="p-6">
                            <Row gutter={[16, 24]}>
                                <Col xs={24} lg={24}>
                                    <Form.Item
                                        name="title"
                                        label={t('TITLE_SYSTEM_NOTI')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('ENTER_TITLE'),
                                            },
                                        ]}
                                    >
                                        <Input size="large" maxLength={250} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={24}>
                                    <Form.Item
                                        name="content"
                                        label={t('CONTENT')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('ENTER_TITLE'),
                                            },
                                        ]}
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className="mb-4 h-36"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="mt-2 min-h-[100px]">
                                <div>
                                    {showPreView ? (
                                        <Button
                                            onClick={() =>
                                                setShowPreView(false)
                                            }
                                            type="dashed"
                                            size="small"
                                            className="flex items-center"
                                        >
                                            <EyeInvisibleOutlined />
                                            <span>Preview</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setShowPreView(true)
                                            }}
                                            type="dashed"
                                            size="small"
                                            className="flex items-center"
                                        >
                                            <EyeOutlined />
                                            <span>Preview</span>
                                        </Button>
                                    )}
                                </div>
                                {showPreView && <ViewHtml value={value} />}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default CreateSystemNotificationScreen
