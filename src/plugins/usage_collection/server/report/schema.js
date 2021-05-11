"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _analytics = require("@kbn/analytics");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const reportSchema = _configSchema.schema.object({
  reportVersion: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal(3)])),
  userAgent: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    key: _configSchema.schema.string(),
    type: _configSchema.schema.string(),
    appName: _configSchema.schema.string(),
    userAgent: _configSchema.schema.string()
  }))),
  uiCounter: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    key: _configSchema.schema.string(),
    type: _configSchema.schema.oneOf([_configSchema.schema.literal(_analytics.METRIC_TYPE.CLICK), _configSchema.schema.literal(_analytics.METRIC_TYPE.LOADED), _configSchema.schema.literal(_analytics.METRIC_TYPE.COUNT)]),
    appName: _configSchema.schema.string(),
    eventName: _configSchema.schema.string(),
    total: _configSchema.schema.number()
  }))),
  application_usage: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    minutesOnScreen: _configSchema.schema.number(),
    numberOfClicks: _configSchema.schema.number(),
    appId: _configSchema.schema.string(),
    viewId: _configSchema.schema.string()
  })))
});

exports.reportSchema = reportSchema;