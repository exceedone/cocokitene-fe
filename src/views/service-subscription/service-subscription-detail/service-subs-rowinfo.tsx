import { ReactNode } from 'react'
import { Col, Row } from 'antd'

export interface IRowServiceSubscriptionInfo {
    label: ReactNode
    content: ReactNode
    xs?: number
    lg?: number
}
export const RowServiceSubscriptionInfo = ({
    label,
    content,
}: IRowServiceSubscriptionInfo) => {
    return (
        <Row gutter={[0, 16]} className="min-h-[40px]">
            <Col className="w-[130px] whitespace-nowrap">
                {label && (
                    <p className="w-[100%] text-sm text-black-45">{label} :</p>
                )}
            </Col>
            <Col className="flex-1 pb-3 pl-1 text-sm text-black/[85%]">
                {content}
            </Col>
        </Row>
    )
}
