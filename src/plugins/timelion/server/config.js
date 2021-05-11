"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configSchema = {
  schema: _configSchema.schema.object({
    graphiteUrls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    ui: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    })
  })
};
exports.configSchema = configSchema;