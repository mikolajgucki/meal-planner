import React from 'react';

/** */
const translations = {
    title: 'Meal planner'
}

/** */
export default class AppTitle extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return <div className="app-title">{this.translate('title')}</div>;
    }
}
