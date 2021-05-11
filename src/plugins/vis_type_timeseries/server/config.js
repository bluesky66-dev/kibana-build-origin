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

  /** @deprecated **/
  chartResolution: _configSchema.schema.number({
    defaultValue: 150
  }),

  /** @deprecated **/
  minimumBucketSize: _configSchema.schema.number({
    defaultValue: 10
  })
});

exports.config = config;