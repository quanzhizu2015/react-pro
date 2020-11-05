import React, { Component } from 'react'
import './loadableHandler.scss'

export default class Loading2 extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="loadable-loading">
                <div className="fota-loader" />
            </div>
        )
    }
}
