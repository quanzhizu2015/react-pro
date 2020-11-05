import React, { Component } from 'react'
// import Img3 from '../../assets/img/message/3.png'
import './message.scss'

export default class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // duration: props.duration
        }
        this.dismiss = this.dismiss.bind(this)
    }

    componentDidMount() {
        const { duration } = this.props
        if (duration > 0) {
            this.timeout = setTimeout(this.dismiss, duration * 1000)
        }
    }

    dismiss() {
        this.props.onClose(this.props.id)
    }

    render() {
        const { content, ...props } = this.props
        delete props.duration
        return (
            <div className="alert-zhezhao" >
                <div className="alert-info" >
                    {/* <img src={Img3} alt="" /><br /> */}
                    <i className="iconfont iconGroup2" /><br />
                    <p>{this.props.title}</p>
                    <p className="alert-p">{this.props.content}</p>
                </div>
            </div>
        )
    }
}
