'use strict';

const Log = require('../log/Log');
const DB = require('../db/DB');
const HTTPResponse = require('./HTTPResponse');

/** */
class MealRoutes {
    /** */
    static get(req,res) {
        Log.info('GET /meals');
        HTTPResponse.ok(res,DB.meals().findAll());
    }

    /** */
    static addRoutes(app) {
        app.get('/meals',MealRoutes.get);
    }
}

module.exports = MealRoutes;