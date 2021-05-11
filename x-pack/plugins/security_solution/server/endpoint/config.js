"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig$ = createConfig$;
exports.EndpointConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EndpointConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),

  /**
   * Host Configuration
   */
  endpointResultListDefaultFirstPageIndex: _configSchema.schema.number({
    defaultValue: 0
  }),
  endpointResultListDefaultPageSize: _configSchema.schema.number({
    defaultValue: 10
  }),

  /**
   * Alert Configuration
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

exports.EndpointConfigSchema = EndpointConfigSchema;

function createConfig$(context) {
  return context.config.create();
}