import React from 'react'
import './moneySelect.scss'


class MoneySelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDropMenu: false,
            inputValue: this.props.selectDefault ? this.findSelectedValue(this.props.selectDefault) : '',
            records: this.props.records ? this.props.records : [],
            style: {}
        }
    }
    componentDidMount() {
        // 获取input的width
        // this.setUlWidth()
        this.setUlStyle()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.setState({
                inputValue: '',
                records: nextProps.records ? nextProps.records : []
            })
        } else {
            this.setState({
                records: nextProps.records ? nextProps.records : []
            })
        }
    }
    onBlurHandler = () => {
        setTimeout(() => {
            this.setState({
                showDropMenu: false
            })
        }, 300)
    }
    onChange = (e) => {
        if (this.props.onChange !== null && this.props.onChange !== undefined) {
            this.props.onChange(e.target.value)
        }
        this.setState({
            inputValue: e.target.value
        })
    }
    // setUlWidth = () => {
    //     this.setState({
    //         ulWidth: this.inputRef.clientWidth
    //     })
    // }
    setUlStyle = () => {
        // 计算input向左移动多少px
        let marginLeft = 0
        let ulWidth = 0
        if (this.selectRef && this.inputRef) {
            marginLeft = this.inputRef.offsetLeft - this.selectRef.offsetLeft
            ulWidth = this.inputRef.clientWidth
        }
        this.setState({
            style: {
                width: ulWidth,
                marginLeft
            }
        })
    }
    shoushaixuan = () => {
        this.setState({
            showDropMenu: !this.state.showDropMenu
            // showDropMenu: true
        })
    }
    checkUl = (key) => {
        if (this.props.onChange !== null && this.props.onChange !== undefined) {
            this.props.onChange(key)
        }
        this.setState({
            inputValue: key,
            showDropMenu: false
            // showDropMenu: true
        })
    }
    findSelectedValue = (key) => {
        // 查找对应的value
        let inputValue = this.state && this.state.inputValue ? this.state.inputValue : ''
        for (let i = 0; i < this.props.records.length; i += 1) {
            if (this.props.records[i].key === key) {
                inputValue = this.props.records[i].value
                break
            }
        }
        return inputValue
    }
    render() {
        return (
            <div>
                <div ref={(select) => { this.selectRef = select }} style={{ display: 'flex' }}>
                    <span className="input-style">
                        <span onClick={() => { this.shoushaixuan() }}>
                            <input
                                ref={(inputRef) => { this.inputRef = inputRef }}
                                onChange={this.onChange}
                                value={this.state.inputValue}
                                className={this.props.inputClass ? this.props.inputClass : 'select-input'}
                                placeholder={this.props.placeholder ? this.props.placeholder : '123'}
                                onBlur={this.onBlurHandler}
                            />
                        </span>
                        {
                            this.state.showDropMenu === true
                            && this.state.records && this.state.records.length > 0 ?
                                <div className="tradeShai" style={this.state.style}>
                                    <ul>
                                        {
                                            // this.state.records ?
                                            this.state.records.map((item, index) => (
                                                <li
                                                    className="submenu-style"
                                                    key={index}
                                                    onClick={() => this.checkUl(item.value)}
                                                >
                                                    {
                                                        item.dropValue ?
                                                            item.dropValue
                                                            :
                                                            item.value
                                                    }
                                                </li>
                                            ))
                                            // :
                                            // null
                                        }
                                    </ul>
                                </div>
                                :
                                null
                        }
                    </span>
                </div>
            </div>
        )
    }
}

export default MoneySelect
