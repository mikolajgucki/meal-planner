import React from 'react';

/** */
const translations = {
    'failed.to.start.app': 'Failed to start app:'
}

/** */
export default class FailedToStartAppMessage extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return <div className="failed-to-start-app">
            {this.translate('failed.to.start.app')}
        </div>;
    }
}
