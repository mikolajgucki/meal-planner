import _ from 'lodash';
import { diacriticsToLatin, indexesOfIgnoreCase } from '../../common/util/util';
import Frontend from '../frontend/Frontend';

/** */
export default class ProductsDB {
    /** */
    static init() {
        return ProductsDB.fetch();
    }

    /** */
    static fetch() {
        return new Promise((resolve,reject) => {
            Frontend.get('/products')
                .then((response) => {
                    ProductsDB.products = response.data;
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /** */
    static get() {
        return ProductsDB.products;
    }

    /** */
    static matchByName(searchValue) {
        const matches = [];
        for (const product of ProductsDB.products) {
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