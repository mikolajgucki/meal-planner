import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Log from './log/Log';
import Products from './db/Products';
import BrowserService from './services/browser/BrowserService';
import StateService from './services/state/StateService';
import reducers from './services/reducers';
import Dispatcher from './dispatcher/Dispatcher';
import WSClient from './ws/WSClient';
import App from './App';

import MessagesService from './services/messages/MessagesService';

/** */
function init() {
    return new Promise((resolve,reject) => {
        Products.init()
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
     });
}

/** */
function failedToInit(error) {
    Log.error(error);
}

/** */
function createReduxStore() {
    return createStore(reducers);
}

/** */
function run() {
    const store = createReduxStore();
    BrowserService.init();
    StateService.init(store);
    Dispatcher.run();
    WSClient.run();
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('root'));
}

init()
    .then(() => {
        run();
    })
    .catch((error) => {
        failedToInit(error);
    });
