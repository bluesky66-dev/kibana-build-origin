"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  maxRuleImportExportSize: _configSchema.schema.number({
    defaultValue: 10000
  }),
  maxRuleImportPayloadBytes: _configSchema.schema.number({
    defaultValue: 10485760
  }),
  maxTimelineImportExportSize: _configSchema.schema.number({
    defaultValue: 10000
  }),
  maxTimelineImportPayloadBytes: _configSchema.schema.number({
    defaultValue: 10485760
  }),
  [_constants.SIGNALS_INDEX_KEY]: _configSchema.schema.string({
    defaultValue: _constants.DEFAULT_SIGNALS_INDEX
  }),

  /**
   * Host Endpoint Configuration
   */
  endpointResultListDefaultFirstPageIndex: _configSchema.schema.number({
    defaultValue: 0
  }),
  endpointResultListDefaultPageSize: _configSchema.schema.number({
    defaultValue: 10
  }),

  /**
   * Alert Endpoint Configuration
   */
  alertResultListDefaultDateRange: _configSchema.schema.object({
    from: _configSchema.schema.string({
      defaultValue: 'now-15m'
    }),
    to: _configSchema.schema.string({
      defaultValue: 'now'
    })
  }),

  /**
   * Artifacts Configuration
   */
  packagerTaskInterval: _configSchema.schema.string({
    defaultValue: '60s'
  }),
  validateArtifactDownloads: _configSchema.schema.boolean({
    defaultValue: true
  })
});

exports.configSchema = configSchema;

const createConfig = context => context.config.get();

exports.createConfig = createConfig;