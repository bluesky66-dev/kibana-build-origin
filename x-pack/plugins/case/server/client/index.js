"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CaseClientHandler", {
  enumerable: true,
  get: function () {
    return _client.CaseClientHandler;
  }
});
Object.defineProperty(exports, "CaseClient", {
  enumerable: true,
  get: function () {
    return _types.CaseClient;
  }
});
exports.createExternalCaseClient = void 0;

var _client = require("./client");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create a CaseClientHandler to external services (other plugins).
 */


const createExternalCaseClient = clientArgs => {
  const client = new _client.CaseClientHandler(clientArgs);
  return client;
};

exports.createExternalCaseClient = createExternalCaseClient;