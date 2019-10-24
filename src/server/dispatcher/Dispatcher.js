'use strict';

const Log = require('../log/Log');
const DB = require('../db/DB');
const WSServer = require('../ws/WSServer');

/** */
const PRODUCTS_CHANGED = 'products_changed';

/** */
const FAILED_TO_RELOAD_PRODUCTS = 'failed_to_reload_products';

/** */
class Dispatcher {
    /** */
    static run() {
        DB.products().listenChanged((changes) => {
            Log.info('Products changed: '+ JSON.stringify(changes));
            WSServer.broadcast(PRODUCTS_CHANGED,changes);
        });

        DB.products().listenReloadFailed((error) => {
            const errorObject = {
                message: error.toString()
            };
            WSServer.broadcast(FAILED_TO_RELOAD_PRODUCTS,errorObject);
        });
    }
}

module.exports = Dispatcher;