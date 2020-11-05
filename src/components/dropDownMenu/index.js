import React from 'react'
import './dropDownMenu.scss'

class DropDownMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {

    }
    checkUl = (key) => {
        if (this.props.onSelectChange !== null && this.props.onSelectChange !== undefined) {
            this.props.onSelectChange(key)
        }
    }
    render() {
        const width = this.props.width ? this.props.width : '240px'
        return (
            <div className="drop-down-menu">
                <div className="tradeShai" style={{ width }}>
                    <ul>
                        {this.props.infolist.map(item => (
                            <li
                                className="submenu-style"
                                key={item.key}
                                onClick={() => this.checkUl(item.key)}
                            >
                                {item.menus.map((menu, index) => (
                                    <span className="menu-span" key={index} style={{ width: menu.width }}>{menu.value}</span>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default DropDownMenu
