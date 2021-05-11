"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _os = _interopRequireDefault(require("os"));

var _legacyLogging = require("@kbn/legacy-logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const HANDLED_IN_NEW_PLATFORM = _joi.default.any().description('This key is handled in the new platform ONLY');

var _default = () => _joi.default.object({
  elastic: _joi.default.object({
    apm: HANDLED_IN_NEW_PLATFORM
  }).default(),
  pkg: _joi.default.object({
    version: _joi.default.string().default(_joi.default.ref('$version')),
    branch: _joi.default.string().default(_joi.default.ref('$branch')),
    buildNum: _joi.default.number().default(_joi.default.ref('$buildNum')),
    buildSha: _joi.default.string().default(_joi.default.ref('$buildSha'))
  }).default(),
  env: _joi.default.object({
    name: _joi.default.string().default(_joi.default.ref('$env')),
    dev: _joi.default.boolean().default(_joi.default.ref('$dev')),
    prod: _joi.default.boolean().default(_joi.default.ref('$prod'))
  }).default(),
  dev: HANDLED_IN_NEW_PLATFORM,
  pid: HANDLED_IN_NEW_PLATFORM,
  csp: HANDLED_IN_NEW_PLATFORM,
  server: _joi.default.object({
    name: _joi.default.string().default(_os.default.hostname()),
    // keep them for BWC, remove when not used in Legacy.
    // validation should be in sync with one in New platform.
    // https://github.com/elastic/kibana/blob/master/src/core/server/http/http_config.ts
    basePath: _joi.default.string().default('').allow('').regex(/(^$|^\/.*[^\/]$)/, `start with a slash, don't end with one`),
    host: _joi.default.string().hostname().default('localhost'),
    port: _joi.default.number().default(5601),
    rewriteBasePath: _joi.default.boolean().when('basePath', {
      is: '',
      then: _joi.default.default(false).valid(false),
      otherwise: _joi.default.default(false)
    }),
    autoListen: HANDLED_IN_NEW_PLATFORM,
    cors: HANDLED_IN_NEW_PLATFORM,
    customResponseHeaders: HANDLED_IN_NEW_PLATFORM,
    keepaliveTimeout: HANDLED_IN_NEW_PLATFORM,
    maxPayloadBytes: HANDLED_IN_NEW_PLATFORM,
    publicBaseUrl: HANDLED_IN_NEW_PLATFORM,
    socketTimeout: HANDLED_IN_NEW_PLATFORM,
    ssl: HANDLED_IN_NEW_PLATFORM,
    compression: HANDLED_IN_NEW_PLATFORM,
    uuid: HANDLED_IN_NEW_PLATFORM,
    xsrf: HANDLED_IN_NEW_PLATFORM
  }).default(),
  uiSettings: HANDLED_IN_NEW_PLATFORM,
  logging: _legacyLogging.legacyLoggingConfigSchema,
  ops: _joi.default.object({
    interval: _joi.default.number().default(5000),
    cGroupOverrides: HANDLED_IN_NEW_PLATFORM
  }).default(),
  plugins: HANDLED_IN_NEW_PLATFORM,
  path: HANDLED_IN_NEW_PLATFORM,
  stats: HANDLED_IN_NEW_PLATFORM,
  status: HANDLED_IN_NEW_PLATFORM,
  map: HANDLED_IN_NEW_PLATFORM,
  i18n: HANDLED_IN_NEW_PLATFORM,
  // temporarily moved here from the (now deleted) kibana legacy plugin
  kibana: _joi.default.object({
    enabled: _joi.default.boolean().default(true),
    index: _joi.default.string().default('.kibana'),
    autocompleteTerminateAfter: _joi.default.number().integer().min(1).default(100000),
    // TODO Also allow units here like in elasticsearch config once this is moved to the new platform
    autocompleteTimeout: _joi.default.number().integer().min(1).default(1000)
  }).default(),
  savedObjects: HANDLED_IN_NEW_PLATFORM
}).default();

exports.default = _default;
module.exports = exports.default;