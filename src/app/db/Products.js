import _ from 'lodash';
import { diacriticsToLatin, indexesOfIgnoreCase } from '../util/util';
import Frontend from '../frontend/Frontend';

/** */
function matchByName(productName,name) {
// return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
    const matches = [];
    return matches;
}

/** */
export default class Products {
    /** */
    static init() {
        return Products.fetch();
    }

    /** */
    static fetch() {
        return new Promise((resolve,reject) => {
            Frontend.get('/products')
                .then((response) => {
                    Products.products = response.data;
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /** */
    static get() {
        return Products.products;
    }

    /** */
    static matchByName(searchValue) {
        const matches = [];
        for (const product of Products.products) {
            let match;
            for (const lang in product.name) {
                const productName = product.name[lang];
                const indexes = indexesOfIgnoreCase(
                    diacriticsToLatin(productName),
                    diacriticsToLatin(searchValue));
                if (indexes) {
                    if (!match) {
                        match = _.clone(product);
                        match.matches = [];
                        match.searchValue = searchValue;
                        matches.push(match);
                    }
                    match.matches.push({ lang,indexes });
                    match.matchLang = lang;
                }
            }
        }
        return matches;
    }
}