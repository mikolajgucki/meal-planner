'use strict';

const { parseInteger } = require('../../common/util/util');
const IngredientsParser = require('../../common/meal/IngredientsParser');
const Meal = require('../meal/Meal');
const AbstractDB = require('./AbstractDB');
const DB = require('./DB');

/** */
const NAME_LANGS = ['en','pl'];

/** */
const TIMES = ['breakfast','brunch','lunch','tea','supper'];

/** */
function getFullName(meal) {
    let name = '';
    for (const lang of NAME_LANGS) {
        if (meal.name[lang]) {
            if (name.length > 0) {
                name += ' / ';
            }
            name += meal.name[lang];
        }
    }
    return name;
}

/** */
function validateTime(self,data) {
    for (const meal of data) {
        if (!meal.time) {
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `without time`);
        }
        if (!TIMES.includes(meal.time)) {
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `with invalid time ${meal.time}`);
        }
    }
}

/** */
function validateEnergy(self,data) {
    for (const meal of data) {
        if (!meal.energy) {
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `without energy`);
        }
        const energy = parseInteger(meal.energy);
        if (isNaN(energy) || energy <= 0) {
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `with invalid energy ${meal.energy}`);
        }
    }
}

/** */
function validateIngredients(self,data) {
    for (const meal of data) {
    // contains ingredients as array
        if (!meal.ingredients) {
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `without ingredients`);
        }
        if (!Array.isArray(meal.ingredients)) {
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `with invalid ingredients`);
        }

    // try to parse
        let ingredients = '';
        for (const ingredient of meal.ingredients) {
            ingredients += ingredient + '\n';
        }
        try {
            IngredientsParser.parse(ingredients);
        } catch (error) {
            console.log(error.stack);
            const fullName = getFullName(meal);
            throw new Error(`${self.fileName}: meal ${fullName} ` +
                `with invalid ingredients: ${error.msg}`);
        }
    }
}

/** */
class MealDB extends AbstractDB {
    /** */
    constructor() {
        super('meals.yml');
        this.watch();
    }

    /** */
    listenChanged(listener) {
        this.changeListener = listener;
    }

    /** */
    listenReloadFailed(listener) {
        this.reloadFailedListener = listener;
    }

    /** */
    handleDBReloadFailed(error) {
        if (this.reloadFailedListener) {
            this.reloadFailedListener(error);
        }
    }

    /** */
    restored(/*oldMeals*/) {
        if (this.changeListener) {
            this.changeListener();
        }
    }

    /** */
    validate(data) {
        this.validateArray(data);
        this.validateNoDuplicatedNames(data,Meal.getNames);
        validateTime(this,data);
        validateEnergy(this,data);
        validateIngredients(this,data);
    }
}

module.exports = MealDB;