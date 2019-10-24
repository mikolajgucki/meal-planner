import React from 'react';
import Section from '../Section';
import Meal from './Meal';

/** */
const translations = {
    'section.title': 'Meal planner'
}

/** */
export default class MealSection extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return (
            <Section title={this.translate('section.title')}>
                <Meal/>
            </Section>
        );
    }
}