import React, { Component } from 'react'
// import Header from '@/components/header'
import './columun.scss'

function Column(props) {
    return (
        <div className="outer">
            <div className={`colu_box ${props.colorS}`} style={props.styleOut}>
                <div data-side="top" style={props.styleIn} />
                <div data-side="right" style={props.styleIn} />
                <div data-side="front" style={props.styleIn} />
            </div>
        </div>
    )
}

export default class ColumnBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnData: [
                {
                    h: 200,
                    colorS: 'black'
                },
                {
                    h: 130,
                    colorS: 'black'
                },
                {
                    h: 150,
                    colorS: 'blue'
                },
                {
                    h: 320,
                    colorS: 'black'
                },
                {
                    h: 130,
                    colorS: 'black'
                },
                {
                    h: 50,
                    colorS: 'blue'
                },
                {
                    h: 200,
                    colorS: 'black'
                },
                {
                    h: 180,
                    colorS: 'blue'
                },
                {
                    h: 100,
                    colorS: 'blue'
                },
                {
                    h: 200,
                    colorS: 'black'
                },
                {
                    h: 320,
                    colorS: 'black'
                },
                {
                    h: 130,
                    colorS: 'blue'
                },
                {
                    h: 150,
                    colorS: 'black'
                },
                {
                    h: 50,
                    colorS: 'black'
                },
                {
                    h: 100,
                    colorS: 'blue'
                },
                {
                    h: 220,
                    colorS: 'black'
                },
            ],
        }
    }
    clickKillMe() {
        const reverseData = []
        this.state.columnData.map((item) => {
            const newH = Math.abs(item.h - 330)
            const obj = {
                h: newH,
                colorS: item.colorS
            }
            return reverseData.push(obj)
        })
        this.setState({ columnData: reverseData })
    }
    render() {
        const { columnData } = this.state
        return (
            <div id="column">
                <button onClick={() => this.clickKillMe()}>点死我吧</button>
                <div className="columnBox">
                    {
                        columnData.map((item, index) => {
                            const styleOut = { height: `${item.h}px` }
                            const styleIn = { top: `${200 - item.h}px` }
                            return <Column styleOut={styleOut} styleIn={styleIn} colorS={item.colorS} key={index} />
                        })
                    }
                </div>
            </div>
        )
    }
}
// className={`colu_box ${props.hclass} ${props.colorS}`}
// const reverseData = []
// for (let i = 0; i <= this.state.columnData.length; i += 1) {
//     const item = this.state.columnData[i]
//     // debugger
//     const newH = Math.abs(item.h - 270)
//     const obj = {
//         h: newH,
//         colorS: item.colorS
//     }
//     reverseData.push(obj)
// }
// this.setState({ columnData: reverseData })
