import WSClient from '../ws/WSClient';
import MessageTypes from '../services/messages/MessageTypes';
import MessagesService from '../services/messages/MessagesService';
import Products from '../db/Products';

/** */
const PRODUCTS_CHANGED = 'products_changed';

/** */
const FAILED_TO_RELOAD_PRODUCTS = 'failed_to_reload_products';

/** */
const translations = {
    'product.added': 'Added product {0}',
    'product.removed': 'Removed product {0}',
    'failed.to.fetch': 'Failed to fetch products from server'
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

    Products.fetch()
        .catch((error) => {
            const message = Dispatcher.translate('failed.to,fetch');
            MessagesService.addMessage(message,MessageTypes.ERROR);
        });
}

/** */
function failedToReloadProducts(error) {
    MessagesService.addMessage(error.message,MessageTypes.ERROR);
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
                console.log(payload.message);
                failedToReloadProducts(payload);
            }
        });
    }
}