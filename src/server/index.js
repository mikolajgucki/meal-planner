'use strict';

const path = require('path');
const fs = require('fs');

const Log = require('./log/Log');
const Cfg = require('./cfg/Cfg');
const DB = require('./db/DB');
const DBWatcher = require('./db/DBWatcher');
const HTTPServer = require('./http/HTTPServer');
const WSServer = require('./ws/WSServer');
const Dispatcher = require('./dispatcher/Dispatcher');

/** */
function initCfg() {
    const cfgFile = path.join(__dirname + '../../../data/cfg.json');
    const cfgDir = path.dirname(cfgFile);

    const jsonCfg = JSON.parse(fs.readFileSync(cfgFile));
    Cfg.init(cfgDir,jsonCfg);
}

/** */
function initDB() {
    DB.init();
    DBWatcher.run();
}

/** */
function runHTTPServer() {
    HTTPServer.run();
}

/** */
function runWSServer() {
    WSServer.run();
}

/** */
function runDispatcher() {
    Dispatcher.run();
}

/** */
function run() {
    initCfg();
    initDB();
    runHTTPServer();
    runWSServer();
    runDispatcher();
}

run();

