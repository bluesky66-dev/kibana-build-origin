"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BackendFrameworkLib = void 0;

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


class BackendFrameworkLib {
  constructor(adapter, config) {
    this.adapter = adapter;
    this.config = config;

    _defineProperty(this, "log", this.adapter.log);

    _defineProperty(this, "internalUser", this.adapter.internalUser);

    this.validateConfig();
  }

  getConfig() {
    return this.config;
  }

  getUser(request) {
    return this.adapter.getUser(request);
  }
  /**
   * Expired `null` happens when we have no xpack info
   */


  get license() {
    return {
      type: this.adapter.info ? this.adapter.info.license.type : 'unknown',
      expired: this.adapter.info ? this.adapter.info.license.expired : null
    };
  }

  get securityIsEnabled() {
    return this.adapter.info ? this.adapter.info.security.enabled : false;
  }

  validateConfig() {
    const encryptionKey = this.config.encryptionKey;

    if (!encryptionKey) {
      this.adapter.log('Using a default encryption key for xpack.beats.encryptionKey. It is recommended that you set xpack.beats.encryptionKey in kibana.yml with a unique token');
    }
  }

}

exports.BackendFrameworkLib = BackendFrameworkLib;