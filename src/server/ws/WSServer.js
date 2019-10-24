'use strict';

const socketio = require('socket.io');
const Log = require('../log/Log');
const HTTPServer = require('../http/HTTPServer');

/** */
class WSServer {
    /** */
    static run() {
        Log.info('Starting WebSocket server');
        WSServer.io = socketio(HTTPServer.getAppServer());
        this.io.use((socket,next) => {
            Log.info(`WebSocket connection from ${socket.conn.remoteAddress}`);
            next();
        })
        .on('connection',(socket) => {
            socket.on('message',(message) => {
            });
            socket.on('disconnect',() => {
                Log.info(`WebSocket from ${socket.conn.remoteAddress}` +
                    ` disconnected`);
            });
            socket.on('error',(error) => {
            });
        });
    }

    /** */
    static broadcast(code,payload) {
        const message = { code, payload };
        WSServer.io.send(JSON.stringify(message));
    }
}

module.exports = WSServer;