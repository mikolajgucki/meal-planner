'use strict';

const Log = require('../log/Log');
const DB = require('../db/DB');
const HTTPResponse = require('./HTTPResponse');

/** */
class ProductRoutes {
    /** */
    static get(req,res) {
        Log.info('GET /products');
        HTTPResponse.ok(res,DB.products().findAll());
    }

    /** */
    static addRoutes(app) {
        app.get('/products',ProductRoutes.get);
    }
}

module.exports = ProductRoutes;