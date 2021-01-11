import React from 'react';
import classNames from 'classnames';

/** */
const translations = {
    energy: 'Energy',
    carbs: 'Carbohydrates',
    sugars: 'Sugars',
    fat: 'Fat',
    protein: 'Protein',
    'less.than.planned': 'less than planned',
    'more.than.planned': 'more than planned',
    'no.unit': '...'
}

/** */
function renderError(self) {
    if (!self.state.error) {
        return null;
    }
    return (
        <div className="meal-calculation-error">
            {self.state.error}
        </div>
    );
}

/** */
function renderSummaryEntry(amount,unit,name,className) {
    const ingredientClassNames = classNames(
        'meal-calculation-ingredient',{ [className]: !!className });
    return (
        <div className={ingredientClassNames}>
            <div className="meal-calculation-ingredient-amount">
                <div className="meal-calculation-ingredient-value">
                    {amount}
                </div>
                <div className="meal-calculation-ingredient-unit">
                    {unit}
                </div>
            </div>
            <div className="meal-calculation-ingredient-name">
                {name}
            </div>
        </div>
    );
}

/** */
function renderMeal(self) {
    const meal = self.state.meal;
    if (!meal) {
        return null;
    }

// ingredients
    const ingredients = [];
    for (const ingredient of meal.ingredients) {
        const amount = ingredient.calc.amount.toString();
        const unit = ingredient.calc.unit ? ingredient.calc.unit :
            self.translate('no.unit');
        ingredients.push(renderSummaryEntry(amount,unit,ingredient.name));
    }

// separator
    const separator = <div className="meal-calculation-separator"></div>;

// summary
    const summary = [];
    summary.push(renderSummaryEntry(Math.round(meal.energy).toString(),
        'kcal',self.translate('energy')));

// energy
    const energyDiff = Math.round(meal.energy - meal.plannedEnergy);
    if (energyDiff < -25) {
        const energyStr = (-energyDiff).toString();
        summary.push(renderSummaryEntry(energyStr,'kcal',
            self.translate('less.than.planned'),'meal-calculation-warning'));
    }
    if (energyDiff > 25) {
        const energyStr = energyDiff.toString();
        summary.push(renderSummaryEntry(energyStr,'kcal',
            self.translate('more.than.planned'),'meal-calculation-warning'));
    }

    let hasProducts = true;
    for (const ingredient of meal.ingredients) {
        if (!ingredient.product) {
            hasProducts = false;
            break;
        }
    }

    if (hasProducts) {
    // calculate facts
        let facts = {
            carbs: 0,
            sugars: 0,
            fat: 0,
            protein: 0
        };
        for (const ingredient of meal.ingredients) {
            const product = ingredient.product;
            for (const name in facts) {
                const per100 = `${name}Per100`;
                if (facts[name] >= 0 && product[per100] >= 0) {
                    facts[name] += ingredient.calc.amount *
                        product[per100] / 100;
                }
                else {
                    delete facts[name];
                }
            }
        }

    // facts
        for (const name in facts) {
            const factValueStr = Math.round(facts[name]).toString();
            summary.push(renderSummaryEntry(factValueStr,'g',
                self.translate(name),'meal-calculation-fact'));
        }
    }

    return (
        <div className="meal-calculation-meal">
            {ingredients}
            {separator}
            {summary}
        </div>
    );
}

/** */
export default class MealCalculationArea extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    setError(msg) {
        this.setState(() => ({
            error: msg,
            meal: null
        }));
    }

    /** */
    clearError() {
        this.setError(null);
    }

    /** */
    setMeal(meal) {
        this.setState(() => ({
            error: null,
            meal: meal
        }));
    }

    /** */
    render() {
        return (
            <div className="meal-calculation-area">
                {renderError(this)}
                {renderMeal(this)}
            </div>
        );
    }
}