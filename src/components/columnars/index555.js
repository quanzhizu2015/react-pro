import React, { Component } from 'react'
import { autobind } from 'core-decorators'

export default class Columnars extends Component {
    constructor() {
        super()
        this.state = {
            cts: 18,
            isActive: false,
            per: document.body.scrollWidth / 1920
        }
        this.shapes = []
    }
    componentWillMount() {
        for (let i = 0; i < this.state.cts; i += 1) {
            const h1 = (200 * Math.random()) + 60
            this.shapes.push({
                h: -20,
                h1,
                h2: 360 - h1,
                styleType: Math.floor(1 + ((i / 2) % 2))
            })
        }
        this.expand('h1', 1)
        window.addEventListener('resize', this.resizeHandler)
    }
    componentDidMount() {
        this.resizeHandler()
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
        this.drawColumnars()
        if (shapes.length !== 0) {
            this.timeAnimate = setTimeout(() => {
                this.setH(shapes, tag)
            }, 20)
        }
    }
    @autobind
    resizeHandler() {
        this.setState({
            per: document.body.scrollWidth / 1920
        })
    }
    @autobind
    drawColumnars() {
        const ctx = this.cvs.getContext('2d')
        ctx.clearRect(0, 0, 1920, 325)
        for (let i = 0; i < this.shapes.length; i += 1) {
            const { h, styleType } = this.shapes[i]
            const grd = ctx.createLinearGradient(0, 0, 0, h)
            if (styleType === 2) {
                grd.addColorStop(0.06, '#39425F')
                grd.addColorStop(1, '#191D2A')
            } else {
                grd.addColorStop(0.06, '#2E519F')
                grd.addColorStop(1, '#517ED2')
            }
            // ctx.fillStyle = '#fff'
            ctx.fillStyle = grd
            ctx.beginPath()
            ctx.moveTo(120 * i, 320 - h)
            ctx.lineTo(120 * i, 320)
            ctx.lineTo((120 * i) + 61, 320)
            ctx.lineTo((120 * i) + 61, 320 - h)
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            const grd2 = ctx.createLinearGradient(0, 0, 0, h)
            if (styleType === 2) {
                grd2.addColorStop(0.06, '#23293C')
                grd2.addColorStop(1, '#191D2A')
            } else {
                grd2.addColorStop(0.06, '#3E73D3')
                grd2.addColorStop(1, '#163C91')
            }
            // ctx.fillStyle = '#fff'
            ctx.fillStyle = grd2
            ctx.moveTo((120 * i) + 120, 320 - h)
            ctx.lineTo((120 * i) + 120, 320)
            ctx.lineTo((120 * i) + (120 - 60), 320)
            ctx.lineTo((120 * i) + (120 - 60), 320 - h)
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            const grd3 = ctx.createLinearGradient(0, 0, 120, 0)
            if (styleType === 2) {
                grd3.addColorStop(0, '#536088')
                grd3.addColorStop(0.94, '#252D48')
            } else {
                grd3.addColorStop(0.06, '#3D78FF')
                grd3.addColorStop(1, '#74B4F6')
            }
            ctx.moveTo((120 * i), 320 - h)
            ctx.lineTo((120 * i) + 60, (320 - h) + 30)
            ctx.lineTo((120 * i) + 120, 320 - h)
            ctx.lineTo((120 * i) + 60, (320 - h) - 30)
            ctx.fillStyle = grd3
            ctx.closePath()
            ctx.fill()
        }
    }
    expand(tag, sp) {
        if (this.timeAnimate) clearTimeout(this.timeAnimate)
        this.state.isActive = true
        const thiz = this
        const shapes = [...thiz.shapes]
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
    // drawShapeD() {
    //     const ta = []
    //     for (let i = 0; i < this.state.shapes.length; i += 1) {
    //         const { h, styleType } = this.state.shapes[i]
    //         ta.push(<path key={`shape-left${i}`} d={`M ${120 * i} ${320 - h} v ${h} h 61 v ${-h} Z`} fill={`url('#typeLeft${styleType}')`} />)
    //         ta.push(<path key={`shape-right${i}`} d={`M ${(120 * i) + 120} ${320 - h} v ${h} h -60 v ${-h} Z`} fill={`url('#typeRight${styleType}')`} />)
    //         ta.push(<path key={`shape-top${i}`} d={`M ${120 * i} ${320 - h} l 60 30 l 60 -30 l -60 -30 Z`} fill={`url('#typeTop${styleType}')`} />)
    //     }
    //     return ta
    // }
    render() {
        return (
            <div>
                {/* <button onClick={() => { this.expand('h1') }}>expand</button>
                <button onClick={() => { this.expand('h2') }}>shrink</button> */}
                {/* <svg
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
                </svg> */}
                <canvas
                    ref={(ref) => { this.cvs = ref }}
                    width="1920"
                    height="325"
                    style={{
                        display: 'block',
                        transformOrigin: '0% 100%',
                        transform: `scale(${this.state.per})`,
                        overflow: 'visible',
                    }}
                />
            </div>
        )
    }
}
