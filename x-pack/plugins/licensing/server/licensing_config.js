"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const configSchema = _configSchema.schema.object({
  api_polling_frequency: _configSchema.schema.duration({
    defaultValue: '30s'
  })
});

const config = {
  schema: _configSchema.schema.object({
    api_polling_frequency: _configSchema.schema.duration({
      defaultValue: '30s'
    })
  }),
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.xpack_main.xpack_api_polling_frequency_millis', 'xpack.licensing.api_polling_frequency')]
};
exports.config = config;