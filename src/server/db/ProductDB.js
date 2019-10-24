'use strict';

const Product = require('../product/Product');
const ProductReconciliation = require('../product/ProductReconciliation');
const AbstractDB = require('./AbstractDB');

/** */
const productNameLangs = ['en','pl'];

/** */
const per100Properties = ['energy','carbs','sugars','fat','protein'];

/** */
function getFullName(product) {
    let name = '';
    for (const lang of productNameLangs) {
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
        for (const property of per100Properties) {
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
function getDuplicatedName(product0,product1) {
    const names0 = Product.getNames(product0);
    const names1 = Product.getNames(product1);

    for (const name0 of names0) {
        for (const name1 of names1) {
            if (name0 === name1) {
                return name0;
            }
        }
    }
}

/** */
function validateData(data) {
// must be an array
    if (!Array.isArray(data)) {
        throw new Error(`Products data is not an array`);
    }

// find duplicates
    for (let i0 = 0; i0 < data.length - 1; i0++) {
        for (let i1 = i0 + 1; i1 < data.length; i1++) {
            const duplicatedName = getDuplicatedName(data[i0],data[i1]);
            if (duplicatedName) {
                throw new Error(`Duplicated product ${duplicatedName}`);
            }
        }
    }
}

/** */
class ProductDB extends AbstractDB {
    /** */
    constructor() {
        super('products.json');
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
        validateData(data);
    }

    /** */
    restored(oldProducts) {
        mapProducts(this.findAll());
        if (oldProducts && this.changeListener) {
            const changes = ProductReconciliation.reconcile(
                oldProducts,this.findAll());
            if (changes.added || changes.removed) {
                this.changeListener(changes);
            }
        }
    }
}

module.exports = ProductDB;