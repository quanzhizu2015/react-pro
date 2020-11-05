import React, { Component } from 'react'
import cs from 'classnames'
import Step from './step'

import './index.scss'

class FtSteps extends Component {
    render() {
        return (
            <div className={cs('ft-step', this.props.className)} >
                {this.props.children.map((item, i) => {
                    let line
                    if (i !== 0) {
                        line = (
                            <div key={`${item.props.value}-line`} className="ft-step-line">
                                <svg xmlns="http://www.w3.org/2000/svg" height="2px" width="63px" version="1.1">
                                    <line
                                        x1="0"
                                        y1="0"
                                        x2="100%"
                                        y2="0"
                                        style={{
                                            stroke: '#AAAFB9',
                                            strokeWidth: 1,
                                            strokeDasharray: '4, 2'
                                        }}
                                    />
                                </svg>
                                {/* <hr className="line" /> */}
                            </div>
                        )
                    }
                    const np = {
                        key: item.props.value,
                        current: this.props.current
                    }
                    return [line, React.cloneElement(item, np)]
                })}
            </div>
        )
    }
}

FtSteps.Step = Step

export default FtSteps
export { Step }
