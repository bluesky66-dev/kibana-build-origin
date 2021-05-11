"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configSchema = _configSchema.schema.object({
  uiCounters: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    debug: _configSchema.schema.boolean({
      defaultValue: _configSchema.schema.contextRef('dev')
    })
  }),
  maximumWaitTimeForAllCollectorsInS: _configSchema.schema.number({
    defaultValue: _constants.DEFAULT_MAXIMUM_WAIT_TIME_FOR_ALL_COLLECTORS_IN_S
  })
});

exports.configSchema = configSchema;
const config = {
  schema: configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('ui_metric.enabled', 'usageCollection.uiCounters.enabled'), renameFromRoot('ui_metric.debug', 'usageCollection.uiCounters.debug'), renameFromRoot('usageCollection.uiMetric.enabled', 'usageCollection.uiCounters.enabled'), renameFromRoot('usageCollection.uiMetric.debug', 'usageCollection.uiCounters.debug')],
  exposeToBrowser: {
    uiCounters: true
  }
};
exports.config = config;