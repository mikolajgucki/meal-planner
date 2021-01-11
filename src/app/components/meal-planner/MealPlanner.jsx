import React from 'react';
import classNames from 'classnames';
import IngredientsParser from '../../../common/meal/IngredientsParser';
import ProductsDB from '../../db/ProductsDB';
import MealCalculator from '../../meal/MealCalculator';
import BrowserService from '../../services/browser/BrowserService';
import MealEnergy from './MealEnergy';
import MealIngredientsArea from './MealIngredientsArea';
import MealCalculationArea from './MealCalculationArea';

/** */
const translations = {
    'ingredients': 'Ingredients:',
    'enter.energy': 'Enter energy',
    'pick': 'Pick'
}

/** */
function setError(self,msg) {
    self.mealCalculationAreaRef.current.setError(msg);
    self.setState((prevState) => ({
        ...prevState,
        hasError: true
    }));
}

/** */
function clearError(self) {
    self.mealCalculationAreaRef.current.clearError();
    self.setState((prevState) => ({
        ...prevState,
        hasError: false
    }));
}

/** */
export default class MealPlanner extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            energy: null,
            ingredients: null
        }
        this.onEnergyChange = this.onEnergyChange.bind(this);
        this.onEnergyEnter = this.onEnergyEnter.bind(this);
        this.onSelectProduct = this.onSelectProduct.bind(this);
        this.onIngredientsChange = this.onIngredientsChange.bind(this);
        this.mealEnergyRef = React.createRef();
        this.mealIngredientsAreaRef = React.createRef();
        this.mealCalculationAreaRef = React.createRef();
    }

    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    onEnergyChange(energy) {
        this.setState((prevState) => ({
            ...prevState,
            energy: energy
        }));
        this.calculateMeal(energy,this.state.ingredientsStr);
    }

    /** */
    onEnergyEnter() {
        if (this.state.energy) {
            this.mealIngredientsAreaRef.current.focus();
        }
    }

    /** */
    onSelectProduct() {
        this.mealIngredientsAreaRef.current.showItemSelector();
    }

    /** */
    onIngredientsChange(ingredientsStr) {
        this.setState((prevState) => ({
            ...prevState,
            ingredientsStr
        }));
        this.calculateMeal(this.state.energy,ingredientsStr);
    }

    /** */
    calculateMeal(energy,ingredientsStr) {
        if (!energy) {
            setError(this,this.translate('enter.energy'));
            return;
        }
        clearError(this);

        if (energy && ingredientsStr) {
            let ingredients;
            try {
                ingredients = IngredientsParser.parse(ingredientsStr);
            } catch (error) {
                setError(this,error.msg + ` in line ${error.lineNo}`);
                return;
            }
            if (ingredients.length > 0) {
                try {
                    const meal = MealCalculator.calc(
                        ProductsDB.get(),ingredients,energy);
                    this.mealCalculationAreaRef.current.setMeal(meal);
                } catch (error) {
                    setError(this,error.message);
                    return;
                }
            }
        }
    }

    /** */
    componentDidMount() {
        this.mealEnergyRef.current.focus();
    }

    /** */
    render() {
        const selectProductClassNames = classNames('meal-select-product',
            {'meal-select-product-mobile': BrowserService.isMobile()});
        const mealCalculationClassNames = classNames('meal-calculation',
            {'meal-calculation-no-error': !this.state.hasError});
        return (
            <div className="meal">
                <div className="meal-energy">
                    <MealEnergy ref={this.mealEnergyRef}
                        onEnergyChange={this.onEnergyChange}
                        onEnergyEnter={this.onEnergyEnter}/>
                </div>
                <div className="meal-header">
                    <div className="meal-header-label">
                        {this.translate('ingredients')}
                    </div>
                    <div className={selectProductClassNames}
                        onClick={this.onSelectProduct}>
                        {this.translate('pick')}
                    </div>
                </div>
                <div className="meal-areas">
                    <div className="meal-ingredients">
                        <MealIngredientsArea
                            ref={this.mealIngredientsAreaRef}
                            onIngredientsChange={this.onIngredientsChange}/>
                    </div>
                    <div className={mealCalculationClassNames}>
                        <MealCalculationArea ref={this.mealCalculationAreaRef}/>
                    </div>
                </div>
            </div>
        );
    }
}