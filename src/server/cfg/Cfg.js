'use strict';

const path = require('path');

/** */
const defaultHTTPPort = 8080;
const defaultHTTPAddress = '0.0.0.0';

/** */
class Cfg {
    /** */
    static getPath(fileName) {
        return path.normalize(path.join(this.dir,fileName));
    }

    /** */
    static init(dir,cfg) {
        Cfg.dir = dir;
        Cfg.cfg = cfg;
    }

    /** */
    static getHTTPPort() {
        if (!Cfg.cfg.http) {
            return defaultHTTPPort;
        }
        return Cfg.cfg.http.port || defaultHTTPPort;
    }

    /** */
    static getHTTPAddress() {
        if (!Cfg.cfg.address) {
            return defaultHTTPAddress;
        }
        return Cfg.cfg.http.address || defaultHTTPAddress;
    }
}

module.exports = Cfg;