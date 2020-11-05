import React, { Component } from 'react'

import './index.scss'

export default class TradeMenu extends Component {
    constructor() {
        super()
        this.state = {
            visible: false
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
    showMenu(e) {
        if (!this.state.visible) {
            e.stopPropagation()
            this.setState({
                visible: true
            })
        }
    }
    hideMenu() {
        this.setState({
            visible: false
        })
    }
    render() {
        return (
            <div className="trade-menu" style={this.props.style} >
                <button type="button" onClick={this.showMenu}>{this.props.children}</button>
                {
                    this.state.visible ?
                        <ul ref={(menuUl) => { this.menuUl = menuUl }} >
                            {this.props.items.map((item, i) => (<li key={i}>{item}</li>))}
                        </ul> :
                        null
                }
            </div>
        )
    }
}
