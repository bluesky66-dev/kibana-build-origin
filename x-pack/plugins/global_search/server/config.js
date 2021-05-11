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
  search_timeout: _configSchema.schema.duration({
    defaultValue: '30s'
  })
});

const config = {
  schema: configSchema,
  exposeToBrowser: {
    search_timeout: true
  }
};
exports.config = config;