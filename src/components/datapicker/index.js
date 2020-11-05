import React from 'react'
import { I18n } from 'react-i18next'
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker

class DataPicker extends React.Component {
    handleChange = (date, dateString) => {
        const dateRange = {}
        if (date.length !== 0 && dateString !== null && dateString !== undefined && dateString.length === 2) {
            // dateRange.startTime = dateString[0]
            // dateRange.endTime = dateString[1]
            // let { startTime, endTime } = dataString
            // const startTime = date[0]
            // const endTime = date[1].add(1, 'd').subtract(1, 'seconds')
            // dateRange.startTime = startTime.format('YYYY-MM-DD')
            // dateRange.endTime = endTime.format('YYYY-MM-DD')
            [dateRange.startTime, dateRange.endTime] = dateString
            if (dateRange.startTime !== '') {
                dateRange.startTime = `${dateRange.startTime} 00:00:00`
            }
            if (dateRange.endTime !== '') {
                dateRange.endTime = `${dateRange.endTime} 23:59:59`
            }
        }
        if (this.props.onChange !== undefined && this.props.onChange !== null) {
            this.props.onChange(dateRange)
        }
    }
    render() {
        const dateFormat = 'YYYY-MM-DD'
        return (
            <I18n>
                {
                    t => (
                        <div className={this.props.className ? this.props.className : ''}>
                            <RangePicker
                                style={{ height: '25px' }}
                                format={dateFormat}
                                onChange={this.handleChange}
                                placeholder={[t('fundManage.startTime'), t('fundManage.endTime')]}
                            />
                        </div>
                    )
                }
            </I18n>
        )
    }
}

export default DataPicker
