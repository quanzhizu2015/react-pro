import React, { Component } from 'react'
import shapeShifter from './shape-shifter'

export default class ShapeShifter extends Component {
    componentDidMount() {
        shapeShifter.init(this.cs, 'fortuna|web frame')
        setTimeout(() => {
            shapeShifter.UI.reset()
        }, 4000)
    }
    render() {
        return (
            <div>
                <canvas width="600px" ref={(cs) => { this.cs = cs }} />
            </div>
        )
    }
}
