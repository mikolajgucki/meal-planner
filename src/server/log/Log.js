'use strict';

/** */
class Log {
    /** */
    static info(msg) {
        console.log('[INFO] ' + msg);
    }

    /** */
    static error(msg) {
        console.log('[EROR] ' + msg);
    }
}

module.exports = Log;