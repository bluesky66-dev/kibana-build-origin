"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.opsConfig = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const opsConfig = {
  path: 'ops',
  schema: _configSchema.schema.object({
    interval: _configSchema.schema.duration({
      defaultValue: '5s'
    }),
    cGroupOverrides: _configSchema.schema.object({
      cpuPath: _configSchema.schema.maybe(_configSchema.schema.string()),
      cpuAcctPath: _configSchema.schema.maybe(_configSchema.schema.string())
    })
  })
};
exports.opsConfig = opsConfig;