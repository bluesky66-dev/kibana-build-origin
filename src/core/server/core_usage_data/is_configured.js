"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isConfigured = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Test whether a given config value is configured based on it's schema type.
 * Our configuration schema and code often accept and ignore empty values like
 * `elasticsearch.customHeaders: {}`. However, for telemetry purposes, we're
 * only interested when these values have been set to something that will
 * change the behaviour of Kibana.
 */
const isConfigured = {
  /**
   * config is a string with non-zero length
   */
  string: config => {
    var _config$trim$length, _config$trim, _config$trim$call;

    return ((_config$trim$length = config === null || config === void 0 ? void 0 : (_config$trim = config.trim) === null || _config$trim === void 0 ? void 0 : (_config$trim$call = _config$trim.call(config)) === null || _config$trim$call === void 0 ? void 0 : _config$trim$call.length) !== null && _config$trim$length !== void 0 ? _config$trim$length : 0) > 0;
  },

  /**
   * config is an array with non-zero length
   */
  array: (config, defaultValue) => {
    var _config$length;

    return Array.isArray(config) ? ((_config$length = config === null || config === void 0 ? void 0 : config.length) !== null && _config$length !== void 0 ? _config$length : 0) > 0 && !(0, _lodash.isEqual)(config, defaultValue) : false;
  },

  /**
   * config is a string or array of strings where each element has non-zero length
   */
  stringOrArray: (config, defaultValue) => {
    return Array.isArray(config) ? isConfigured.array(config, defaultValue) : isConfigured.string(config);
  },

  /**
   * config is a record with at least one key
   */
  record: config => {
    return config != null && typeof config === 'object' && Object.keys(config).length > 0;
  },

  /**
   * config is a number
   */
  number: config => {
    // kbn-config-schema already does NaN validation, but doesn't hurt to be sure
    return typeof config === 'number' && !isNaN(config);
  }
};
exports.isConfigured = isConfigured;