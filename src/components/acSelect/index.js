import React, { Component } from 'react'
import { withFormsy, propTypes } from 'formsy-react'
import { autobind } from 'core-decorators'
import arealist from '../../tools/area'
import { I18n } from 'react-i18next'
import './index.scss'

@withFormsy
export default class AcSelect extends Component {
    static defaultProp = {
        type: 'text'
    }
    static propTypes = {
        ...propTypes
    }
    constructor(props) {
        super(props)
        this.state = {
            area: 'CN',
            code: '+86',
            showNation: false,
        }
        this.onChange = this.onChange.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
    }
    componentWillMount() {
        this.setSelected(this.state.area)
        window.addEventListener('click', this.hide)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.hide)
    }
    onChange(e) {
        this.setSelected(e)
    }
    setSelected(e) {
        for (let i = 0; i < arealist.length; i += 1) {
            if (arealist[i].key === e) {
                this.setState({
                    area: arealist[i].name_en,
                    code: `+${arealist[i].code}`
                })
                this.props.setValue(arealist[i])
                break
            }
        }
    }
    @autobind
    hide() {
        if (this.onShow || !this.state.showNation) {
            this.onShow = false
            return
        }
        this.setState({
            showNation: false
        })
    }
    @autobind
    clickHanlder() {
        this.onShow = true
        this.setState({
            showNation: !this.state.showNation
        })
    }
    handleSelectChange(e) {
        for (let i = 0; i < arealist.length; i += 1) {
            if (arealist[i].key === e) {
                this.setState({
                    area: arealist[i].name_en,
                    code: `+${arealist[i].code}`
                })
                this.props.setValue(arealist[i])
                break
            }
        }
        // this.state.area = e.target.value
        this.setState({
            showNation: !this.state.showNation
        })
        // this.setState({})
        // this.setSelected()
    }
    render() {
        const errorMessage = this.props.getErrorMessage()
        return (
            <I18n>
                {
                    (t, { i18n }) => {
                        const lng = i18n.language
                        return (
                            <div className="ac-select" >
                                <i className={['iconfont ac-input-icon', this.props.icon].join(' ')} />
                                <input
                                    value={this.state.code}
                                    onChange={this.onChange}
                                    placeholder={this.props.placeholder}
                                    onClick={this.clickHanlder}
                                />
                                {
                                    this.state.showNation === true ?
                                        <ul>
                                            {
                                                arealist.map(item => (
                                                    <li key={item.key} onClick={() => this.handleSelectChange(`${item.key}`)}>
                                                        {item[`name_${lng}`]}&nbsp;{item.code}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        :
                                        null
                                }
                                <span className="ac-error">{errorMessage}</span>
                            </div>
                        )
                    }
                }
            </I18n>

        )
    }
}
