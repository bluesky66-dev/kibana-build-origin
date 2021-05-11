"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmTelemetry = void 0;

var _apm_saved_object_constants = require("../../common/apm_saved_object_constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const apmTelemetry = {
  name: _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_ID,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {}
  }
};
exports.apmTelemetry = apmTelemetry;