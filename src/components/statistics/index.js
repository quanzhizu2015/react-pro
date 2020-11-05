import React from 'react'
import { withRouter } from 'react-router'
// import _hmt from '_hmt'

@withRouter
export default class Statistics extends React.Component {
    constructor() {
        super()
        this.state = {
            forbiddenUrlPath: [
                '/'
            ]
        }
    }

    componentDidMount() {
        const { pathname } = this.props.location
        this.sendBaiduStatistics(pathname)
    }

    componentWillReceiveProps(newProps) {
        const { pathname } = newProps.location
        this.sendBaiduStatistics(pathname)
    }

    sendBaiduStatistics(url) {
        const { forbiddenUrlPath } = this.state
        if (!forbiddenUrlPath.includes(url)) {
            try {
                // _hmt.push(['_trackPageview', url])
            } catch (e) {
                // console.log(e)
            }
        }
    }

    render() {
        return null
    }
}
