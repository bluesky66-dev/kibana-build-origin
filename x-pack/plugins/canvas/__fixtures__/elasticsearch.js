"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Client;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function Client() {
  this.indices = {
    putMapping: () => Promise.resolve({
      acknowledged: true
    }),
    exists: () => Promise.resolve(false),
    refresh: () => Promise.resolve()
  };
  this.transport = {};
}

module.exports = exports.default;