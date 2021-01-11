import React from 'react';
import IngredientsParser from '../../../common/meal/IngredientsParser';
import MealsDB from '../../db/MealsDB';
import ProductsDB from '../../db/ProductsDB';
import MealCalculator from '../../meal/MealCalculator';
import ItemSelector from '../item-selector/ItemSelector';
import MealCalculationArea from '../meal-planner/MealCalculationArea';

/** */
const translations = {
    'select.meal': 'Select meal:'
}

/** */
function searchMeals(searchValue) {
    return MealsDB.matchByName(searchValue).map(meal => {
        return {
            name: meal.name,
            matches: meal.matches,
            details: meal.time,
            searchValue
        }
    });
}

/** */
function setError(self,msg) {
    self.mealCalculationAreaRef.current.setError(msg);
}

/** */
export default class Meals extends React.Component {
    /** */
    constructor(props) {
        super(props);

        this.itemSelectorRef = React.createRef();
        this.mealCalculationAreaRef = React.createRef();

        this.onItemSelect = this.onItemSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    onItemSelect(mealItem) {
        this.itemSelectorRef.current.blur();

    // find meal
        const lang = 'en';
        const meal = MealsDB.findByName(lang,mealItem.name[lang]);
        if (!meal) {
            setError(this,'Fatal error: meal not found');
            return;
        }

    // parse
        let ingredients;
        try {
            ingredients = IngredientsParser.parse(
                MealsDB.getIngredientsAsString(meal));
        } catch (error) {
            setError(this,`Meal error: ${error.msg} in line ${error.lineNo}`);
            return;
        }

        try {
            const calculatedMeal = MealCalculator.calc(
                ProductsDB.get(),ingredients,meal.energy);
            this.mealCalculationAreaRef.current.setMeal(calculatedMeal);
        } catch (error) {
            setError(this,error.message);
            return;
        }
    }

    /** */
    onCancel() {
        // this.mealCalculationAreaRef.current.setMeal(null);
    }

    /** */
    componentDidMount() {
        this.itemSelectorRef.current.focus();
    }

    /** */
    render() {
        return (
            <div className="meals">
                <div>{this.translate('select.meal')}</div>
                <ItemSelector ref={this.itemSelectorRef}
                    matchByName={searchMeals}
                    onItemSelect={this.onItemSelect}
                    onCancel={this.onCancel}
                    onMaskClick={this.onCancel}/>
                <div className="meals-calculation">
                    <MealCalculationArea ref={this.mealCalculationAreaRef}/>
                </div>
            </div>
        );
    }
}