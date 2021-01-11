import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MessagesService from '../../services/messages/MessagesService';

/** */
export default class Message extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    /** */
    onCloseClick() {
        MessagesService.removeMessage(this.props.id);
    }

    /** */
    render() {
        const messageClassNames = classNames('message',
            `message-${this.props.type}`);
        return (
            <div className={messageClassNames}>
                <div className="message-close-image"
                    onClick={this.onCloseClick}>
                </div>
                <div className="message-text"
                    onClick={this.onCloseClick}>
                    {this.props.text}
                </div>
            </div>
        );
    }
}

/** */
Message.propTypes = {
    /** */
    id: PropTypes.number,

    /** */
    text: PropTypes.string,

    /** */
    type: PropTypes.string
}