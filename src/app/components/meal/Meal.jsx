import React from 'react';
import classNames from 'classnames';
import Products from '../../db/Products';
import IngredientsParser from '../../meal/IngredientsParser';
import MealCalculator from '../../meal/MealCalculator';
import BrowserService from '../../services/browser/BrowserService';
import MealEnergy from './MealEnergy';
import MealIngredientsArea from './MealIngredientsArea';
import MealCalculationArea from './MealCalculationArea';

/** */
const translations = {
    'ingredients': 'Ingredients:',
    'enter.energy': 'Enter energy'
}

/** */
function setError(self,msg) {
    self.mealCalculationAreaRef.current.setError(msg);
}

/** */
export default class Meal extends React.Component {
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
    }

    /** */
    onEnergyEnter() {
        if (this.state.energy) {
            this.mealIngredientsAreaRef.current.focus();
        }
    }

    /** */
    onSelectProduct() {
        this.mealIngredientsAreaRef.current.showProductSelector();
    }

    /** */
    onIngredientsChange(ingredientsStr) {
        this.setState((prevState) => ({
            ...prevState,
            ingredientsStr
        }));
    }

    /** */
    componentDidMount() {
        this.mealEnergyRef.current.focus();
    }

    /** */
    componentDidUpdate() {
        if (!this.state.energy) {
            setError(this,this.translate('enter.energy'));
            return;
        }
        this.mealCalculationAreaRef.current.clearError();

        if (this.state.energy && this.state.ingredientsStr) {
            let ingredients;
            try {
                ingredients = IngredientsParser.parse(
                    this.state.ingredientsStr);
            } catch (error) {
                if (!error.lineNo) {
                    console.error(error);
                }
                setError(this,error.msg + ` in line ${error.lineNo}`);
                return;
            }
            if (ingredients.length > 0) {
                try {
                    const meal = MealCalculator.calc(Products.get(),
                        ingredients,this.state.energy);
                    this.mealCalculationAreaRef.current.setMeal(meal);
                } catch (error) {
                    console.error(error);
                    setError(this,error.message);
                    return;
                }
            }
        }
    }

    /** */
    render() {
        const selectProductClassNames = classNames('meal-select-product',
            {'meal-select-product-mobile': BrowserService.isMobile()});
        return (
            <div class="meal">
                <div className="meal-energy">
                    <MealEnergy ref={this.mealEnergyRef}
                        onEnergyChange={this.onEnergyChange}
                        onEnergyEnter={this.onEnergyEnter}/>
                </div>
                <div className="meal-header">
                    <div className="meal-header-label">
                        {this.translate('ingredients')}
                    </div>
                    <img className={selectProductClassNames}
                        src="img/select.png"
                        onClick={this.onSelectProduct}>
                    </img>
                </div>
                <div class="meal-areas">
                    <div class="meal-ingredients">
                        <MealIngredientsArea
                            ref={this.mealIngredientsAreaRef}
                            onIngredientsChange={this.onIngredientsChange}/>
                    </div>
                    <div class="meal-calculation">
                        <MealCalculationArea ref={this.mealCalculationAreaRef}/>
                    </div>
                </div>
            </div>
        );
    }
}