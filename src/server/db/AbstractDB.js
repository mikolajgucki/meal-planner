'use strict';

const path = require('path');
const fs = require('fs');
const Cfg = require('../cfg/Cfg');
const Log = require('../log/Log');
const DBWatcher = require('./DBWatcher');

/** */
function readDB(fileName) {
    const dbFileName = Cfg.getPath(path.join('db',fileName));
    return JSON.parse(fs.readFileSync(dbFileName));
}

/** */
class AbstractDB {
    /** */
    constructor(fileName) {
        this.fileName = fileName;
        this.restore();
    }

    /** */
    restore() {
        const oldData = this.data;
        const newData = readDB(this.fileName);
        if (this.validate) {
            this.validate(newData);
        }
        this.data = newData;
        if (this.restored) {
            this.restored(oldData,newData);
        }
    }

    /** */
    watch() {
        DBWatcher.listenChanged(this.fileName,() => {
            Log.info(`DB file ${this.fileName} changed. Reloading...`);
            try {
                this.restore();
            }
            catch (error) {
                Log.error(`Failed to reload DB ${this.fileName}` + 
                    error.toString());
                if (this.handleDBReloadFailed) {
                    this.handleDBReloadFailed(error);
                }
                return;
            }
            Log.info(`Reloaded DB ${this.fileName}`);
        });
    }

    /** */
    init() {
        this.restore();
    }

    /** */
    findAll() {
        return this.data;
    }
}

module.exports = AbstractDB;