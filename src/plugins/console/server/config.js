"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  proxyFilter: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: ['.*']
  }),
  ssl: _configSchema.schema.object({
    verify: _configSchema.schema.boolean({
      defaultValue: false
    })
  }, {}),
  // This does not actually work, track this issue: https://github.com/elastic/kibana/issues/55576
  proxyConfig: _configSchema.schema.arrayOf(_configSchema.schema.object({
    match: _configSchema.schema.object({
      protocol: _configSchema.schema.string({
        defaultValue: '*'
      }),
      host: _configSchema.schema.string({
        defaultValue: '*'
      }),
      port: _configSchema.schema.string({
        defaultValue: '*'
      }),
      path: _configSchema.schema.string({
        defaultValue: '*'
      })
    }),
    timeout: _configSchema.schema.number(),
    ssl: _configSchema.schema.object({
      verify: _configSchema.schema.boolean(),
      ca: _configSchema.schema.arrayOf(_configSchema.schema.string()),
      cert: _configSchema.schema.string(),
      key: _configSchema.schema.string()
    }, {
      defaultValue: undefined
    })
  }), {
    defaultValue: []
  })
}, {
  defaultValue: undefined
});

exports.config = config;