'use strict';

const Product = require('../product/Product');
const ProductReconciliation = require('../product/ProductReconciliation');
const AbstractDB = require('./AbstractDB');

/** */
const NAME_LANGS = ['en','pl'];

/** */
const PER_100_PROPERTIES = ['energy','carbs','sugars','fat','protein'];

/** */
function getFullName(product) {
    let name = '';
    for (const lang of NAME_LANGS) {
        if (product.name[lang]) {
            if (name.length > 0) {
                name += ' / ';
            }
            name += product.name[lang];
        }
    }
    if (product.producer) {
        name += ` [${product.producer}]`;
    }
    return name;
}

/** */
function mapProducts(products) {
    for (const product of products) {
        product.fullName = getFullName(product);
        for (const property of PER_100_PROPERTIES) {
            product[`${property}Per100`] = product[`${property}`];
            delete product[`${property}`];
        }
        if (product.producer) {
            for (const lang in product.name) {
                product.name[lang] += ` [${product.producer}]`;
            }
        }
    }
}

/** */
class ProductDB extends AbstractDB {
    /** */
    constructor() {
        super('products.yml');
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
    validate(data) {
        this.validateArray(data);
        this.validateNoDuplicatedNames(data,Product.getNames);
    }

    /** */
    restored(oldProducts) {
        mapProducts(this.findAll());
        if (oldProducts && this.changeListener) {
            const changes = ProductReconciliation.reconcile(
                oldProducts,this.findAll());
            if (changes.added || changes.removed || changes.changed) {
                this.changeListener(changes);
            }
        }
    }

    /** */
    findByName(name) {
        return this.data.find(product => {
            for (const lang in product.name) {
                if (product.name[lang] === name) {
                    return true;
                }
            }
            return false;
        })
    }
}

module.exports = ProductDB;