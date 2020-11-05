import React from 'react'
import cs from 'classnames'

import './index.scss'

export default function Button({
    className,
    type = 'submit',
    tallHeight,
    theme,
    disabled,
    children,
    style,
    onClick
}) {
    const classes = ['trade-button', className]
    if (theme) classes.push(`trade-color-${theme}`)
    if (tallHeight) classes.push('trade-tallHeight')
    return (
        <button
            className={cs(classes)}
            style={style}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
