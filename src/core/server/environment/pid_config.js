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
  path: 'pid',
  schema: _configSchema.schema.object({
    file: _configSchema.schema.maybe(_configSchema.schema.string()),
    exclusive: _configSchema.schema.boolean({
      defaultValue: false
    })
  })
};
exports.config = config;