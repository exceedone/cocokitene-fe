/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useSettingRoleMtg } from '@/stores/setting-role-mtg/hook'
import { EActionStatus } from '@/stores/type'
import serviceSettingRoleMtg from '@/services/setting-role-mtg'
import { TypeRoleMeeting } from '@/constants/role-mtg'
import { AxiosError } from 'axios'
import {
    Button,
    Form,
    Input,
    Modal,
    notification,
    Row,
    Select,
    Spin,
} from 'antd'
import { useTranslations } from 'next-intl'
import { enumToArray } from '@/utils'
import { IRoleMtgForm } from '@/views/setting-role/modal-register-role-mtg'
import { convertSnakeCaseToTitleCase } from '@/utils/format-string'

export interface IRoleMtgUpdateForm {
    roleName: string
    description: string
    type: TypeRoleMeeting | string
}

const ModalUpdateRoleMtg = () => {
    const t = useTranslations()

    const {
        settingRoleMtgState,
        getListRoleMtgAction,
        setOpenModalUpdatedRoleMtg,
        setIdMOpenModalUpdateRoleMtg,
    } = useSettingRoleMtg()

    const [initStatus, setInitStatus] = useState<EActionStatus>(
        EActionStatus.Idle,
    )
    const [form] = Form.useForm()
    const [initRoleMtg, setInitRoleMtg] = useState<IRoleMtgUpdateForm>()
    const roleMtgId = Number(settingRoleMtgState.id)
    useEffect(() => {
        const fetchData = async () => {
            setInitStatus(EActionStatus.Pending)
            try {
                const res =
                    await serviceSettingRoleMtg.getDetailRoleMtg(roleMtgId)
                if (res) {
                    setInitRoleMtg({
                        roleName: t(res.roleName),
                        description: res.description,
                        type: res.type,
                    })
                }

                setInitStatus(EActionStatus.Succeeded)
            } catch (error) {
                if (error instanceof AxiosError) {
                    notification.error({
                        message: t('ERROR'),
                        description: error.response?.data.info.message,
                    })
                }

                setInitStatus(EActionStatus.Failed)
            }
        }
        if (roleMtgId) {
            fetchData()
        }
    }, [roleMtgId])
    useEffect(() => {
        form.setFieldsValue({
            roleName: convertSnakeCaseToTitleCase(initRoleMtg?.roleName ?? ''),
            type: convertSnakeCaseToTitleCase(
                initRoleMtg?.type === TypeRoleMeeting.NULL_MEETING
                    ? ''
                    : initRoleMtg?.type,
            ),
            description: initRoleMtg?.description,
        })
    }, [initRoleMtg])
    const handleOk = () => {}

    const handleCancel = () => {
        form.resetFields()
        setOpenModalUpdatedRoleMtg(false)
        setIdMOpenModalUpdateRoleMtg(0)
        setInitRoleMtg(undefined)
    }
    const onFinish = async (values: IRoleMtgForm) => {
        let type = values?.type

        if (!type || type.trim() === '') {
            type = TypeRoleMeeting.NULL_MEETING
        } else {
            // @ts-ignore
            type = type.trim().toUpperCase().replace(/\s+/g, '_')
        }
        try {
            const res = await serviceSettingRoleMtg.updateRoleMtg(roleMtgId, {
                roleName: values.roleName
                    .trim()
                    .toUpperCase()
                    .replace(/ +/g, '_'),
                description: values.description,
                type: type ?? TypeRoleMeeting.NULL_MEETING,
            })

            if (res) {
                notification.success({
                    message: t('UPDATED'),
                    description: t('UPDATE_ROLE_MTG_SUCCESSFULLY'),
                })
                form.resetFields()
                setOpenModalUpdatedRoleMtg(false)
                setIdMOpenModalUpdateRoleMtg(0)
                getListRoleMtgAction(settingRoleMtgState)
                setInitRoleMtg(undefined)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: error?.response?.data.info.message,
                })
            }
        }
    }
    // if (!initRoleMtg || initStatus === EActionStatus.Pending) {
    //     return <Loader />
    // }

    return (
        <Modal
            title={t('TITLE_UPDATE_ROLE_MTG')}
            open={settingRoleMtgState.openModalUpdateRoleMtg}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            maskClosable={false}
            centered
        >
            <div className="mb-6">
                {!initRoleMtg || initStatus === EActionStatus.Pending ? (
                    <Row
                        align={'middle'}
                        justify={'center'}
                        style={{ height: '40vh' }}
                    >
                        <Spin tip="Loading..." />
                    </Row>
                ) : (
                    <Form
                        layout="vertical"
                        form={form}
                        initialValues={{ ...initRoleMtg }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="roleName"
                            label={t('ROLE_MTG_NAME')}
                            rules={[
                                {
                                    required: true,
                                    message: t(
                                        'PLEASE_INPUT_YOUR_ROLE_MTG_NAME',
                                    ),
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder={t('ROLE_MTG_NAME')}
                            />
                        </Form.Item>
                        <Form.Item name="description" label={t('DESCRIPTION')}>
                            <Input
                                size="large"
                                placeholder={t('DESCRIPTION')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label={t('SELECT_TYPE_ROLE_MTG')}
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: t('PLEASE_INPUT_YOUR_TYPE'),
                            //     },
                            // ]}
                        >
                            <Select
                                placeholder={t('TYPE')}
                                style={{ width: '100%' }}
                                size="large"
                                options={enumToArray(TypeRoleMeeting).map(
                                    (type) => ({
                                        value: type,
                                        label: (
                                            <span>
                                                {convertSnakeCaseToTitleCase(
                                                    type ===
                                                        TypeRoleMeeting.NULL_MEETING
                                                        ? ''
                                                        : type,
                                                )}
                                            </span>
                                        ),
                                    }),
                                )}
                            />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ span: 24 }}
                            className="mt-10 flex justify-center"
                        >
                            <Button
                                size="large"
                                className="bg-#5151E5 rounded text-center text-sm font-semibold shadow-sm transition duration-200 hover:border-white hover:bg-[#e9eaeb] hover:text-black"
                                style={{ marginRight: '30px' }}
                                onClick={handleCancel}
                            >
                                {t('CANCEL')}
                            </Button>
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                className="bg-#5151E5 rounded text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 "
                            >
                                {t('SUBMIT')}
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </Modal>
    )
}

export default ModalUpdateRoleMtg
