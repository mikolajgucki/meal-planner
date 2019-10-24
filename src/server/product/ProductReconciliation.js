'use strict';

const Product = require('./Product');

/** */
class ProductReconciliation {
    /** */
    static reconcile(oldProducts,newProducts) {
        const changes = {};

    // added products
        for (const newProduct of newProducts) {
            if (!Product.contains(oldProducts,newProduct)) {
                if (!changes.added) {
                    changes.added = [];
                }
                changes.added.push(newProduct);
            }
        }

    // removed products
        for (const oldProduct of oldProducts) {
            if (!Product.contains(newProducts,oldProduct)) {
                if (!changes.removed) {
                    changes.removed = [];
                }
                changes.removed.push(oldProduct);
            }
        }

    // changed produces
        // for ()

        return changes;
    }
}

module.exports = ProductReconciliation;