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

    // changed products
        for (const oldProduct of oldProducts) {
            const newProduct = Product.findByFullName(
                newProducts,oldProduct.fullName);
            if (newProduct && !Product.equal(oldProduct,newProduct)) {
                if (!changes.changed) {
                    changes.changed = [];
                }
                changes.changed.push(newProduct);
            }
        }

        return changes;
    }
}

module.exports = ProductReconciliation;