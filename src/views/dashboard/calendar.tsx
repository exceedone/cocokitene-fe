import { Calendar, Col, Row, Select } from 'antd'
import type { Dayjs } from 'dayjs'

interface ICalendarCustom {
    isSupperAdmin: boolean
    // eslint-disable-next-line
    onSelectDate: (newValue: Dayjs) => void
}

const CalendarCustom = ({ isSupperAdmin, onSelectDate }: ICalendarCustom) => {
    return (
        <>
            <Calendar
                mode={isSupperAdmin ? 'year' : 'month'}
                fullscreen={false}
                headerRender={({ value, onChange }) => {
                    const start = 0
                    const end = 12
                    const monthOptions = []

                    let current = value.clone()
                    // @ts-ignore
                    const localeData = value.localeData()
                    const months = []
                    for (let i = 0; i < 12; i++) {
                        current = current.month(i)
                        months.push(localeData.monthsShort(current))
                    }

                    for (let i = start; i < end; i++) {
                        monthOptions.push(
                            <Select.Option
                                key={i}
                                value={i}
                                className="month-item"
                            >
                                {months[i]}
                            </Select.Option>,
                        )
                    }

                    const year = new Date().getFullYear()
                    const month = value.month()
                    const options = []
                    for (let i = year - 5; i < year + 5; i += 1) {
                        options.push(
                            <Select.Option
                                key={i}
                                value={i}
                                className="year-item"
                            >
                                {i}
                            </Select.Option>,
                        )
                    }
                    return (
                        <div style={{ padding: 8 }}>
                            <Row gutter={8}>
                                <Col>
                                    <Select
                                        size="small"
                                        dropdownMatchSelectWidth={false}
                                        className="my-year-select"
                                        value={value.year()}
                                        onChange={(newYear) => {
                                            const now = value
                                                .clone()
                                                .year(newYear)
                                            onChange(now)
                                        }}
                                    >
                                        {options}
                                    </Select>
                                </Col>
                                <Col>
                                    <Select
                                        size="small"
                                        dropdownMatchSelectWidth={false}
                                        value={month}
                                        onChange={(newMonth) => {
                                            const now = value
                                                .clone()
                                                .month(newMonth)
                                            onChange(now)
                                        }}
                                    >
                                        {monthOptions}
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    )
                }}
                onSelect={onSelectDate}
            />
        </>
    )
}

export default CalendarCustom
