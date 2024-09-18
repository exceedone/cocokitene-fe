import { Col, Row } from 'antd'
import { ReactNode } from 'react'

export interface IRowShareholderInfo {
    label: ReactNode
    content: ReactNode
    xs?: number
    lg?: number
}
export const RowShareholderInfo = ({ label, content }: IRowShareholderInfo) => {
    return (
        <Row gutter={[0, 0]} className="min-h-[40px]">
            <Col className="w-[130px] whitespace-nowrap">
                {label && (
                    <p className="w-[100%] text-sm text-black-45">{label}:</p>
                )}
            </Col>
            <Col className="flex-1 pb-3 pl-1 text-sm text-black/[85%]">
                {content}
            </Col>
        </Row>
    )
}
