'use strict';

const ProductDB = require('./ProductDB');

/** */
class DB {
    /** */
    static init() {
        DB.productDB = new ProductDB();
    }

    /** */
    static products() {
        return DB.productDB;
    }
}

module.exports = DB;