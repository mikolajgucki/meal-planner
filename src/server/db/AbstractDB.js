'use strict';

const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const Cfg = require('../cfg/Cfg');
const Log = require('../log/Log');
const DBWatcher = require('./DBWatcher');

/** */
function readDB(fileName) {
    const dbFileName = Cfg.getPath(path.join('db',fileName));
    return YAML.parse(fs.readFileSync(dbFileName).toString());
}

/** */
function getDuplicatedName(document0,document1,namesFunc) {
    const names0 = namesFunc(document0);
    const names1 = namesFunc(document1);

    for (const name0 of names0) {
        for (const name1 of names1) {
            if (name0 === name1) {
                return name0;
            }
        }
    }
}

/** */
class AbstractDB {
    /** */
    constructor(fileName) {
        this.fileName = fileName;
        this.restore();
    }

    /** */
    validateArray(data) {
        if (!Array.isArray(data)) {
            throw new Error(`${this.fileName}: data is not an array`);
        }
    }

    /** */
    validateNoDuplicatedNames(data,namesFunc) {
        for (let i0 = 0; i0 < data.length - 1; i0++) {
            for (let i1 = i0 + 1; i1 < data.length; i1++) {
                const duplicatedName = getDuplicatedName(
                    data[i0],data[i1],namesFunc);
                if (duplicatedName) {
                    throw new Error(`${this.fileName}: duplicated document ` +
                        `${duplicatedName}`);
                }
            }
        }
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
                Log.error(`Failed to reload DB ${this.fileName}: ` + 
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