import React from 'react';
import Section from '../Section';
import Meals from './Meals';

/** */
const translations = {
    'section.title': 'Meals'
}

/** */
export default class MealsSection extends React.Component {
    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    render() {
        return (
            <Section title={this.translate('section.title')}>
                <Meals/>
            </Section>
        );
    }
}