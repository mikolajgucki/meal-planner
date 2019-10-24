'use strict';

/** */
class HTTPResponse {
    /** */
    static ok(res,data) {
        res.status(200).send(JSON.stringify(data));
    }
}

module.exports = HTTPResponse;