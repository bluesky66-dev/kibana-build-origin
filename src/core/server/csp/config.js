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
const config = {
  // TODO: Move this to server.csp using config deprecations
  // ? https://github.com/elastic/kibana/pull/52251
  path: 'csp',
  schema: _configSchema.schema.object({
    rules: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      defaultValue: [`script-src 'unsafe-eval' 'self'`, `worker-src blob: 'self'`, `style-src 'unsafe-inline' 'self'`]
    }),
    strict: _configSchema.schema.boolean({
      defaultValue: false
    }),
    warnLegacyBrowsers: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
};
exports.config = config;