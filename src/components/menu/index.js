import React, { Component } from 'react'
import cs from 'classnames'

import './index.scss'

export default class Menu extends Component {
    static defaultProps = {
        point: true
    }
    constructor() {
        super()
        this.state = {
            height: 0
        }
        this.showMenu = this.showMenu.bind(this)
        this.hideMenu = this.hideMenu.bind(this)
    }
    componentDidMount() {
        window.addEventListener('click', this.hideMenu, false)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.hideMenu)
    }
    showMenu() {
        if (this.state.height === 0) {
            this.show = true
            this.setState({
                height: this.menuUl.children.length * 45,
            })
        }
    }
    hideMenu() {
        if (this.show) {
            this.show = false
            return
        }
        if (this.state.height !== 0) {
            this.setState({
                height: 0,
            })
        }
    }
    render() {
        return (
            <div className={`ft-menu ${this.state.height === 0 ? null : 'active'} ${this.props.isTheme ? 'ft-menu-theme' : null}`} >
                <div
                    className={cs({
                        'ft-menu-content': true,
                        'ft-menu-point': this.props.point,
                    })}
                    onClick={this.showMenu}
                >
                    <a>{this.props.children}</a>
                </div>
                <ul ref={(menuUl) => { this.menuUl = menuUl }} style={{ marginLeft: `${this.props.mrLeft || 0}px`, width: `${this.props.width}px`, height: `${this.state.height}px` }} >
                    {this.props.items.map((item, i) => (<li key={i}>{item}</li>))}
                </ul>
            </div>
        )
    }
}
