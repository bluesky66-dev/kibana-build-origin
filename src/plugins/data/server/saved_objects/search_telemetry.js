"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchTelemetry = void 0;

var _to_v7_12_ = require("./migrations/to_v7_12_0");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const searchTelemetry = {
  name: 'search-telemetry',
  namespaceType: 'agnostic',
  hidden: false,
  mappings: {
    dynamic: false,
    properties: {}
  },
  migrations: {
    '7.12.0': _to_v7_12_.migrate712
  }
};
exports.searchTelemetry = searchTelemetry;