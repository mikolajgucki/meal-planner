import React from 'react';
import { Link } from 'react-router-dom';

/** */
const translations = {
    'meal.planner': 'Meal Planner',
    'meal.planner.description':
        'Plan a meal by entering energy and picking ingredients',
    'meals': 'Meals',
    'meals.description': 'Pick a ready meal'
}

/** */
export default class MainMenu extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return (
            <div className="main-menu">
                <div className="main-menu-entry">
                    <Link to="/planner">
                        {this.translate('meal.planner')}
                    </Link>
                    <div className="main-menu-description">
                        {this.translate('meal.planner.description')}
                    </div>
                </div>
                <div className="main-menu-entry">
                    <Link to="/meals">
                        {this.translate('meals')}
                    </Link>
                    <div className="main-menu-description">
                        {this.translate('meals.description')}
                    </div>
                </div>
            </div>
        );
    }
}