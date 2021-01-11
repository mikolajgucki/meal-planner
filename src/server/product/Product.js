'use strict';

/** */
const FIELDS_TO_COMPARE = [
    'unit',
    'energyPer100',
    'fatPer100',
    'carbsPer100',
    'sugarsPer100',
    'proteinPer100'
];

/** */
class Product {
    /** */
    static getNames(product) {
        const names = [];
        for (const lang in product.name) {
            let name = product.name[lang];
            if (product.producer) {
                name += ` [${product.producer}]`;
            }
            names.push(name);
        }
        return names;
    }

    /** */
    static compareByFullName(product0,product1) {
        return product0.fullName === product1.fullName;
    }

    /** */
    static contains(products,product) {
        for (const itrProduct of products) {
            if (Product.compareByFullName(itrProduct,product)) {
                return true;
            }
        }
        return false;
    }

    /** */
    static findByFullName(products,fullName) {
        return products.find(product => product.fullName === fullName);
    }

    /** */
    static equal(productA,productB) {
        for (const field of FIELDS_TO_COMPARE) {
            if (productA[field] !== productB[field]) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Product;