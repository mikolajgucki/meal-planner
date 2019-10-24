'use strict';

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
    static compare(productA,productB) {
        
    }
}

module.exports = Product;