import Log from '../log/Log';
import WSClient from '../ws/WSClient';
import MessageTypes from '../services/messages/MessageTypes';
import MessagesService from '../services/messages/MessagesService';
import ProductsDB from '../db/ProductsDB';

/** */
const PRODUCTS_CHANGED = 'products_changed';
const FAILED_TO_RELOAD_PRODUCTS = 'failed_to_reload_products';

/** */
const MEALS_CHANGED = 'meals_changed';
const FAILED_TO_RELOAD_MEALS = 'failed_to_reload_meals';

/** */
const translations = {
    'product.added': 'Added product {0}',
    'product.removed': 'Removed product {0}',
    'product.changed': 'Product changed {0}',
    'failed.to.reload.products': 'Products error: {0}',
    'failed.to.fetch.products': 'Failed to fetch products from server',
    'meals.changed': 'Meals changed',
    'failed.to.reload.meals': 'Meals error: {0}',
    'failed.to.fetch.meals': 'Failed to fetch meals from server'
}

/** */
function productsChanged(changes) {
    if (changes.added) {
        for (const newProduct of changes.added) {
            const message = Dispatcher.translate(
                'product.added',newProduct.fullName);
            MessagesService.addMessage(message);
        }
    }
    if (changes.removed) {
        for (const oldProduct of changes.removed) {
            const message = Dispatcher.translate(
                'product.removed',oldProduct.fullName);
            MessagesService.addMessage(message);
        }
    }
    if (changes.changed) {
        for (const changedProduct of changes.changed) {
            const message = Dispatcher.translate(
                'product.changed',changedProduct.fullName);
            MessagesService.addMessage(message);
        }
    }

    ProductsDB.fetch()
        .catch((error) => {
            Log.error('Failed to fetch products: ' + error);
            const message = Dispatcher.translate('failed.to.fetch.products');
            MessagesService.addMessage(message,MessageTypes.ERROR);
        });
}

/** */
function failedToReloadProducts(error) {
    MessagesService.addMessage(Dispatcher.translate(
        'failed.to.reload.products',error.message),MessageTypes.ERROR);
}

/** */
function mealsChanged() {
    MessagesService.addMessage(Dispatcher.translate('meals.changed'));
    MealsDB.fetch()
        .catch((error) => {
            Log.error('Failed to fetch meals: ' + error);
            const message = Dispatcher.translate('failed.to.fetch.meals');
            MessagesService.addMessage(message,MessageTypes.ERROR);
        });
}

/** */
function failedToReloadMeals(error) {
    MessagesService.addMessage(Dispatcher.translate(
        'failed.to.reload.meals',error.message),MessageTypes.ERROR);
}

/** */
export default class Dispatcher {
    /** */
    static translate(key,...args) {
        let msg = translations[key] ? translations[key] : key;
        for (let index = 0; index < args.length; index++) {
            msg = msg.replace('{' + index + '}',args[index]);
        }
        return msg;
    }

    /** */
    static run() {
        WSClient.listenMessages((code,payload) => {
            if (code == PRODUCTS_CHANGED) {
                productsChanged(payload);
            }
            if (code == FAILED_TO_RELOAD_PRODUCTS) {
                failedToReloadProducts(payload);
            }
            if (code == MEALS_CHANGED) {
                mealsChanged(payload);
            }
            if (code == FAILED_TO_RELOAD_MEALS) {
                failedToReloadMeals(payload);
            }
        });
    }
}