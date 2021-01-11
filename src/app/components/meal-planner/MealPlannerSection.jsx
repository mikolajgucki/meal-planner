import React from 'react';
import Section from '../Section';
import MealPlanner from './MealPlanner';

/** */
const translations = {
    'section.title': 'Meal planner'
}

/** */
export default class MealPlannerSection extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return (
            <Section title={this.translate('section.title')}>
                <MealPlanner/>
            </Section>
        );
    }
}