"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutOutputRequestSchema = exports.GetOutputsRequestSchema = exports.GetOneOutputRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetOneOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  })
};
exports.GetOneOutputRequestSchema = GetOneOutputRequestSchema;
const GetOutputsRequestSchema = {};
exports.GetOutputsRequestSchema = GetOutputsRequestSchema;
const PutOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
      scheme: ['http', 'https']
    }))),
    ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
    config: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
    config_yaml: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.PutOutputRequestSchema = PutOutputRequestSchema;