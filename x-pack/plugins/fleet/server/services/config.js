"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configService = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Kibana config observable service, *NOT* agent policy
 */


class ConfigService {
  constructor() {
    _defineProperty(this, "observable", null);

    _defineProperty(this, "subscription", null);

    _defineProperty(this, "config", null);
  }

  updateInformation(config) {
    this.config = config;
  }

  start(config$) {
    this.observable = config$;
    this.subscription = this.observable.subscribe(this.updateInformation.bind(this));
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getConfig() {
    return this.config;
  }

}

const configService = new ConfigService();
exports.configService = configService;