import { connect } from 'react-redux';
import React from 'react';
import Message from './Message';

/** */
function renderMessages(self) {
    const messages = [];
    for (const message of self.props.messages) {
        messages.push(<Message
            id={message.id}
            text={message.text}
            type={message.type}/>);
    }
    return messages;
}

/** */
class Messages extends React.Component {
    /** */
    constructor(props) {
        super(props);
    }

    /** */
    render() {
        return (
            <div className="messages">
                {renderMessages(this)}
            </div>
        );
    }
}

/** */
function mapStateToProps(state,ownProps) {
    return { ...ownProps, messages: state.messages };
}

export default connect(mapStateToProps)(Messages);