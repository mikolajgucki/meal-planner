'use strict';

const ProductDB = require('./ProductDB');
const MealDB = require('./MealDB');

/** */
class DB {
    /** */
    static init() {
        DB.productDB = new ProductDB();
        DB.mealDB = new MealDB();
    }

    /** */
    static products() {
        return DB.productDB;
    }

    /** */
    static meals() {
        return DB.mealDB;
    }
}

module.exports = DB;