const _ = require('lodash');
const { compareIgnoreCase } = require('../util/util');

/** */
function findProduct(products,name) {
    for (const product of products) {
        for (const lang in product.name) {
            const productName = product.name[lang];
            if (compareIgnoreCase(productName,name)) {
                return product;
            }
        }
    }
}

/** */
function matchProductNameLang(product,name) {
    for (const lang in product.name) {
        const productName = product.name[lang];
        if (compareIgnoreCase(productName,name)) {
            return lang;
        }
    }
}

/** */
function calcAmountEnergy(products,ingredient) {
    if (ingredient.amount && ingredient.energyPer100) {
        ingredient.calc.amount = ingredient.amount;
        ingredient.calc.energy =
            ingredient.amount / 100 * ingredient.energyPer100;
        return;
    }
    if (ingredient.ratio && ingredient.energyPer100) {
        return;
    }
    if (ingredient.ratio) {
        return;
    }

    const product = findProduct(products,ingredient.name);
    if (!product) {
        throw new Error(`Unknown product ${ingredient.name}`);
    }
    const lang = matchProductNameLang(product,ingredient.name);
    ingredient.name = product.name[lang];
    ingredient.product = product;
    ingredient.calc.unit = product.unit;
    ingredient.calc.amount = ingredient.amount;
    ingredient.calc.energy = ingredient.amount / 100 * product.energyPer100;
}

/** */
function normalizeRatio(ingredients) {
    let ratioSum = 0;
    for (const ingredient of ingredients) {
        if (ingredient.ratio) {
            ratioSum += ingredient.ratio;
        }
    }
    for (const ingredient of ingredients) {
        if (ingredient.ratio) {
            ingredient.ratio /= ratioSum;
        }
    }
}

/** */
function calcRatioEnergy(products,ingredient,remainingEnergy) {
// energy
    if (remainingEnergy > 0) {
        ingredient.calc.energy = ingredient.ratio * remainingEnergy;
    }
    else {
        ingredient.calc.energy = 0;
    }

// amount
    let energyPer100;
    if (ingredient.energyPer100) {
        energyPer100 = ingredient.energyPer100;
    }
    else {
        const product = findProduct(products,ingredient.name);
        if (!product) {
            throw new Error(`Unknown product ${ingredient.name}`);
        }
        const lang = matchProductNameLang(product,ingredient.name);
        ingredient.name = product.name[lang];
        ingredient.product = product;
        ingredient.calc.unit = product.unit;
        energyPer100 = product.energyPer100;
    }
    ingredient.calc.amount = Math.round(
        ingredient.calc.energy * 100 / energyPer100);
    if (ingredient.calc.amount < 0) {
        ingredient.calc.amount = 0;
    }
}

/** */
class MealCalculator {
    /** */
    static calc(products,ingredients,plannedEnergy) {
        const result = {
            ingredients: _.cloneDeep(ingredients),
            plannedEnergy,
            energy: 0
        }

    // energy known upfront
        for (const ingredient of result.ingredients) {
            ingredient.calc = {};

            calcAmountEnergy(products,ingredient);
            if (ingredient.calc.energy) {
                result.energy += ingredient.calc.energy;
            }
        }

        normalizeRatio(result.ingredients);
    // calculate remaining energy
        const remainingEnergy = plannedEnergy - result.energy;
        for (const ingredient of result.ingredients) {
            if (!ingredient.calc.energy) {
                calcRatioEnergy(products,ingredient,remainingEnergy);
                result.energy += ingredient.calc.energy;
            }
        }

        return result;
    }
}

module.exports = MealCalculator;