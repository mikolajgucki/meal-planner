import io from 'socket.io-client';
import Log from '../log/Log';

/** */
export default class WSClient {
    /** */
    static run() {
        const url = 'http://' + window.location.hostname + ':' +
            window.location.port;
    // connect
        WSClient.socket = io(url);
        WSClient.socket.on('connect',() => {
            Log.info('WebSocket connected');
        });

    // handle events
        WSClient.socket.on('disconnect',(reason) => {
            Log.info('WebSocket disconnected');
        });
        WSClient.socket.on('error',(error) => {
            Log.info('WebSocket error: ' + error.toString());
        });
        WSClient.socket.on('event',(event) => {
            Log.info('WebSocket event: ' + event);
        });
        WSClient.socket.on('message',(messageStr) => {
            Log.info('WebSocket message: ' + messageStr);
            const message = JSON.parse(messageStr);
            for (const listener of WSClient.messageListeners) {
                listener(message.code,message.payload);
            }
        });
    }

    /** */
    static listenMessages(listener) {
        WSClient.messageListeners.push(listener);
    }
}

/** */
WSClient.messageListeners = [];