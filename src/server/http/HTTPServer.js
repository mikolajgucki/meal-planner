'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const Cfg = require('../cfg/Cfg');
const Log = require('../log/Log');
const ProductRoutes = require('./ProductRoutes');

/** */
class HTTPServer {
    /** */
    static addRoutes() {
        ProductRoutes.addRoutes(HTTPServer.app);
    }

    /** */
    static run() {
        HTTPServer.app = express();
        HTTPServer.addRoutes(HTTPServer.app);

        const staticDir = path.join(__dirname,'../../../build');
        Log.info('Will server static files from ' + staticDir);
        HTTPServer.app.use(express.static(staticDir));

        const port = Cfg.getHTTPPort();
        const address = Cfg.getHTTPAddress();

        HTTPServer.appServer = http.createServer(HTTPServer.app);
        HTTPServer.appServer.listen(port,address,() => {
            const address = HTTPServer.appServer.address();
            Log.info('HTTP server listening, address: ' +
                address.address + ', port: ' + address.port + ', family: ' +
                address.family);
        });
    }

    /** */
    static getAppServer() {
        return HTTPServer.appServer;
    }
}

module.exports = HTTPServer;