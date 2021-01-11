import React from 'react';

/** */
const translations = {
    'not.found': '404 Not Found'
}

/** */
export default class NotFound extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return (
            <div className="not-found">
                {this.translate('not.found')}
            </div>
        );
    }
}