"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DYNAMIC_SETTINGS_DEFAULTS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DYNAMIC_SETTINGS_DEFAULTS = {
  heartbeatIndices: 'heartbeat-7*',
  certAgeThreshold: 730,
  certExpirationThreshold: 30,
  defaultConnectors: []
};
exports.DYNAMIC_SETTINGS_DEFAULTS = DYNAMIC_SETTINGS_DEFAULTS;