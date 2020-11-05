import React from 'react'
import PropTypes from 'prop-types'
import Loading from '../loadableHandler/loading2.js'

export default class CommonLoading extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.string.isRequired,
        spinning: PropTypes.bool.isRequired
    }

    render() {
        if (this.props.spinning) {
            return (
                <div className={this.props.classes}>
                    <Loading />
                    <div style={{ display: 'none' }}>
                        { this.props.children }
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
