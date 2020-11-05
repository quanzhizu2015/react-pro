import React from 'react'
import cs from 'classnames'

export default function Step({
    value,
    current,
    children,
    type
}) {
    return (
        <div className={cs('ft-step-item', type, { active: value === current })}>{children}</div>
    )
}

