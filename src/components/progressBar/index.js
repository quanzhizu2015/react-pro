import React from 'react'
import './progressBar.scss'

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: props.step
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            activeStep: nextProps.step
        })
    }
    render() {
        return (
            <div id="proBar">
                <ul>
                    {
                        this.props.words.map((item, index) => {
                            let dashedLine = null
                            let icon = null
                            if (item.icon === 'point') {
                                icon = <div className="point" />
                            } else {
                                icon = <div className="true" />
                            }
                            if (index !== this.props.words.length - 1) {
                                dashedLine = <div className="dashed" />
                            } else {
                                dashedLine = null
                            }
                            return (
                                <li
                                    className={this.state.activeStep === index + 1 ? 'activeStep' : null}
                                    key={index}
                                >
                                    {icon}
                                    <span>{item.word}</span>
                                    {dashedLine}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
