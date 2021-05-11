"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enterpriseSearchTelemetryType = void 0;

var _telemetry = require("../../collectors/enterprise_search/telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* istanbul ignore file */


const enterpriseSearchTelemetryType = {
  name: _telemetry.ES_TELEMETRY_NAME,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {}
  }
};
exports.enterpriseSearchTelemetryType = enterpriseSearchTelemetryType;