"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "events", {
  enumerable: true,
  get: function () {
    return _events2.events;
  }
});
exports.Esqueue = void 0;

var _events = require("events");

var _worker = require("./worker");

var _constants = require("./constants");

var _lodash = require("lodash");

var _events2 = require("./constants/events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Esqueue extends _events.EventEmitter {
  constructor(store, options = {}) {
    super();
    this.store = store; // for updating jobs in ES

    this.index = this.store.indexPrefix; // for polling for pending jobs

    this.settings = {
      interval: _constants.constants.DEFAULT_SETTING_INTERVAL,
      timeout: _constants.constants.DEFAULT_SETTING_TIMEOUT,
      dateSeparator: _constants.constants.DEFAULT_SETTING_DATE_SEPARATOR,
      ...(0, _lodash.omit)(options, ['client'])
    };
    this.client = options.client;

    this._logger = options.logger || function () {};

    this._workers = [];

    this._initTasks().catch(err => this.emit(_constants.constants.EVENT_QUEUE_ERROR, err));
  }

  _initTasks() {
    const initTasks = [this.client.callAsInternalUser('ping')];
    return Promise.all(initTasks).catch(err => {
      this._logger(['initTasks', 'error'], err);

      throw err;
    });
  }

  registerWorker(type, workerFn, opts) {
    const worker = new _worker.Worker(this, type, workerFn, { ...opts,
      logger: this._logger
    });

    this._workers.push(worker);

    return worker;
  }

  getWorkers() {
    return this._workers.map(fn => fn);
  }

  destroy() {
    const workers = this._workers.filter(worker => worker.destroy());

    this._workers = workers;
  }

}

exports.Esqueue = Esqueue;