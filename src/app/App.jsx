import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import NotFound from './components/not-found/NotFound';
import MainMenu from './components/menu/MainMenu';
import Messages from './components/messages/Messages';
import MealPlannerSection from './components/meal-planner/MealPlannerSection';
import MealsSection from './components/meals/MealsSection';

/** */
export default class App extends React.Component {
    /** */
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/">
                        <MainMenu/>
                    </Route>
                    <Route exact path="/planner">
                        <Messages/>
                        <MealPlannerSection/>
                    </Route>
                    <Route exact path="/meals">
                        <Messages/>
                        <MealsSection/>
                    </Route>
                    <Route path="*">
                        <NotFound/>
                    </Route>
                </Switch>
            </HashRouter>
        );
    }
}
