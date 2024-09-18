import { ReactNode } from 'react'
import { Col, Row } from 'antd'

export interface IRowInfo {
    label: string
    content: ReactNode
}

export const RowInfo = ({ label, content }: IRowInfo) => {
    return (
        <Row className="min-h-[40px] py-2" wrap={false}>
            <Col className="w-[150px] whitespace-nowrap">
                {label && (
                    <div className="w-[100%] text-sm text-black-45">
                        {label}:
                    </div>
                )}
            </Col>
            <Col className="flex-1 text-sm text-black/[85%]">{content}</Col>
        </Row>
    )
}
