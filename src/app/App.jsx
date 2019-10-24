import React from 'react';
import Messages from './components/messages/Messages';
import MealSection from './components/meal/MealSection';

/** */
export default class App extends React.Component {
    /** */
    render() {
        return (
            <div>
                <Messages/>
                <MealSection/>
            </div>
        );
    }
}
