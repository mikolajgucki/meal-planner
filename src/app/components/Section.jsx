import React from 'react';

/** */
export default class Section extends React.Component {
    /** */
    constructor(props) {
        super(props);
    }

    /** */
    render() {
        return (
            <div className="section">
                <div className="section-title">
                    {this.props.title}
                </div>
                <div className="section-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
