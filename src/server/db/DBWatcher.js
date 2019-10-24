'use strict';

const path = require('path');
const watch = require('watch');
const Log = require('../log/Log');
const Cfg = require('../cfg/Cfg');

/** */
const listeners = {};

/** */
class DBWatcher {
    /** */
    static listenChanged(fileName,listener) {
        listeners[fileName] = listener;
    }

    /** */
    static run() {
        const dir = Cfg.getPath('db');
        Log.info(`Will watch DB files in directory ${dir}`);

        watch.watchTree(dir,(file,current,previous) => {
            if (typeof file === 'string') {
                const fileName = path.basename(file);
                const listener = listeners[fileName];
                if (listener) {
                    listener(file);
                }
            }
        });
    }
}

module.exports = DBWatcher;