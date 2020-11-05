import React, { Component } from 'react'
import { autobind } from 'core-decorators'

export default class Columnars extends Component {
    constructor() {
        super()
        this.state = {
            cts: 18,
            shapes: [],
            isActive: false,
            per: document.body.offsetWidth / 1920
        }
    }
    componentWillMount() {
        for (let i = 0; i < this.state.cts; i += 1) {
            const h1 = (200 * Math.random()) + 60
            this.state.shapes.push({
                h: -20,
                h1,
                h2: 360 - h1,
                styleType: Math.floor(1 + ((i / 2) % 2))
            })
        }
        this.expand('h1', 1)
        window.addEventListener('resize', this.resizeHandler)
    }
    @autobind
    setH(shapes, tag) {
        for (let i = shapes.length - 1; i >= 0; i -= 1) {
            const item = shapes[i]
            if (item.h === item[tag]) {
                shapes.splice(i, 1)
            } else if (item.h < item[tag]) {
                item.h += 10
                if (item.h > item[tag]) {
                    item.h = item[tag]
                    shapes.splice(i, 1)
                }
            } else if (item.h > item[tag]) {
                item.h -= 10
                if (item.h < item[tag]) {
                    item.h = item[tag]
                    shapes.splice(i, 1)
                }
            }
        }
        this.setState({})
        if (shapes.length !== 0) {
            this.timeAnimate = setTimeout(() => {
                this.setH(shapes, tag)
            }, 10)
        }
    }
    @autobind
    resizeHandler() {
        this.setState({
            per: document.body.offsetWidth / 1920
        })
    }
    expand(tag, sp) {
        if (this.timeAnimate) clearTimeout(this.timeAnimate)
        this.state.isActive = true
        const thiz = this
        const shapes = [...thiz.state.shapes]
        if (sp) {
            shapes.sort(() => (0.5 - Math.random()))
            const s = shapes.length / sp
            for (let i = 0; i < sp; i += 1) {
                setTimeout(() => {
                    this.setH(shapes.splice(0, s), tag)
                }, i * 300)
            }
        } else {
            this.setH(shapes, tag)
        }
    }
    drawShapeD() {
        const ta = []
        for (let i = 0; i < this.state.shapes.length; i += 1) {
            const { h, styleType } = this.state.shapes[i]
            ta.push(<path key={`shape-left${i}`} d={`M ${120 * i} ${320 - h} v ${h + 6} h 61 v ${-h} Z`} fill={`url('#typeLeft${styleType}')`} />)
            ta.push(<path key={`shape-right${i}`} d={`M ${(120 * i) + 120} ${320 - h} v ${h + 6} h -60 v ${-h} Z`} fill={`url('#typeRight${styleType}')`} />)
            ta.push(<path key={`shape-top${i}`} d={`M ${120 * i} ${320 - h} l 60 30 l 60 -30 l -60 -30 Z`} fill={`url('#typeTop${styleType}')`} />)
        }
        return ta
    }
    render() {
        return (
            <div>
                {/* <button onClick={() => { this.expand('h1') }}>expand</button>
                <button onClick={() => { this.expand('h2') }}>shrink</button> */}
                <svg
                    style={{
                        display: 'block',
                        transformOrigin: '0% 100%',
                        transform: `scale(${this.state.per})`,
                        overflow: 'visible'
                    }}
                    height="325"
                    width="100%"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="typeTop1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#536088' }} />
                            <stop offset="94%" style={{ stopColor: '#252D48' }} />
                        </linearGradient>
                        <linearGradient id="typeLeft1" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#191D2A' }} />
                            <stop offset="94%" style={{ stopColor: '#39425F' }} />
                        </linearGradient>
                        <linearGradient id="typeRight1" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#191D2A ' }} />
                            <stop offset="94%" style={{ stopColor: '#23293C' }} />
                        </linearGradient>

                        <linearGradient id="typeTop2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#3D78FF' }} />
                            <stop offset="94%" style={{ stopColor: '#74B4F6' }} />
                        </linearGradient>
                        <linearGradient id="typeLeft2" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#2E519F' }} />
                            <stop offset="94%" style={{ stopColor: '#517ED2' }} />
                        </linearGradient>
                        <linearGradient id="typeRight2" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#163C91' }} />
                            <stop offset="94%" style={{ stopColor: '#3E73D3' }} />
                        </linearGradient>
                    </defs>
                    {this.drawShapeD()}
                </svg>
            </div>
        )
    }
}
