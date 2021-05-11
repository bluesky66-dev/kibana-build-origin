"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppClient = void 0;

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


class AppClient {
  constructor(spaceId, config) {
    this.spaceId = spaceId;
    this.config = config;

    _defineProperty(this, "signalsIndex", void 0);

    _defineProperty(this, "getSignalsIndex", () => this.signalsIndex);

    const configuredSignalsIndex = this.config.signalsIndex;
    this.signalsIndex = `${configuredSignalsIndex}-${this.spaceId}`;
  }

}

exports.AppClient = AppClient;