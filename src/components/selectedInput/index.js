import React from 'react'
import { I18n } from 'react-i18next'
import './selectedInput.scss'


class SelectedInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectKey: this.props.selectDefault || '',
            showNation: false,
            infolist: this.props.infolist,
            nationality: this.props.selectDefault ? this.findSelectedValue(this.props.selectDefault, this.props.infolist) : '',
        }
    }
    componentDidMount() {
        document.body.addEventListener('click', this.onBlurHandler, false)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectDefault !== this.props.selectDefault) {
            this.setState({
                nationality: this.findSelectedValue(nextProps.selectDefault)
            })
        }
        if (nextProps.infolist !== this.props.infolist) {
            this.setState({
                nationality: this.findSelectedValue(this.state.selectKey, nextProps.infolist),
                infolist: nextProps.infolist,
            })
        }
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.onBlurHandler, false)
    }
    onBlurHandler = (e) => {
        if (e !== undefined && e !== null
            && e.target !== undefined && e.target !== null) {
            const element = e.target
            if (element.className !== 'select-input'
                && element.className !== 'iconfont iconmsnui-triangle-down icon-select'
                && element.className !== 'submenu-style') {
                this.setState({
                    showNation: false
                })
            }
        }
        // console.error(e)
    }
    shoushaixuan = () => {
        if (!this.props.disable) {
            this.setState({
                showNation: !this.state.showNation
            })
        }
    }
    checkUl = (key) => {
        if (this.props.onSelectChange !== null && this.props.onSelectChange !== undefined) {
            this.props.onSelectChange(key)
        }
        this.setState({
            nationality: this.findSelectedValue(key),
            showNation: false,
            selectKey: key,
        })
    }
    findSelectedValue = (key, infolistIn) => {
        // 查找对应的value
        // 将key分割
        const infolist = infolistIn !== null && infolistIn !== undefined ? infolistIn : this.state.infolist
        const keys = key.split('_')
        let nationalityValue = this.state && this.state.nationality ? this.state.nationality : ''
        for (let i = 0; i < infolist.length; i += 1) {
            if (infolist[i].key === keys[0] && infolist[i].code === keys[1]) {
                nationalityValue = infolist[i].value
                break
            }
        }
        return nationalityValue
    }
    render() {
        const inputStyle = {
            width: this.props.width ? this.props.width : '350px',
            height: this.props.height ? this.props.height : '30px',
            borderBottom: this.props.disable ? 0 : '1px solid #D6DAE2',
            cursor: !this.props.disable ? 'pointer' : ''
        }
        const { className } = this.props
        const classes = ['label-style', className]
        return (
            <div>
                <I18n>
                    {t => (
                        <div style={{ display: 'flex' }}>
                            <p className={classes.join(' ')}>{t(this.props.label)}</p>
                            <span className="input-style">
                                <span onClick={() => { this.shoushaixuan() }}>
                                    {/* <input
                                        onChange={this.onChange}
                                        value={this.state.nationality}
                                        className="select-input"
                                        style={inputStyle}
                                    /> */}
                                    <p className="select-input" style={inputStyle}>
                                        {this.state.nationality}
                                        <span>
                                            <i className="iconfont iconmsnui-triangle-down icon-select" style={{ display: this.props.disable ? 'none' : '' }} />
                                        </span>
                                    </p>
                                </span>
                                {
                                    this.state.showNation === true && !this.props.disable ?
                                        <div className="tradeShai">
                                            <ul>
                                                {this.state.infolist.map(item => (
                                                    <li
                                                        className="submenu-style"
                                                        key={`${item.key}_${item.code}`}
                                                        onClick={() => this.checkUl(`${item.key}_${item.code}`)}
                                                    >
                                                        {item.value}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        :
                                        null
                                }
                            </span>
                        </div>
                    )}
                </I18n>
            </div>
        )
    }
}

export default SelectedInput
