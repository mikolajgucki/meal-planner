import _ from 'lodash';
import { diacriticsToLatin, indexesOfIgnoreCase } from '../../common/util/util';
import Frontend from '../frontend/Frontend';

/** */
export default class MealsDB {
    /** */
    static init() {
        return MealsDB.fetch();
    }

    /** */
    static fetch() {
        return new Promise((resolve,reject) => {
            Frontend.get('/meals')
                .then((response) => {
                    MealsDB.meals = response.data;
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /** */
    static get() {
        return MealsDB.meals;
    }

    /** */
    static findByName(lang,name) {
        return MealsDB.meals.find(meal => {
            return meal.name[lang] === name;
        });
    }

    /** */
    static matchByName(searchValue) {
        const matches = [];
        for (const meal of MealsDB.meals) {
            let match;
            for (const lang in meal.name) {
                const mealName = meal.name[lang];
                const indexes = indexesOfIgnoreCase(
                    diacriticsToLatin(mealName),
                    diacriticsToLatin(searchValue));
                if (indexes) {
                    if (!match) {
                        match = _.clone(meal);
                        match.matches = [];
                        match.searchValue = searchValue;
                        matches.push(match);
                    }
                    match.matches.push({ lang,indexes });
                    match.matchLang = lang;
                }
            }
        }
        return matches;
    }

    /** */
    static getIngredientsAsString(meal) {
        let str = '';
        for (const ingredient of meal.ingredients) {
            str += ingredient + '\n';
        }
        return str;
    }
}