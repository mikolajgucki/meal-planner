import React from 'react';
import { Link } from 'react-router-dom';

/** */
const translations = {
    'menu': 'Menu'
}

/** */
export default class Section extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return (
            <div className="section">
                <div className="section-header">
                    <div className="section-title">
                        {this.props.title}
                    </div>
                    <Link to="/" className="section-menu">
                        {this.translate('menu')}
                    </Link>
                </div>
                <div className="section-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
